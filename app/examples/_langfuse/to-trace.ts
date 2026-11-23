import type { LangfuseObservation } from "./observation";
import type { NodeKind, NodeStatus, Session, Tokens, Trace, TraceNode, TraceTotals } from "./model";

export type BuildOptions = { asOf?: number };

const KINDS: Record<string, NodeKind> = {
  AGENT: "agent",
  GENERATION: "generation",
  TOOL: "tool",
  SPAN: "span",
  CHAIN: "chain",
  RETRIEVER: "retriever",
  EVALUATOR: "evaluator",
  EMBEDDING: "embedding",
  GUARDRAIL: "guardrail",
  EVENT: "event",
};

export const kindOf = (type: string): NodeKind => KINDS[type.toUpperCase()] ?? "span";

const ms = (iso: string) => Date.parse(iso);
const byStart = (a: LangfuseObservation, b: LangfuseObservation) => ms(a.startTime) - ms(b.startTime) || a.id.localeCompare(b.id);

function tokensOf(row: LangfuseObservation): Tokens | undefined {
  const usage = row.usageDetails;
  if (!usage || (usage.input === undefined && usage.output === undefined && usage.total === undefined)) return undefined;
  const buckets = Object.entries(usage).reduce((sum, [key, value]) => (key === "total" ? sum : sum + value), 0);
  const tokens: Tokens = { input: usage.input ?? 0, output: usage.output ?? 0, total: usage.total ?? buckets };
  if (usage.input_cached_tokens !== undefined) tokens.cached = usage.input_cached_tokens;
  return tokens;
}

const costOf = (row: LangfuseObservation) => row.totalCost ?? row.costDetails?.total ?? null;

const addTokens = (a: Tokens | null, b: Tokens | null): Tokens | null => {
  if (!a || !b) return a ?? b;
  const sum: Tokens = { input: a.input + b.input, output: a.output + b.output, total: a.total + b.total };
  if (a.cached !== undefined || b.cached !== undefined) sum.cached = (a.cached ?? 0) + (b.cached ?? 0);
  return sum;
};

const addCost = (a: number | null, b: number | null) => (a === null || b === null ? (a ?? b) : a + b);

const first = <T>(rows: LangfuseObservation[], pick: (row: LangfuseObservation) => T | null | undefined) => {
  for (const row of rows) {
    const value = pick(row);
    if (value !== null && value !== undefined) return value;
  }
  return undefined;
};

function buildTrace(rows: LangfuseObservation[], { asOf }: BuildOptions): Trace {
  const sorted = [...rows].sort(byStart);
  const byId = new Map(sorted.map((row) => [row.id, row]));
  const t0 = ms(sorted[0].startTime);
  const horizon = asOf ?? Math.max(...sorted.map((row) => (row.endTime ? ms(row.endTime) : ms(row.startTime))));

  const kids = new Map<string, LangfuseObservation[]>();
  const roots: LangfuseObservation[] = [];
  for (const row of sorted) {
    const parent = row.parentObservationId && row.parentObservationId !== row.id && byId.has(row.parentObservationId) ? row.parentObservationId : null;
    if (parent) kids.set(parent, [...(kids.get(parent) ?? []), row]);
    else roots.push(row);
  }

  const order: { row: LangfuseObservation; depth: number }[] = [];
  const treeParent = new Map<string, string | null>();
  const visit = (row: LangfuseObservation, depth: number, parent: string | null) => {
    if (treeParent.has(row.id)) return;
    treeParent.set(row.id, parent);
    order.push({ row, depth });
    for (const child of kids.get(row.id) ?? []) visit(child, depth + 1, row.id);
  };
  for (const root of roots) visit(root, 0, null);
  for (const row of sorted) visit(row, 0, null);

  const failing = new Set(sorted.filter((row) => row.level?.toUpperCase() === "ERROR").map((row) => row.id));
  const errorBelow = new Set<string>();
  const usageBelow = new Set<string>();
  const costBelow = new Set<string>();
  for (let i = order.length - 1; i >= 0; i--) {
    const { row } = order[i];
    const parent = treeParent.get(row.id);
    if (!parent) continue;
    if (failing.has(row.id) || errorBelow.has(row.id)) errorBelow.add(parent);
    if (tokensOf(row) || usageBelow.has(row.id)) usageBelow.add(parent);
    if (costOf(row) !== null || costBelow.has(row.id)) costBelow.add(parent);
  }

  const childIds = new Map<string, string[]>();
  for (const { row } of order) {
    const parent = treeParent.get(row.id);
    if (parent) childIds.set(parent, [...(childIds.get(parent) ?? []), row.id]);
  }

  const nodes = order.map(({ row, depth }): TraceNode => {
    const level = row.level?.toUpperCase();
    const start = ms(row.startTime);
    const end = row.endTime ? ms(row.endTime) : horizon;
    const status: NodeStatus = level === "ERROR" ? "error" : !row.endTime ? "running" : level === "WARNING" ? "warning" : "ok";
    return {
      id: row.id,
      parentId: treeParent.get(row.id) ?? null,
      childIds: childIds.get(row.id) ?? [],
      depth,
      kind: kindOf(row.type),
      type: row.type,
      name: row.name,
      start: start - t0,
      duration: Math.max(0, end - start),
      status,
      failure: failing.has(row.id) ? (errorBelow.has(row.id) ? "propagated" : "origin") : null,
      statusMessage: row.statusMessage ?? undefined,
      model: row.model ?? undefined,
      tokens: tokensOf(row),
      cost: costOf(row),
      ttft: row.timeToFirstToken === undefined || row.timeToFirstToken === null ? undefined : row.timeToFirstToken * 1000,
      input: row.input ?? undefined,
      output: row.output ?? undefined,
    };
  });

  let tokens: Tokens | null = null;
  let cost: number | null = null;
  for (const node of nodes) {
    if (node.tokens && !usageBelow.has(node.id)) tokens = addTokens(tokens, node.tokens);
    if (node.cost !== null && !costBelow.has(node.id)) cost = addCost(cost, node.cost);
  }

  const totals: TraceTotals = {
    nodes: nodes.length,
    generations: nodes.filter((node) => node.kind === "generation").length,
    tools: nodes.filter((node) => node.kind === "tool").length,
    errors: nodes.filter((node) => node.failure === "origin").length,
    failedNodes: nodes.filter((node) => node.status === "error").length,
    warnings: nodes.filter((node) => node.status === "warning").length,
    tokens,
    cost,
    models: [...new Set(nodes.flatMap((node) => (node.model ? [node.model] : [])))],
  };

  const rootIds = nodes.filter((node) => node.parentId === null).map((node) => node.id);
  return {
    id: sorted[0].traceId,
    name: first(sorted, (row) => row.traceName) ?? byId.get(rootIds[0])?.name ?? sorted[0].name,
    startedAt: t0,
    duration: Math.max(...nodes.map((node) => node.start + node.duration)),
    running: sorted.some((row) => !row.endTime),
    environment: first(sorted, (row) => row.environment),
    userId: first(sorted, (row) => row.userId),
    sessionId: first(sorted, (row) => row.sessionId),
    release: first(sorted, (row) => row.release),
    tags: first(sorted, (row) => (row.tags?.length ? row.tags : null)) ?? [],
    nodes,
    rootIds,
    totals,
  };
}

export function toTraces(rows: LangfuseObservation[], options: BuildOptions = {}): Trace[] {
  const groups = new Map<string, LangfuseObservation[]>();
  for (const row of rows) groups.set(row.traceId, [...(groups.get(row.traceId) ?? []), row]);
  return [...groups.values()].map((group) => buildTrace(group, options)).sort((a, b) => a.startedAt - b.startedAt || a.id.localeCompare(b.id));
}

const NO_TOTALS: TraceTotals = { nodes: 0, generations: 0, tools: 0, errors: 0, failedNodes: 0, warnings: 0, tokens: null, cost: null, models: [] };

export function toSession(rows: LangfuseObservation[], options: BuildOptions = {}): Session {
  const traces = toTraces(rows, options);
  if (traces.length === 0) return { id: null, startedAt: 0, duration: 0, traces, totals: NO_TOTALS };
  const startedAt = Math.min(...traces.map((trace) => trace.startedAt));
  const end = Math.max(...traces.map((trace) => trace.startedAt + trace.duration));
  const totals = traces.reduce<TraceTotals>(
    (sum, trace) => ({
      nodes: sum.nodes + trace.totals.nodes,
      generations: sum.generations + trace.totals.generations,
      tools: sum.tools + trace.totals.tools,
      errors: sum.errors + trace.totals.errors,
      failedNodes: sum.failedNodes + trace.totals.failedNodes,
      warnings: sum.warnings + trace.totals.warnings,
      tokens: addTokens(sum.tokens, trace.totals.tokens),
      cost: addCost(sum.cost, trace.totals.cost),
      models: [...new Set([...sum.models, ...trace.totals.models])],
    }),
    NO_TOTALS,
  );
  return { id: first(rows, (row) => row.sessionId) ?? null, startedAt, duration: end - startedAt, traces, totals };
}

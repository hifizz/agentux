import { autoAxis, fitAxis, type Axis } from "../_trace-kit/axis";
import type { NodeKind, Tokens, Trace, TraceNode } from "./model";

export type TraceFilter = "all" | "generations" | "tools" | "errors";

export const INSTANT_MS = 50;
export const FOLD_ABOVE = 60;

const WORK_KINDS: NodeKind[] = ["generation", "tool", "retriever", "embedding", "evaluator", "guardrail"];

const TONES: Record<NodeKind, string> = {
  generation: "llm",
  embedding: "llm",
  tool: "tool",
  retriever: "tool",
  evaluator: "evaluator",
  guardrail: "guardrail",
  agent: "agent",
  chain: "agent",
  span: "agent",
  event: "agent",
};

export const toneOf = (node: TraceNode) => (node.failure === "origin" ? "error" : TONES[node.kind]);

export const isWork = (node: TraceNode) => WORK_KINDS.includes(node.kind);

export const isInstant = (node: TraceNode) => node.childIds.length === 0 && node.duration < INSTANT_MS;

export const countInstants = (trace: Trace) => trace.nodes.filter((node) => isInstant(node) && node.failure === null).length;

export function defaultFolded(trace: Trace): Set<string> {
  if (trace.nodes.length <= FOLD_ABOVE) return new Set();
  return new Set(trace.nodes.filter((node) => node.depth >= 2 && node.childIds.length > 0).map((node) => node.id));
}

const MATCH: Record<TraceFilter, (node: TraceNode) => boolean> = {
  all: () => true,
  generations: (node) => node.kind === "generation",
  tools: (node) => node.kind === "tool",
  errors: (node) => node.failure !== null,
};

export function visibleIds(trace: Trace, filter: TraceFilter, hideInstant: boolean): Set<string> {
  const keep = new Set<string>();
  for (const node of trace.nodes) {
    if (MATCH[filter](node) && !(hideInstant && isInstant(node) && node.failure === null)) keep.add(node.id);
  }
  for (let i = trace.nodes.length - 1; i >= 0; i--) {
    const node = trace.nodes[i];
    if (keep.has(node.id) && node.parentId) keep.add(node.parentId);
  }
  return keep;
}

export const axisOf = (trace: Trace): Axis => (trace.running ? autoAxis(trace.duration) : fitAxis(trace.duration));

export const slowest = (trace: Trace, count = 3) =>
  trace.nodes
    .filter((node) => isWork(node) && node.duration >= INSTANT_MS)
    .sort((a, b) => b.duration - a.duration || a.start - b.start)
    .slice(0, count);

export const failureOrigins = (trace: Trace) => trace.nodes.filter((node) => node.failure === "origin").sort((a, b) => a.start - b.start);

export function pathTo(trace: Trace, id: string): TraceNode[] {
  const byId = new Map(trace.nodes.map((node) => [node.id, node]));
  const path: TraceNode[] = [];
  for (let node = byId.get(id); node; node = node.parentId ? byId.get(node.parentId) : undefined) path.unshift(node);
  return path;
}

export function speedOf(node: TraceNode): number | null {
  const output = node.tokens?.output;
  if (!output || node.ttft === undefined || node.duration <= node.ttft) return null;
  return Math.round(output / ((node.duration - node.ttft) / 1000));
}

export const cachedShare = (tokens: Tokens | null | undefined) => (tokens && tokens.total > 0 && tokens.cached ? tokens.cached / tokens.total : null);

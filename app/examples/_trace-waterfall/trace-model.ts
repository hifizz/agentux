import { autoAxis, tagSide } from "../_trace-kit/axis";
import type { Span, SpanMark, SpanStatus, SpanView, TraceTotals, TraceView } from "./types";

export type TraceTree = {
  order: Span[];
  depth: Map<string, number>;
  kids: Map<string, string[]>;
  total: number;
};

export function buildTree(spans: Span[]): TraceTree {
  const byParent = new Map<string | null, Span[]>();
  for (const span of spans) byParent.set(span.parentId, [...(byParent.get(span.parentId) ?? []), span]);
  const order: Span[] = [];
  const depth = new Map<string, number>();
  const kids = new Map<string, string[]>();
  const visit = (parent: string | null, level: number) => {
    for (const span of (byParent.get(parent) ?? []).sort((a, b) => a.start - b.start)) {
      order.push(span);
      depth.set(span.id, level);
      kids.set(span.id, (byParent.get(span.id) ?? []).map((child) => child.id));
      visit(span.id, level + 1);
    }
  };
  visit(null, 0);
  return { order, depth, kids, total: Math.max(...spans.map((span) => span.start + span.duration)) };
}

const progressOf = (span: Span, now: number) => Math.min(1, Math.max(0, (now - span.start) / span.duration));

export function viewAt(tree: TraceTree, now: number): TraceView {
  const started = tree.order.filter((span) => span.start <= now);
  const startedIds = new Set(started.map((span) => span.id));
  const byId = new Map(tree.order.map((span) => [span.id, span]));
  const leavesUnder = (id: string): Span[] => {
    const children = tree.kids.get(id) ?? [];
    return children.length ? children.flatMap((child) => leavesUnder(child)) : [byId.get(id)!];
  };

  const finishedLeaves = started.filter((span) => !(tree.kids.get(span.id)?.length) && now >= span.start + span.duration);
  const slowestId = finishedLeaves.length ? finishedLeaves.reduce((a, b) => (b.duration > a.duration ? b : a)).id : null;
  const axis = autoAxis(Math.min(now, tree.total));

  const rows = started.map((span): SpanView => {
    const children = tree.kids.get(span.id) ?? [];
    const leaves = children.length ? leavesUnder(span.id).filter((leaf) => startedIds.has(leaf.id)) : [span];
    const end = span.start + span.duration;
    const elapsed = Math.min(now, end) - span.start;
    const status: SpanStatus = now < end ? "running" : span.failed ? "failed" : "done";
    const marks: SpanMark[] = children.length
      ? leaves.map((leaf) => ({ id: leaf.id, kind: leaf.kind, start: leaf.start, duration: Math.min(now, leaf.start + leaf.duration) - leaf.start }))
      : [];
    return {
      span,
      depth: tree.depth.get(span.id) ?? 0,
      status,
      elapsed,
      cost: leaves.reduce((sum, leaf) => sum + (leaf.cost ?? 0) * progressOf(leaf, now), 0),
      tokensIn: leaves.reduce((sum, leaf) => sum + (leaf.tokensIn ?? 0) * progressOf(leaf, now), 0),
      tokensOut: leaves.reduce((sum, leaf) => sum + (leaf.tokensOut ?? 0) * progressOf(leaf, now), 0),
      childCount: children.filter((child) => startedIds.has(child)).length ? leaves.length : 0,
      marks,
      slowest: span.id === slowestId,
      side: tagSide(span.start, elapsed, axis.range),
    };
  });

  const leaves = rows.filter((row) => !(tree.kids.get(row.span.id)?.length));
  const totals: TraceTotals = {
    duration: Math.min(now, tree.total),
    cost: leaves.reduce((sum, row) => sum + row.cost, 0),
    tokens: leaves.reduce((sum, row) => sum + row.tokensIn + row.tokensOut, 0),
    llmCalls: leaves.filter((row) => row.span.kind === "llm").length,
    toolCalls: leaves.filter((row) => row.span.kind === "tool").length,
    errors: leaves.filter((row) => row.status === "failed").length,
  };
  return { rows, totals, axis, now, done: now >= tree.total };
}

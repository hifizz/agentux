import type { Session, Trace, TraceNode } from "./model";
import { failureOrigins, isFailed, slowest } from "./view-model";

export type TurnState = "running" | "failed" | "partial" | "ok";

export type Turn = { index: number; trace: Trace; offset: number; state: TurnState };

export type TurnFilter = "all" | "issues";

export type StripItem = { type: "turn"; turn: Turn; weight: number } | { type: "gap"; ms: number; long: boolean };

export const LONG_GAP_MS = 5 * 60_000;

export function stateOf(trace: Trace): TurnState {
  if (isFailed(trace)) return "failed";
  if (trace.running) return "running";
  return trace.totals.errors > 0 ? "partial" : "ok";
}

export const turnsOf = (session: Session): Turn[] =>
  session.traces.map((trace, index) => ({ index, trace, offset: trace.startedAt - session.startedAt, state: stateOf(trace) }));

export const hasIssues = (turn: Turn) => turn.state === "failed" || turn.state === "partial";

export const filterTurns = (turns: Turn[], filter: TurnFilter) => (filter === "issues" ? turns.filter(hasIssues) : turns);

export function stripOf(turns: Turn[]): StripItem[] {
  const longest = Math.max(1, ...turns.map((turn) => turn.trace.duration));
  const items: StripItem[] = [];
  turns.forEach((turn, i) => {
    if (i > 0) {
      const previous = turns[i - 1].trace;
      const ms = Math.max(0, turn.trace.startedAt - (previous.startedAt + previous.duration));
      items.push({ type: "gap", ms, long: ms >= LONG_GAP_MS });
    }
    items.push({ type: "turn", turn, weight: 0.15 + 0.85 * Math.sqrt(turn.trace.duration / longest) });
  });
  return items;
}

export function defaultOpen(turns: Turn[]): string | null {
  const pick =
    turns.find((turn) => turn.state === "failed") ??
    turns.find((turn) => turn.state === "partial") ??
    turns.reduce<Turn | undefined>((best, turn) => (!best || turn.trace.duration > best.trace.duration ? turn : best), undefined);
  return pick?.trace.id ?? null;
}

export function summaryOf(trace: Trace): string {
  const { generations, tools, nodes } = trace.totals;
  const parts = [generations && `${generations} generation${generations > 1 ? "s" : ""}`, tools && `${tools} tool${tools > 1 ? "s" : ""}`].filter(Boolean);
  return parts.length ? parts.join(" · ") : `${nodes} step${nodes > 1 ? "s" : ""}`;
}

export function idleOf(session: Session) {
  const active = session.traces.reduce((sum, trace) => sum + trace.duration, 0);
  return Math.max(0, session.duration - active);
}

export type TurnNode = { turn: Turn; node: TraceNode };

export const failuresOf = (turns: Turn[]): TurnNode[] => turns.flatMap((turn) => failureOrigins(turn.trace).map((node) => ({ turn, node })));

export const slowestOf = (turns: Turn[], count = 3): TurnNode[] =>
  turns
    .flatMap((turn) => slowest(turn.trace, count).map((node) => ({ turn, node })))
    .sort((a, b) => b.node.duration - a.node.duration || a.turn.index - b.turn.index)
    .slice(0, count);

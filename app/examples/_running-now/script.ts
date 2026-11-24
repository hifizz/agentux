import type { NowState } from "./types";

export type NowOp =
  | { kind: "step"; task: string; done: number; step: string }
  | { kind: "state"; task: string; state: NowState; step?: string; done?: number }
  | { kind: "reset" };

export type NowScriptStep = { wait: number; ops: NowOp[] };

export const NOW_SCRIPT: NowScriptStep[] = [
  { wait: 2100, ops: [{ kind: "step", task: "release", done: 3, step: "Writing the summary" }] },
  { wait: 1700, ops: [{ kind: "step", task: "digest", done: 2, step: "Sketching the charts" }] },
  { wait: 1800, ops: [{ kind: "step", task: "triage", done: 1, step: "Reading priorities" }] },
  { wait: 2000, ops: [{ kind: "state", task: "release", state: "done", done: 4 }] },
  { wait: 1800, ops: [{ kind: "step", task: "triage", done: 2, step: "Suggesting owners" }] },
  { wait: 2000, ops: [{ kind: "step", task: "digest", done: 3, step: "Comparing to last month" }] },
  { wait: 1800, ops: [{ kind: "state", task: "triage", state: "needs-you", step: "Route billing tickets to Finance or Support?", done: 3 }] },
  { wait: 2000, ops: [{ kind: "step", task: "digest", done: 4, step: "Polishing the layout" }] },
  { wait: 1800, ops: [{ kind: "state", task: "digest", state: "done", done: 5 }] },
  { wait: 10000, ops: [{ kind: "reset" }] },
];

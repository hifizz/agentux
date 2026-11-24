import type { TrailState, TrailSub } from "./types";

export type TrailOp =
  | { kind: "status"; step: string; status: string }
  | { kind: "doneSub"; step: string; index: number }
  | { kind: "addSub"; step: string; sub: TrailSub }
  | { kind: "state"; step: string; state: TrailState; duration?: number; status?: string; startedNow?: boolean; subs?: TrailSub[] }
  | { kind: "reset" };

export type TrailScriptStep = { wait: number; ops: TrailOp[] };

export const TRAIL_SCRIPT: TrailScriptStep[] = [
  {
    wait: 2700,
    ops: [
      { kind: "status", step: "patch", status: "Testing" },
      { kind: "doneSub", step: "patch", index: 1 },
      { kind: "addSub", step: "patch", sub: { title: "Running the test suite", detail: "182/214", state: "running" } },
    ],
  },
  {
    wait: 4800,
    ops: [
      { kind: "status", step: "patch", status: "Verifying" },
      { kind: "doneSub", step: "patch", index: 2 },
      { kind: "addSub", step: "patch", sub: { title: "Suite is green", detail: "214/214", state: "running" } },
    ],
  },
  {
    wait: 2400,
    ops: [
      { kind: "state", step: "patch", state: "done", duration: 52000 },
      { kind: "state", step: "notes", state: "running", status: "Writing", startedNow: true, subs: [{ title: "Drafted the 2.4.1 entry", detail: "CHANGELOG.md", state: "running" }] },
    ],
  },
  {
    wait: 5200,
    ops: [
      { kind: "doneSub", step: "notes", index: 0 },
      { kind: "addSub", step: "notes", sub: { title: "Linked issue #412", state: "running" } },
    ],
  },
  {
    wait: 5000,
    ops: [
      { kind: "state", step: "notes", state: "done", duration: 11000 },
      { kind: "state", step: "pr", state: "waiting" },
    ],
  },
  { wait: 12000, ops: [{ kind: "reset" }] },
];

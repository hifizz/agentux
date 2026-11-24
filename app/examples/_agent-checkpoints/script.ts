export type CpOp =
  | { kind: "add"; draft: string }
  | { kind: "settle"; status: "done" | "failed" }
  | { kind: "rewind"; target: string; draft: string }
  | { kind: "reset" };

export type CpScriptStep = { wait: number; ops: CpOp[] };

export const CP_FIX = "swap";

export const CP_SCRIPT: CpScriptStep[] = [
  { wait: 780, ops: [{ kind: "settle", status: "done" }] },
  { wait: 620, ops: [{ kind: "add", draft: "skeleton" }] },
  { wait: 780, ops: [{ kind: "settle", status: "done" }] },
  { wait: 640, ops: [{ kind: "add", draft: "copy" }] },
  { wait: 780, ops: [{ kind: "settle", status: "done" }] },
  { wait: 640, ops: [{ kind: "add", draft: "grid" }] },
  { wait: 700, ops: [{ kind: "settle", status: "done" }] },
  { wait: 700, ops: [{ kind: "add", draft: "signup" }] },
  { wait: 790, ops: [{ kind: "settle", status: "done" }] },
  { wait: 560, ops: [{ kind: "add", draft: "tests" }] },
  { wait: 800, ops: [{ kind: "settle", status: "failed" }] },
  { wait: 620, ops: [{ kind: "rewind", target: "grid", draft: CP_FIX }] },
  { wait: 780, ops: [{ kind: "settle", status: "done" }] },
  { wait: 800, ops: [{ kind: "add", draft: "pass" }] },
  { wait: 600, ops: [{ kind: "settle", status: "done" }] },
  { wait: 800, ops: [{ kind: "add", draft: "pr" }] },
  { wait: 600, ops: [{ kind: "settle", status: "done" }] },
  { wait: 4400, ops: [{ kind: "reset" }] },
];

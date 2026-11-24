import type { MenuEffort } from "./types";

export type MmOp =
  | { kind: "open" }
  | { kind: "lit"; index: number }
  | { kind: "unpoint" }
  | { kind: "think"; on: boolean }
  | { kind: "effort"; effort: MenuEffort }
  | { kind: "web"; on: boolean }
  | { kind: "select"; index: number }
  | { kind: "reset" };

export type MmScriptStep = { wait: number; ops: MmOp[] };

export const MM_SCRIPT: MmScriptStep[] = [
  { wait: 750, ops: [{ kind: "open" }] },
  { wait: 750, ops: [{ kind: "lit", index: 0 }] },
  { wait: 2000, ops: [{ kind: "lit", index: 2 }] },
  { wait: 1250, ops: [{ kind: "lit", index: 0 }] },
  { wait: 1000, ops: [{ kind: "unpoint" }, { kind: "think", on: true }] },
  { wait: 750, ops: [{ kind: "effort", effort: "high" }] },
  { wait: 1500, ops: [{ kind: "lit", index: 0 }] },
  { wait: 1000, ops: [{ kind: "select", index: 0 }] },
  { wait: 3250, ops: [{ kind: "reset" }] },
];

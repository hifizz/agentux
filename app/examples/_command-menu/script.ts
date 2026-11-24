export type MenuOp =
  | { kind: "type"; text: string }
  | { kind: "query"; q: string }
  | { kind: "move"; dir: 1 | -1 }
  | { kind: "jump"; dir: 1 | -1 }
  | { kind: "select"; key: string }
  | { kind: "run" }
  | { kind: "settle" }
  | { kind: "reset" };

export type MenuScriptStep = { wait: number; ops: MenuOp[] };

export const MENU_SCRIPT: MenuScriptStep[] = [
  { wait: 2300, ops: [{ kind: "move", dir: 1 }] },
  { wait: 650, ops: [{ kind: "move", dir: 1 }] },
  { wait: 1200, ops: [{ kind: "type", text: "u" }] },
  { wait: 115, ops: [{ kind: "type", text: "p" }] },
  { wait: 130, ops: [{ kind: "type", text: "l" }] },
  { wait: 95, ops: [{ kind: "type", text: "o" }] },
  { wait: 145, ops: [{ kind: "type", text: "a" }] },
  { wait: 110, ops: [{ kind: "type", text: "d" }] },
  { wait: 900, ops: [{ kind: "move", dir: 1 }] },
  { wait: 800, ops: [{ kind: "run" }] },
  { wait: 2500, ops: [{ kind: "settle" }] },
  { wait: 650, ops: [{ kind: "query", q: "" }] },
  { wait: 950, ops: [{ kind: "jump", dir: 1 }] },
  { wait: 800, ops: [{ kind: "jump", dir: 1 }] },
  { wait: 900, ops: [{ kind: "move", dir: 1 }] },
  { wait: 700, ops: [{ kind: "run" }] },
  { wait: 2500, ops: [{ kind: "settle" }] },
  { wait: 1900, ops: [{ kind: "reset" }] },
];

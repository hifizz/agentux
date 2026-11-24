import type { DropTarget } from "./types";

export type DelegateStep = {
  wait: number | "empty";
  drag?: { task: string; from?: string | null; over: DropTarget; picked?: boolean };
  assign?: { task: string; to: DropTarget; from?: string | null };
  auto?: boolean;
  reset?: boolean;
};

export const DELEGATE_SCRIPT: DelegateStep[] = [
  { wait: 1200, drag: { task: "notes", over: "writer", picked: true } },
  { wait: 1250, assign: { task: "notes", to: "writer" } },
  { wait: 1000, drag: { task: "flaky", over: "coder", picked: true } },
  { wait: 1000, assign: { task: "flaky", to: "coder" } },
  { wait: 750, drag: { task: "sdk", from: "coder", over: "ops" } },
  { wait: 1250, assign: { task: "sdk", to: "ops", from: "coder" } },
  { wait: 750, auto: true },
  { wait: "empty" },
  { wait: 3600, reset: true },
];

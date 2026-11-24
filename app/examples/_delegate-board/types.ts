import type { ReactNode } from "react";

export type BoardTool = { name?: string; icon: ReactNode };

export type BoardTask = {
  id: string;
  title: string;
  minutes: number;
  estimate?: string;
  tools?: BoardTool[];
};

export type BoardAgent = {
  id: string;
  name: string;
  model: string;
  rate: number;
  mark?: ReactNode;
  queue: BoardTask[];
};

export type BoardData = { tasks: BoardTask[]; agents: BoardAgent[] };

export type DropTarget = string | "pile";

export type BoardDrag = {
  task: BoardTask;
  from: string | null;
  over: DropTarget | null;
  picked?: boolean;
  ghost?: { x: number; y: number; width: number } | null;
};

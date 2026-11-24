import type { ReactNode } from "react";

export type CpStatus = "running" | "done" | "failed" | "stopped";

export type Checkpoint = {
  id: string;
  title: string;
  icon?: ReactNode;
  status: CpStatus;
  files?: number;
  time?: string;
  cost?: number;
  forkOf?: string;
  attempt?: number;
};

export type CpDraft = {
  title: string;
  icon?: ReactNode;
  files?: number;
  time?: string;
  cost?: number;
};

export type CpLabels = {
  title: string;
  empty: string;
  untitled: string;
  rewind: string;
  running: string;
  failed: string;
  stopped: string;
  current: string;
  leftBehind: string;
  rewindHint: string;
  attempt: string;
  checkpoint: string;
  checkpoints: string;
  attempts: string;
  file: string;
  files: string;
};

export const CP_LABELS: CpLabels = {
  title: "Checkpoints",
  empty: "No checkpoints yet",
  untitled: "Untitled checkpoint",
  rewind: "Rewind",
  running: "running",
  failed: "failed",
  stopped: "stopped",
  current: "current",
  leftBehind: "left behind",
  rewindHint: "press Enter to rewind here",
  attempt: "attempt {n}",
  checkpoint: "checkpoint",
  checkpoints: "checkpoints",
  attempts: "attempts",
  file: "file",
  files: "files",
};

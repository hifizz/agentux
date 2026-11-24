import type { ReactNode } from "react";

export type TrailState = "done" | "running" | "waiting" | "pending" | "failed" | "declined";

export type TrailSub = {
  id?: string;
  title: string;
  detail?: string;
  state?: "done" | "running" | "pending";
};

export type TrailTool = { logo: ReactNode; name: string };

export type TrailStep = {
  id: string;
  title: string;
  state: TrailState;
  duration?: number | string;
  status?: string | number;
  startedAt?: number;
  gate?: boolean;
  tool?: TrailTool;
  ask?: string;
  substeps?: TrailSub[];
};

export type TrailLabels = {
  title: string;
  running: string;
  approval: string;
  waiting: string;
  failed: string;
  declined: string;
  done: string;
  pending: string;
  empty: string;
  untitled: string;
  earlier: string;
  more: string;
  fewer: string;
  approve: string;
  decline: string;
};

export const TRAIL_LABELS: TrailLabels = {
  title: "Steps",
  running: "Running",
  approval: "Approval",
  waiting: "Needs you",
  failed: "Failed",
  declined: "Declined",
  done: "Done",
  pending: "Up next",
  empty: "No steps yet",
  untitled: "Untitled step",
  earlier: "+{n} earlier",
  more: "+{n} more",
  fewer: "Show fewer",
  approve: "Approve",
  decline: "Decline",
};

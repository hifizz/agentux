import type { ReactNode } from "react";

export type BeamTool = { name: string; logo: ReactNode };

export type BeamCenter = { name: string; logo?: ReactNode };

export type IbLabels = {
  connected: string;
  paused: string;
  syncing: string;
  count: string;
  announcePaused: string;
  announceConnected: string;
  sceneLabel: string;
};

export const IB_LABELS: IbLabels = {
  connected: "connected",
  paused: "paused",
  syncing: "Syncing…",
  count: "{n} connected",
  announcePaused: "{name} paused. {n} of {m} connected.",
  announceConnected: "{name} connected. {n} of {m} connected.",
  sceneLabel: "{center} connected to {tools}",
};

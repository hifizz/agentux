import type { ReactNode } from "react";

export type MenuEffort = "low" | "medium" | "high";

export type ModelStats = {
  speed: number;
  quality: number;
  cost: number;
  price: number;
  ttfb: Record<"off" | MenuEffort, number>;
};

export type MenuModel = {
  id: string;
  name: string;
  tagline: string;
  glyph?: ReactNode;
  stats?: ModelStats;
};

export type MmLabels = {
  model: string;
  dialog: string;
  thinking: string;
  thinkingNote: string;
  web: string;
  webNote: string;
  effort: string;
  efforts: Record<MenuEffort, string>;
  speed: string;
  quality: string;
  cost: string;
  varies: string;
  empty: string;
};

export const MM_LABELS: MmLabels = {
  model: "Model",
  dialog: "Model settings",
  thinking: "Extended thinking",
  thinkingNote: "Answers from what it already knows",
  web: "Web search",
  webNote: "Looks things up on the web when it helps",
  effort: "Effort",
  efforts: { low: "Low", medium: "Medium", high: "High" },
  speed: "Speed",
  quality: "Quality",
  cost: "Cost",
  varies: "Varies",
  empty: "No models",
};

import type { ReactNode } from "react";

export type ThinkingSource = {
  label: string;
  href?: string;
  tooltip?: string;
  icon?: ReactNode;
};

export type ThinkingSearchStep = {
  kind: "search";
  label: string;
  activeLabel?: string;
  sources?: ThinkingSource[];
  moreSources?: ThinkingSource[];
};

export type ThinkingTextStep = {
  kind: "step";
  label: string;
};

export type ThinkingStep = ThinkingSearchStep | ThinkingTextStep;

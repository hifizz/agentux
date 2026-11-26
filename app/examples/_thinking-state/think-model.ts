import type { ThinkingSearchStep, ThinkingSource, ThinkingStep } from "./types";

export const CHIP_MS = 160;
export const EXTRA_CHIP_MS = 70;
export const LOOP_HOLD_MS = 4000;
export const MAX_STAGGER = 12;

export type PreparedTextStep = {
  kind: "step";
  label: string;
};

export type PreparedSearchStep = Omit<ThinkingSearchStep, "sources" | "moreSources"> & {
  sources: ThinkingSource[];
  moreSources: ThinkingSource[];
};

export type PreparedStep = PreparedSearchStep | PreparedTextStep;

const cleanSources = (value: ThinkingSource[] | undefined): ThinkingSource[] =>
  Array.isArray(value) ? value.filter((source) => source && typeof source === "object").map((source) => ({ ...source, label: String(source.label ?? "") })) : [];

export function prepareSteps(steps: ThinkingStep[]): PreparedStep[] {
  if (!Array.isArray(steps)) return [];
  return steps
    .filter((step) => step && typeof step === "object")
    .map((step) => {
      if (step.kind === "search") {
        return {
          ...step,
          label: String(step.label ?? ""),
          sources: cleanSources(step.sources),
          moreSources: cleanSources(step.moreSources),
        };
      }
      return { kind: "step", label: String(step.label ?? "") };
    });
}

export function sourceParts(step: PreparedSearchStep): { visible: ThinkingSource[]; hidden: ThinkingSource[] } {
  return { visible: step.sources, hidden: step.moreSources };
}

export function pauseAfter(step: PreparedStep, stepMs: number): number {
  if (step.kind !== "search") return stepMs;
  const { visible } = sourceParts(step);
  return stepMs + (Math.min(visible.length, MAX_STAGGER) + 1) * CHIP_MS;
}

export function chipDelay(index: number): number {
  return 120 + Math.min(index, MAX_STAGGER) * CHIP_MS;
}

export function extraChipDelay(index: number): number {
  return Math.min(index, MAX_STAGGER) * EXTRA_CHIP_MS;
}

export function formatElapsed(value: number): string {
  const seconds = Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ${String(seconds % 60).padStart(2, "0")}s`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ${String(minutes % 60).padStart(2, "0")}m`;
  return `${Math.floor(hours / 24)}d ${hours % 24}h`;
}

export function stepsKey(steps: PreparedStep[]): string {
  return JSON.stringify(
    steps.map((step) => {
      if (step.kind !== "search") return step;
      const sourceKey = (source: ThinkingSource) => [source.label, source.href ?? "", source.tooltip ?? "", source.icon ? 1 : 0];
      return { ...step, sources: step.sources.map(sourceKey), moreSources: step.moreSources.map(sourceKey), icon: undefined };
    }),
  );
}

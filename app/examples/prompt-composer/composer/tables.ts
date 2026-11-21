import type { EffortLevel, ModelCard } from "../shared/models";
import { PERMISSION_MODE_IDS } from "../shared/permission";
import type { PermissionMode, Strip, StripKind } from "./types";

export const EFFORT_LABEL: Record<EffortLevel, string> = {
  off: "Default",
  minimal: "Minimal",
  low: "Low",
  medium: "Medium",
  high: "High",
  xhigh: "Extra high",
  max: "Max",
};

export const PERMISSION_MODES: Record<PermissionMode, { label: string; hint: string; risky: boolean }> = {
  ask: { label: "Ask", hint: "Ask before every tool call", risky: false },
  edit: { label: "Edit", hint: "Auto-approve file edits, ask before shell commands", risky: false },
  auto: { label: "Auto", hint: "Approve edits and read-only commands, ask about the rest", risky: false },
  bypass: { label: "Bypass", hint: "Never ask. Every call runs", risky: true },
};
export const ALL_PERMISSION_MODES: readonly PermissionMode[] = PERMISSION_MODE_IDS;

const STRIP_PRIORITY: readonly StripKind[] = ["queue", "goal", "changes", "usage"];

export function activeStrip(strips: readonly Strip[]): Strip | undefined {
  for (const kind of STRIP_PRIORITY) {
    const hit = strips.find((s) => s.kind === kind);
    if (hit) return hit;
  }
  return undefined;
}

export function costPosition(card: ModelCard, catalog: readonly ModelCard[]): number | null {
  if (!card.cost) return null;
  const prices = catalog.flatMap((m) => (m.cost && m.cost.output > 0 ? [m.cost.output] : []));
  if (prices.length === 0 || card.cost.output <= 0) return null;
  const [lo, hi] = [Math.log(Math.min(...prices)), Math.log(Math.max(...prices))];
  return hi === lo ? 0.5 : (Math.log(card.cost.output) - lo) / (hi - lo);
}

export function formatTokens(n: number): string {
  return n >= 1_000_000 ? `${+(n / 1_000_000).toFixed(1)}M` : `${Math.round(n / 1000)}K`;
}

export function formatPrice(usd: number): string {
  return `$${+usd.toFixed(2)}`;
}

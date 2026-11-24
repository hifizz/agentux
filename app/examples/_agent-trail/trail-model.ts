import type { TrailStep, TrailSub, TrailLabels } from "./types";

export function fmtDuration(ms: number): string {
  if (ms < 1000) return "<1s";
  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const parts: string[] = [];
  if (d) parts.push(`${d}d`);
  if (h) parts.push(`${h}h`);
  if (m) parts.push(`${m}m`);
  if (sec || !parts.length) parts.push(`${sec}s`);
  return parts.slice(0, 2).join(" ");
}

export const stepDuration = (step: TrailStep) => (step.duration === undefined ? null : typeof step.duration === "string" ? step.duration : fmtDuration(step.duration));

export function metaOf(step: TrailStep, L: TrailLabels, now: number): { kind: string; text: string; clock?: string } {
  switch (step.state) {
    case "done": {
      const t = stepDuration(step);
      return { kind: "done", text: t ? `${L.done}, ${t}` : L.done };
    }
    case "running": {
      const clock = step.startedAt !== undefined ? fmtDuration(Math.max(0, now - step.startedAt)) : undefined;
      return { kind: "running", text: String(step.status ?? L.running), clock };
    }
    case "waiting":
      return { kind: "waiting", text: L.waiting };
    case "failed":
      return { kind: "failed", text: L.failed };
    case "declined":
      return { kind: "declined", text: L.declined };
    default:
      return step.gate ? { kind: "approval", text: L.approval } : { kind: "pending", text: L.pending };
  }
}

export function ariaOf(step: TrailStep, L: TrailLabels, now: number): string {
  const meta = metaOf(step, L, now);
  const tool = step.tool ? ` (${step.tool.name})` : "";
  return `${step.title || L.untitled}${tool} – ${meta.text}`;
}

export function runningSubIndex(subs: TrailSub[]): number {
  return subs.findIndex((s) => s.state === "running");
}

export type FoldWindow = { start: number; earlier: number; more: number };

export function foldWindow(total: number, runningIdx: number, size = 5): FoldWindow | null {
  if (total <= 6) return null;
  const idx = runningIdx < 0 ? total - 1 : runningIdx;
  const start = Math.min(Math.max(idx - 3, 0), total - size);
  return { start, earlier: start, more: total - start - size };
}

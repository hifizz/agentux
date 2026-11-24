import type { NowLabels, NowTask } from "./types";

export type NowCounts = { running: number; needs: number; paused: number; done: number };

export function countOf(tasks: NowTask[]): NowCounts {
  const c: NowCounts = { running: 0, needs: 0, paused: 0, done: 0 };
  for (const t of tasks) {
    if (t.state === "running") c.running += 1;
    else if (t.state === "needs-you") c.needs += 1;
    else if (t.state === "paused") c.paused += 1;
    else c.done += 1;
  }
  return c;
}

export function fracOf(task: NowTask): number {
  if (!task.total) return 0;
  return Math.min(1, Math.max(0, (task.done ?? 0) / task.total));
}

export function markColorOf(task: NowTask): "orange" | "amber" | "teal" | "blue" | "muted" {
  if (task.state === "done") return "blue";
  if (task.state === "needs-you") return "amber";
  if (task.state === "paused") return "muted";
  const f = fracOf(task);
  if (f < 1 / 3) return "orange";
  if (f < 0.6) return "amber";
  return "teal";
}

export function stepTextOf(task: NowTask, L: NowLabels): string {
  if (task.state === "done") return L.done;
  if (task.state === "paused") return `${L.paused} · ${task.step}`;
  return task.step;
}

export function stepsOf(task: NowTask): string | null {
  if (task.done === undefined || task.total === undefined) return null;
  return `${task.done}/${task.total}`;
}

export function ariaOf(task: NowTask, L: NowLabels): string {
  const steps = task.done !== undefined && task.total !== undefined ? ` ${task.done} of ${task.total} steps` : "";
  if (task.state === "done") return `${task.title} – ${L.done}.${steps}`;
  const word = task.state === "running" ? L.running : task.state === "paused" ? L.paused : L.needsYouBadge;
  return `${task.title} – ${word}. ${task.step}.${steps}`;
}

export function needsWord(count: number, L: NowLabels): string {
  return count === 1 ? L.needsYouOne : L.needsYou;
}

export function summaryOf(c: NowCounts, L: NowLabels): string {
  const parts: string[] = [];
  if (c.running > 0) parts.push(`${c.running} ${L.running}`);
  if (c.needs > 0) parts.push(`${c.needs} ${needsWord(c.needs, L)}`);
  if (parts.length) return parts.join(", ");
  if (c.paused > 0) return `${c.paused} ${L.pausedCount}`;
  return L.idle;
}

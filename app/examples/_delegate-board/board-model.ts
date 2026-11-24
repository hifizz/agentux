import type { BoardAgent, BoardData, BoardTask, DropTarget } from "./types";

export const MINUTE = 60_000;

export const queueMinutes = (agent: BoardAgent) => agent.queue.reduce((n, t) => n + t.minutes, 0);

export const busyUntil = (agent: BoardAgent, now: number) => (agent.queue.length ? now + queueMinutes(agent) * MINUTE : null);

export const spend = (agents: BoardAgent[]) => agents.reduce((n, a) => n + queueMinutes(a) * a.rate, 0);

export const earliestFree = (agents: BoardAgent[], now: number) =>
  agents.reduce<BoardAgent | null>((best, a) => (!best || (busyUntil(a, now) ?? now) < (busyUntil(best, now) ?? now) ? a : best), null);

export const previewFor = (agent: BoardAgent, task: BoardTask, now: number) => ({
  until: (busyUntil(agent, now) ?? now) + task.minutes * MINUTE,
  minutes: task.minutes,
  cost: task.minutes * agent.rate,
});

export function locate(data: BoardData, taskId: string): { task: BoardTask; from: string | null } | null {
  const pile = data.tasks.find((t) => t.id === taskId);
  if (pile) return { task: pile, from: null };
  for (const a of data.agents) {
    const chip = a.queue.find((t) => t.id === taskId);
    if (chip) return { task: chip, from: a.id };
  }
  return null;
}

export function moveTask(data: BoardData, taskId: string, to: DropTarget, from?: string | null): BoardData {
  const hit = locate(data, taskId);
  if (!hit) return data;
  const origin = from === undefined ? hit.from : from;
  if (origin === to) return data;
  const tasks = data.tasks.filter((t) => t.id !== taskId);
  const agents = data.agents.map((a) =>
    a.id === origin ? { ...a, queue: a.queue.filter((t) => t.id !== taskId) } : a.id === to ? { ...a, queue: [...a.queue, hit.task] } : a,
  );
  if (to === "pile") tasks.push(hit.task);
  return { tasks, agents };
}

export const estimateOf = (task: BoardTask) => task.estimate ?? `~${task.minutes} min`;

export function fmtClock(ms: number) {
  const d = new Date(ms);
  return `${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export const fmtMoney = (n: number) => `$${n.toFixed(2)}`;

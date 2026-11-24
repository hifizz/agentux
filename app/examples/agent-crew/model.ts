export type Status = "active" | "idle" | "paused" | "waiting" | "done" | "failed";
export type Tool = "Linear" | "GitHub" | "Notion" | "Vercel";
export type Model = "Claude Opus" | "Claude Sonnet" | "Claude Haiku";
export type Last = { from: string; text: string };
export type Agent = {
  id: string; parent: string | null; name: string; model: Model; task: string; tools: Tool[]; mark: string;
  limit: number; percent: number; activity: string; status: Status; started?: number; ended?: number; last?: Last;
};
export type Beat = { at: number; changes: readonly (readonly [id: string, status: Status, activity: string, percent: number])[]; pass?: readonly [from: string, to: string, text: string] };
export type Project = { name: string; agents: Agent[]; beats: Beat[]; period: number };
export type Pass = { from: string; to: string; text: string; at: number };
export type Action = "Message" | "Pause" | "Stop" | "Resume" | "Approve" | "Decline" | "Retry";
export const statusNames: Record<Status, string> = { active: "Working", idle: "Idle", paused: "Paused", waiting: "Needs you", done: "Done", failed: "Failed" };
export const actions: Record<Status, readonly Action[]> = { active: ["Message", "Pause", "Stop"], idle: ["Message"], paused: ["Message", "Stop", "Resume"], waiting: ["Message", "Decline", "Approve"], done: ["Message"], failed: ["Message", "Retry"] };

export function snapshot(project: Project, now: number) {
  const agents = project.agents.map(a => ({ ...a }));
  const byId = new Map(agents.map(a => [a.id, a]));
  let pass: Pass | undefined;
  for (const beat of project.beats) {
    if (beat.at > now) break;
    for (const [id, status, activity, percent] of beat.changes) {
      const a = byId.get(id)!;
      if (status === "active" && a.started === undefined) a.started = beat.at;
      if (status === "done" || status === "failed") a.ended = beat.at;
      Object.assign(a, { status, activity, percent });
    }
    if (beat.pass) {
      const [from, to, text] = beat.pass;
      byId.get(to)!.last = { from: byId.get(from)!.name, text };
      pass = { from, to, text, at: beat.at };
    }
  }
  return { agents, pass };
}

export function steer(agent: Agent, action: Action, now: number, message: string, previous: Partial<Agent> = {}): Partial<Agent> {
  const held = { ...previous, percent: agent.percent, started: agent.started };
  switch (action) {
    case "Message": return { ...previous, last: { from: "You", text: message.trim() } };
    case "Pause": return { ...held, activity: "Paused by you", status: "paused", ended: now };
    case "Stop": return { ...held, activity: "Stopped by you", status: "idle", ended: now };
    case "Decline": return { ...held, activity: "Declined by you", status: "idle", ended: now };
    case "Approve": return { ...held, activity: "Approved by you", status: "done", ended: now };
    case "Resume": return { started: now, ...(previous.last && { last: previous.last }) };
    case "Retry": return { ...held, activity: "Trying again", status: "active", started: now, ended: undefined };
  }
}

export function tokens(n: number) { return n < 1000 ? String(Math.round(n)) : `${Math.round(n / 1000)}k`; }
export function duration(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  if (s >= 86400) return `${Math.floor(s / 86400)}d ${Math.floor(s / 3600) % 24}h`;
  if (s >= 3600) return `${Math.floor(s / 3600)}h ${Math.floor(s / 60) % 60}m`;
  return s < 60 ? `${s}s` : `${Math.floor(s / 60)}m ${s % 60}s`;
}
export function price(a: Agent) {
  const rate = { "Claude Opus": 15, "Claude Sonnet": 3, "Claude Haiku": 1 }[a.model];
  const cost = a.percent / 100 * a.limit * rate / 1000000;
  return cost > 0 && cost < .01 ? "<$0.01" : `$${cost.toFixed(2)}`;
}

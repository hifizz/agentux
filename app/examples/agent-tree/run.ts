import type { modelMarks, toolMarks } from "./marks";

export type Status = "running" | "waiting" | "done" | "failed" | "stopped";

export type Agent = {
  id: string;
  parent?: string;
  name: string;
  model: keyof typeof modelMarks;
  task: string;
  tools: readonly (keyof typeof toolMarks)[];
  status: Status;
  seconds: number;
  cost: number;
};

const jobs: (Omit<Agent, "status" | "seconds"> & { start: number; end: number })[] = [
  { id: "lead", name: "Coordinator", model: "Opus 5.5", task: "Prepare the release brief for the spring update", tools: ["slack", "notion", "github"], start: 0, end: 101, cost: 1.11 },
  { id: "research", parent: "lead", name: "Researcher", model: "Sonnet 5.5", task: "Compare onboarding flows across five products", tools: ["notion", "slack"], start: 6.5, end: 51.5, cost: .18 },
  { id: "reader", parent: "research", name: "Reader", model: "Gemini 3.8 Flash", task: "Collect the release notes from five teams", tools: ["notion"], start: 14.5, end: 36.5, cost: .03 },
  { id: "analyst", parent: "research", name: "Analyst", model: "Sonnet 5.5", task: "Group feedback from the last review round", tools: ["hubspot", "notion"], start: 20.5, end: 47.5, cost: .08 },
  { id: "editor", parent: "lead", name: "Editor", model: "Sonnet 5.5", task: "Draft the introduction for the release brief", tools: ["notion", "figma"], start: 11, end: 80, cost: .19 },
  { id: "builder", parent: "lead", name: "Builder", model: "GPT-6 Sol", task: "Build the release page and connect the form", tools: ["github", "stripe", "figma"], start: 16, end: 96, cost: .48 },
  { id: "tester", parent: "builder", name: "Tester", model: "GPT-6 Mini", task: "Run the browser checks on the release form", tools: ["github"], start: 29, end: 56, cost: .04 },
  { id: "retry", parent: "builder", name: "Tester", model: "GPT-6 Mini", task: "Repair the form check and rerun the suite", tools: ["github", "stripe"], start: 60.5, end: 86.5, cost: .04 },
];

export type Decisions = { editor?: "approve" | "reject"; answeredAt?: number; tester?: "dismiss" | "retry"; retryAt?: number };
export const issueText = { waiting: "Use the short introduction, or keep the longer draft?", failed: "Two form checks failed because the confirmation message did not appear." };
export const statusText: Record<Status, string> = { running: "Running", waiting: "Needs you", done: "Done", failed: "Failed", stopped: "Stopped" };
export const dollars = (n: number) => n > 0 && n < .005 ? "<$0.01" : `$${n.toFixed(2)}`;
export const elapsed = (n: number) => n < 60 ? `${n}s` : `${Math.floor(n / 60)}m ${String(n % 60).padStart(2, "0")}s`;

export function sample(seconds: number, decisions: Decisions): Agent[] {
  return jobs.flatMap(job => {
    const start = job.id === "retry" ? Math.min(job.start, decisions.retryAt ?? Infinity) : job.start;
    if (seconds < start || (job.id === "retry" && decisions.tester === "dismiss")) return [];
    const end = job.id === "editor" && decisions.editor === "reject" ? Math.min(seconds, decisions.answeredAt ?? seconds) : seconds;
    const age = Math.min(end - start, job.end - job.start);
    let status: Status = age >= job.end - job.start ? "done" : "running";
    if (job.id === "editor" && seconds >= 45) {
      if (decisions.editor === "reject") status = "stopped";
      else if (!decisions.editor && seconds < 59) status = "waiting";
    }
    if (job.id === "tester" && status === "done") status = decisions.tester ? "stopped" : "failed";
    const progress = job.id === "editor" && !decisions.editor ? (age - Math.max(0, Math.min(seconds, 59) - 45)) / (job.end - job.start - 14) : age / (job.end - job.start);
    return [{ ...job, status, seconds: Math.floor(age), cost: job.cost * progress }];
  });
}

export function branches(agents: Agent[]) {
  const children = new Map<string, Agent[]>();
  for (const agent of agents) if (agent.parent) {
    const group = children.get(agent.parent) ?? [];
    group.push(agent);
    children.set(agent.parent, group);
  }
  function total(agent: Agent): { cost: number; live: boolean } {
    return (children.get(agent.id) ?? []).map(total).reduce((a, b) => ({ cost: a.cost + b.cost, live: a.live || b.live }), { cost: agent.cost, live: agent.status === "running" });
  }
  return { children, total };
}

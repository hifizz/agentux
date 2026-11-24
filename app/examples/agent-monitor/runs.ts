export type Tool = "Linear" | "GitHub" | "Notion" | "Terminal" | "Slack" | "Google Drive" | "Edit";
type Step = { tool: Tool; active: string; done: string; detail: string; output?: string; duration: number; fails?: true };
type Scene = { name: string; role: string; note: string; rate: number; steps: Step[] };

export const releaseCommand = "gh release create v2.8.0 --latest";

const release: Scene = {
  name: "Claude Opus 5.5", role: "Release agent · studio v2.8", note: "v2.8.0 is live · 12 changes", rate: 0.0058,
  steps: [
    { tool: "Linear", active: "Gathering milestone issues", done: "Grouped 12 issues", duration: 1700, detail: "Grouped the completed issues by feature, fix and maintenance work.", output: "Milestones / Studio 2.8" },
    { tool: "GitHub", active: "Comparing v2.7 to main", done: "Checked 26 commits", duration: 2300, detail: "Matched the commits since the last tag with their pull requests.", output: "git log v2.7.0..main --oneline" },
    { tool: "Notion", active: "Writing the changelog", done: "Prepared the changelog", duration: 2800, detail: "Wrote a short entry for each change and linked its issue.", output: "Studio / Changelog / 2.8" },
    { tool: "Terminal", active: "Checking the preview", done: "Verified the preview build", duration: 2700, detail: "Built the studio and ran smoke tests against its three main routes.", output: "npm run build && npm run test:preview" },
    { tool: "GitHub", active: "Tagging v2.8.0", done: "Tagged the release", duration: 1600, detail: "Created the release from the tested commit and attached the changelog.", output: releaseCommand },
    { tool: "Slack", active: "Posting the update", done: "Posted to #studio", duration: 1300, detail: "Shared the release link and a summary of the changes with the studio team.", output: "#studio" },
  ],
};

const support: Scene = {
  name: "GPT-5", role: "Support agent · case #3168", note: "Credit issued · case closed", rate: 0.00365,
  steps: [
    { tool: "Slack", active: "Reading the billing thread", done: "Read the billing thread", duration: 1950, detail: "Found the original report and confirmed which invoice the customer meant.", output: "#billing-help" },
    { tool: "Notion", active: "Finding the credit policy", done: "Checked the credit policy", duration: 2100, detail: "Verified that a duplicate invoice qualifies for a full credit.", output: "Handbook / Billing credits" },
    { tool: "Google Drive", active: "Opening the invoice ledger", done: "Ledger access timed out", duration: 2200, fails: true, detail: "The ledger was busy when the agent requested the invoice. It can retry the lookup.", output: "Finance / Invoice ledger" },
    { tool: "Google Drive", active: "Opening the invoice ledger", done: "Matched invoice #8437", duration: 2200, detail: "Matched both entries to the same subscription and confirmed the duplicate.", output: "Finance / Invoice ledger" },
    { tool: "Edit", active: "Preparing the response", done: "Wrote the credit notice", duration: 2700, detail: "Explained the credit and when it will appear on the next statement." },
    { tool: "Linear", active: "Closing case #3168", done: "Closed case #3168", duration: 1250, detail: "Attached the credit reference to the support case and marked it resolved.", output: "SUP-3168" },
  ],
};

export const scenes = [release, support] as const;
export type Status = "running" | "paused" | "waiting" | "failed" | "finished" | "cancelled" | "idle";
export const statusName: Record<Status,string> = { running: "Running", paused: "Paused", waiting: "Needs you", failed: "Failed", finished: "Finished", cancelled: "Cancelled", idle: "Idle" };
export type Entry = Step & { index: number; start: number; took: number; state: "running" | "done" | "failed"; label: string };
export type Run = { scene: number; status: Status; index: number; elapsed: number; phase: number; total: number; entries: Entry[]; cost: number; serial: number };
export type Action = "pause" | "resume" | "cancel" | "advance" | "replay" | { delta: number };

function begin(scene: number, serial: number): Run {
  return { scene, serial, status: "running", index: 0, elapsed: 0, phase: 0, total: scenes[scene].steps.filter(step => !step.fails).length, entries: [], cost: 0 };
}
export const initial = begin(0, 0);
export function current(run: Run): Entry {
  const step = scenes[run.scene].steps[run.index];
  return { ...step, index: run.index, start: run.elapsed - run.phase, took: run.phase, state: "running", label: step.active };
}
export function entries(run: Run) {
  return run.status === "running" || run.status === "paused" ? [...run.entries, current(run)] : run.entries;
}
export const clock = (ms: number) => `${Math.floor(ms/60000)}:${String(Math.floor(ms/1000)%60).padStart(2,"0")}`;
export const seconds = (ms: number) => `${(ms/1000).toFixed(1)}s`;

export function play(run: Run, action: Action): Run {
  if (action === "replay") return begin(0, run.serial + 1);
  if (action === "pause") return run.status === "running" ? { ...run, status: "paused" } : run;
  if (action === "resume") return run.status === "paused" ? { ...run, status: "running" } : run;
  if (action === "advance") {
    if (run.status !== "waiting" && run.status !== "failed") return run;
    const retry = run.status === "failed";
    return { ...run, total: run.total + Number(retry), elapsed: run.elapsed + (retry ? run.phase : 0), index: run.index + 1, status: "running", phase: 0 };
  }
  if (action === "cancel") {
    if (run.status !== "waiting" && run.status !== "running" && run.status !== "paused") return run;
    const stopped = entries(run);
    return { ...run, entries: stopped.map(e => ({ ...e, state: e.state === "running" ? "done" : e.state })), total: run.status === "waiting" ? run.total : stopped.length, phase: 0, status: "cancelled" };
  }
  if (run.status === "paused") return run;
  const scene = scenes[run.scene];
  const limit = run.status === "running" ? scene.steps[run.index].duration : run.status === "waiting" ? 6600 : run.status === "failed" ? 4000 : run.status === "idle" ? 2400 : 5400;
  const delta = Math.min(action.delta, limit - run.phase);
  const live = run.status === "running" || run.status === "waiting";
  let next: Run = { ...run, phase: run.phase + delta, elapsed: run.elapsed + (live ? delta : 0), cost: run.cost + delta / 1000 * (run.status === "running" ? scene.rate : run.status === "waiting" ? 0.0009 : 0) };
  if (next.phase < limit) return next;
  if (run.status === "running") {
    const entry = current(next);
    const status = entry.fails ? "failed" : run.index === scene.steps.length - 1 ? "finished" : run.scene === 0 && run.index === 3 ? "waiting" : "running";
    next = { ...next, entries: [...run.entries, { ...entry, state: entry.fails ? "failed" : "done", label: entry.done }], index: run.index + Number(status === "running"), status, phase: 0 };
  } else if (run.status === "waiting" || run.status === "failed") next = play(next, "advance");
  else if (run.status === "idle") next = begin(1 - run.scene, run.serial + 1);
  else next = { ...begin(run.scene, run.serial), status: "idle" };
  return action.delta > delta ? play(next, { delta: action.delta - delta }) : next;
}

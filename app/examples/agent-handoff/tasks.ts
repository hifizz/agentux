export type Brand = "slack" | "notion" | "github";
export type Tool = readonly [Brand, string, string?];
export type Item = { label: string; kind: "link" | "file" | "note" | "decision"; why?: string };
export type Task = { title: string; brand: Brand; brief: string; tools: Tool[]; packets: [Item[], Item[]] };

const file = (label: string): Item => ({ label, kind: "file" });
const link = (label: string, why?: string): Item => ({ label, kind: "link", why });
const note = (label: string, why?: string): Item => ({ label, kind: "note", why });
const decision = (label: string): Item => ({ label, kind: "decision" });

export const history: Task[] = [
  { title: "Weekend support guide", brand: "slack", brief: "Give the weekend team a short guide to the questions that came up on Friday.", tools: [["slack", "Read support threads", "32"], ["notion", "Check the policy"]], packets: [[link("32 replies"), file("returns.md"), note("2 exceptions", "The short guide left out two cases that need a supervisor.")], [file("Guide draft"), decision("Tone: helpful")]] },
  { title: "SDK change notes", brand: "github", brief: "Explain what changed in the client library for teams upgrading this month.", tools: [["github", "Compare release tags"], ["notion", "Read the migration guide"]], packets: [[file("client.yaml"), link("4 examples"), decision("Start with setup")], [file("Second draft"), link("4 examples")]] },
  { title: "Welcome checklist", brand: "notion", brief: "Help a new workspace owner invite their first teammate.", tools: [["notion", "Open the setup checklist"]], packets: [[file("welcome.md"), note("First invite"), decision("One action")], [file("Welcome copy"), decision("Tone: friendly")]] },
];

function queued(title: string, brand: Brand, brief: string, filename: string, tools: Tool[]): Task {
  return { title, brand, brief, tools, packets: [[file(filename), link("9 references"), decision("Lead with the fix"), note("3 team quotes", "The summary kept the findings but left out the original quotes.")], [file("Copy draft"), decision("Tone: direct"), note("Load time: 1.4s"), link("Benchmark log", "The draft named the result without including the measurement log.")]] };
}

export const queue = [
  queued("Trial team follow-up", "slack", "Northstar paused its trial when imports stalled. Show the team what has changed.", "trial-brief.md", [["slack", "Read the trial thread", "24"], ["github", "Find the import fix"], ["notion", "Open the incident notes"]]),
  queued("Launch announcement", "notion", "Introduce the faster import flow and link to the team's first successful run.", "launch.md", [["notion", "Read the launch outline"], ["github", "Inspect the import change"], ["slack", "Find the rollout report"]]),
  queued("Plan comparison", "notion", "Help growing teams find the plan that covers their next project.", "plans.md", [["notion", "Check the plan limits"], ["slack", "Collect sales questions", "12"], ["github", "Read the quota tests"]]),
  queued("Spring update", "github", "Collect this spring's changes in a short update that customers can scan.", "spring.md", [["github", "Compare the release tags", "96"], ["github", "Review closed issues", "31"], ["notion", "Open the release outline"]]),
];

export const agents = [
  { name: "Researcher", model: "Opus 5.5", description: "Gathers the sources, checks the facts and picks an angle.", action: "Reading sources", base: 1.24, rate: .09 },
  { name: "Writer", model: "GPT-5", description: "Shapes the brief into a draft that sounds like the team.", action: "Drafting", base: .57, rate: .05 },
  { name: "Reviewer", model: "Gemini Pro", description: "Checks the evidence behind each claim before release.", action: "Checking claims", base: .30, rate: .03 },
];

import type { Agent, Project, Tool } from "./model";

function agent(id: string, name: string, parent: string | null, task: string, tools: Tool[], initial: Partial<Agent> = {}): Agent {
  const small = !!parent && parent !== "lead";
  return { id, name, parent, task, tools, model: small ? "Claude Haiku" : parent ? "Claude Sonnet" : "Claude Opus", limit: small ? 64000 : 200000, percent: small ? 2 : 4, status: "idle", activity: small ? "Idle" : "Waiting for work", mark: "010111101", ...initial };
}

const fix: Project = {
  name: "Fix the invoice preview", period: 25000,
  agents: [
    agent("lead", "Lead", null, "Find why blank invoices break the preview and prepare a reviewed fix.", ["Linear", "GitHub"], { mark: "000111101", activity: "Planning the repair", status: "active", percent: 18, started: -5000 }),
    agent("research", "Researcher", "lead", "Trace the blank invoice case and summarize the cause.", ["Linear", "Notion"], { mark: "111010101" }),
    agent("search", "Web search", "research", "Look up reports about empty preview data.", [], { mark: "010111111" }),
    agent("code", "Coder", "lead", "Repair the preview and cover the empty state with tests.", ["GitHub", "Vercel"], { mark: "101101010", percent: 6 }),
    agent("lint", "Linter", "code", "Run style checks on the modified modules.", ["GitHub"], { mark: "000101111", limit: 32000, percent: 3 }),
    agent("test", "Test runner", "code", "Run the invoice suite and report any regressions.", ["GitHub"], { mark: "101111010", percent: 5 }),
    agent("review", "Reviewer", "lead", "Review the patch and its tests before the merge.", ["GitHub"], { model: "Claude Opus", percent: 3 }),
    agent("docs", "Docs writer", "review", "Write a short release note for the preview fix.", ["Notion"], { mark: "111010111", limit: 128000, percent: 5 }),
  ],
  beats: [
    { at: 1400, pass: ["lead", "research", "Trace the empty invoice"], changes: [["lead", "active", "Assigning the investigation", 22], ["research", "active", "Reading the issue", 16]] },
    { at: 3200, pass: ["research", "search", "Check earlier reports"], changes: [["research", "active", "Tracing preview.ts", 31], ["search", "active", "Searching the docs", 22]] },
    { at: 4800, pass: ["search", "research", "Two related reports"], changes: [["search", "done", "Found two reports", 41], ["research", "active", "Comparing the reports", 44]] },
    { at: 6400, pass: ["research", "lead", "Missing fallback in preview.ts"], changes: [["research", "done", "Located the missing fallback", 52], ["lead", "active", "Preparing the patch brief", 29]] },
    { at: 7800, pass: ["lead", "code", "Handle invoices with no items"], changes: [["lead", "active", "Following the patch", 29], ["code", "active", "Updating preview.ts", 38]] },
    { at: 9700, pass: ["code", "lint", "Check the changed files"], changes: [["code", "active", "Adding regression tests", 56], ["lint", "active", "Checking two files", 40]] },
    { at: 10800, pass: ["lint", "code", "No lint issues"], changes: [["lint", "done", "Lint passed", 46]] },
    { at: 11600, pass: ["code", "test", "Run the invoice suite"], changes: [["code", "active", "Waiting for the suite", 68], ["test", "active", "96 of 120 passed", 58]] },
    { at: 13400, changes: [["test", "active", "120 of 120 passed", 74]] },
    { at: 13600, pass: ["test", "code", "All 120 passed"], changes: [["test", "done", "All tests passed", 74], ["code", "active", "Opening PR #216", 83]] },
    { at: 15500, pass: ["code", "review", "Review the preview fix"], changes: [["code", "done", "Opened PR #216", 86], ["review", "active", "Reading the changes", 34]] },
    { at: 17000, pass: ["review", "docs", "Draft the patch note"], changes: [["review", "active", "Checking coverage", 47], ["docs", "active", "Drafting the note", 28]] },
    { at: 18800, pass: ["docs", "review", "Patch note ready"], changes: [["docs", "done", "Note delivered", 35]] },
    { at: 19900, pass: ["review", "lead", "Reviewed and ready"], changes: [["review", "done", "Approved the changes", 52], ["lead", "waiting", "Merge the preview fix?", 33]] },
  ],
};

const post: Project = {
  name: "Draft the release brief", period: 19400,
  agents: [
    agent("lead", "Editor", null, "Prepare a checked release brief for the team to publish.", ["Notion", "Linear"], { status: "active", activity: "Building the outline", percent: 12, started: -5000 }),
    agent("research", "Researcher", "lead", "Summarize the changes in this release.", ["Linear", "GitHub"], { mark: "111010101" }),
    agent("write", "Writer", "lead", "Turn the outline into a clear release brief.", ["Notion"], { mark: "101101010" }),
    agent("facts", "Fact checker", "write", "Cross-check each claim against the changelog.", ["GitHub"], { mark: "001111100" }),
    agent("seo", "SEO", "write", "Suggest a title and search description.", ["Notion"], { limit: 32000, mark: "010011111" }),
  ],
  beats: [
    { at: 1200, pass: ["lead", "research", "What changed this month?"], changes: [["lead", "active", "Gathering the sources", 12], ["research", "active", "Reading closed tickets", 24]] },
    { at: 3600, pass: ["research", "lead", "Four features and nine fixes"], changes: [["research", "done", "Highlights collected", 48], ["lead", "active", "Briefing the writer", 20]] },
    { at: 5000, pass: ["lead", "write", "Draft the release brief"], changes: [["write", "active", "Writing the opening", 22]] },
    { at: 7400, changes: [["write", "active", "Adding two examples", 46]] },
    { at: 9300, pass: ["write", "facts", "Verify the figures"], changes: [["write", "active", "Polishing the draft", 58], ["facts", "active", "Checking eight claims", 30]] },
    { at: 10200, pass: ["write", "seo", "Suggest a headline"], changes: [["seo", "active", "Writing the headline", 20]] },
    { at: 11900, pass: ["seo", "write", "Headline ready"], changes: [["seo", "done", "Title delivered", 31]] },
    { at: 12600, pass: ["facts", "write", "One figure corrected"], changes: [["facts", "done", "Checked every claim", 52]] },
    { at: 14100, pass: ["write", "lead", "Final draft, 760 words"], changes: [["write", "done", "Brief ready", 64], ["lead", "waiting", "Publish the brief?", 31]] },
  ],
};

const migration: Project = {
  name: "Upgrade the reporting database", period: 16000,
  agents: [
    agent("lead", "Lead", null, "Rehearse the reporting database upgrade before switching traffic.", ["GitHub", "Vercel"], { status: "active", activity: "Reading the rollout plan", percent: 16, started: -4000, mark: "000111101" }),
    agent("plan", "Planner", "lead", "List the upgrade and rollback steps.", ["Linear"], { status: "done", activity: "Outlined six steps", percent: 38, started: -39000, ended: 0 }),
    agent("migrate", "Migrator", "lead", "Upgrade a test copy and compare the results.", ["GitHub", "Vercel"], { mark: "101101010" }),
    agent("backup", "Backup", "migrate", "Create a restorable snapshot of the copy.", ["Vercel"], { limit: 32000, mark: "011110011" }),
    agent("verify", "Verifier", "migrate", "Check row counts and reporting totals.", ["GitHub"], { mark: "101010111" }),
    agent("monitor", "Monitor", "lead", "Track latency while the test copy is upgraded.", ["Vercel"], { status: "active", activity: "p95 at 82ms", model: "Claude Haiku", limit: 64000, percent: 12, started: -4000 }),
  ],
  beats: [
    { at: 1200, pass: ["lead", "migrate", "Rehearse on the test copy"], changes: [["lead", "active", "Watching the rehearsal", 16], ["migrate", "active", "Preparing the test copy", 20]] },
    { at: 2700, pass: ["migrate", "backup", "Take a fresh snapshot"], changes: [["backup", "active", "Snapshot at 38%", 22]] },
    { at: 4700, pass: ["backup", "migrate", "Backup verified"], changes: [["backup", "done", "Snapshot checked", 30], ["migrate", "active", "Applying step 3 of 6", 44]] },
    { at: 6500, changes: [["migrate", "active", "Applying step 6 of 6", 62], ["monitor", "active", "p95 at 90ms", 20]] },
    { at: 7600, pass: ["migrate", "verify", "Check the reporting tables"], changes: [["verify", "active", "Comparing 48 tables", 34]] },
    { at: 9800, pass: ["verify", "migrate", "All tables match"], changes: [["verify", "done", "Totals match", 50], ["migrate", "done", "Rehearsal complete", 70]] },
    { at: 11000, pass: ["migrate", "lead", "Copy verified and ready"], changes: [["lead", "waiting", "Switch to the upgraded copy?", 27]] },
  ],
};

export const projects = [fix, post, migration];

import type { Span } from "./types";

export const TASK = "Prepare the Q3 sales brief";

export const SPANS: Span[] = [
  { id: "run", parentId: null, kind: "agent", title: "Orchestrator", detail: "Opus 5.5", icon: "bot", start: 0, duration: 74000 },
  { id: "plan", parentId: "run", kind: "llm", title: "Plan the brief", detail: "Opus 5.5", start: 900, duration: 6000, cost: 0.09, tokensIn: 2800, tokensOut: 500, input: "Split “prepare the Q3 sales brief” into research, charts and a deck" },

  { id: "research", parentId: "run", kind: "subagent", title: "Researcher", detail: "Sonnet 5.5", icon: "bot", start: 7200, duration: 28800 },
  { id: "news", parentId: "research", kind: "tool", title: "web_search", detail: "Competitor news", icon: "search", start: 8100, duration: 5300, cost: 0.005, input: "competitor product launches Q3" },
  { id: "market", parentId: "research", kind: "tool", title: "web_search", detail: "Market size", icon: "search", start: 8400, duration: 7200, cost: 0.005, input: "regional market size 2026" },
  { id: "crm", parentId: "research", kind: "tool", title: "Query CRM", detail: "Postgres", icon: "database", start: 8800, duration: 3500, input: "select region, sum(amount) from deals where quarter = 'Q3'" },
  { id: "reports", parentId: "research", kind: "tool", title: "Read analyst reports", detail: "64 pages", icon: "file", start: 14000, duration: 12500, cost: 0.02, input: "analyst-reports/q3/*.pdf" },
  { id: "summary", parentId: "research", kind: "llm", title: "Summarize findings", detail: "Gemini 3.8 Flash", start: 26800, duration: 9100, cost: 0.03, tokensIn: 31000, tokensOut: 1200, input: "Condense the search results and reports into five findings" },

  { id: "analysis", parentId: "run", kind: "subagent", title: "Analyst", detail: "Sonnet 5.5", icon: "bot", start: 10500, duration: 34000 },
  { id: "sheet", parentId: "analysis", kind: "tool", title: "Load revenue sheet", detail: "Sheets", icon: "chart", start: 11000, duration: 3200, input: "Revenue by region, Q1 to Q3" },
  { id: "export", parentId: "analysis", kind: "tool", title: "Pull pipeline export", detail: "CRM", icon: "database", start: 11300, duration: 4900, input: "Open deals closing in Q4" },
  { id: "charts", parentId: "analysis", kind: "llm", title: "Build charts", detail: "Sonnet 5.5", start: 17000, duration: 21500, cost: 0.09, tokensIn: 24000, tokensOut: 3100, input: "Turn the revenue sheet and pipeline export into four charts" },
  { id: "save", parentId: "analysis", kind: "tool", title: "Save charts", detail: "Drive", icon: "folder", start: 38800, duration: 3500, input: "q3-brief/charts" },

  { id: "build", parentId: "run", kind: "subagent", title: "Builder", detail: "GPT-6 Sol", icon: "bot", start: 14000, duration: 55000 },
  { id: "skeleton", parentId: "build", kind: "tool", title: "Create deck skeleton", detail: "Slides", icon: "slides", start: 14500, duration: 2000, input: "Title, five sections, appendix" },
  { id: "story", parentId: "build", kind: "llm", title: "Write narrative", detail: "GPT-6 Sol", start: 17000, duration: 19500, cost: 0.15, tokensIn: 38000, tokensOut: 4200, input: "Write one paragraph per section from the findings" },
  { id: "insert", parentId: "build", kind: "tool", title: "Insert charts", detail: "Slides", icon: "slides", start: 36800, duration: 3200, input: "Place four charts in sections two to five" },
  { id: "links", parentId: "build", kind: "tool", title: "Run link check", detail: "Shell", icon: "terminal", start: 40500, duration: 8100, failed: true, input: "npm run check-links", error: "2 of 14 links return 404 – the source URLs changed" },
  { id: "fix", parentId: "build", kind: "llm", title: "Fix broken links", detail: "GPT-6 Sol", start: 49000, duration: 7500, cost: 0.06, tokensIn: 9000, tokensOut: 800, input: "Replace the two dead links with their new addresses" },
  { id: "links-2", parentId: "build", kind: "tool", title: "Run link check", detail: "retry", icon: "terminal", start: 57000, duration: 6500, input: "npm run check-links" },
  { id: "publish", parentId: "build", kind: "tool", title: "Publish deck", detail: "Slides", icon: "slides", start: 64000, duration: 4800, input: "q3-sales-brief, shared with the team" },

  { id: "tracker", parentId: "run", kind: "tool", title: "Update tracker", detail: "Docs", icon: "file", start: 69200, duration: 3000, input: "Mark the Q3 brief as delivered" },
  { id: "notify", parentId: "run", kind: "tool", title: "Post to #sales", detail: "Chat", icon: "message", start: 69600, duration: 4400, input: "The Q3 brief is ready" },
];

export const DEFAULT_FOLDED = new Set(["research", "analysis"]);

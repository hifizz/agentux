import type { Step } from "./types";

export const RANGE = 70;

export const STEPS: Step[] = [
  { id: "plan", label: "Plan the migration", kind: "llm", start: 0, duration: 3.2 },
  { id: "schema", label: "Read the schema", kind: "tool", tool: "GitHub", start: 3.2, duration: 1.4 },
  { id: "files", label: "Read 14 migrations", kind: "tool", tool: "GitHub", start: 4.6, duration: 3.2 },
  { id: "write", label: "Write migration 0042", kind: "llm", start: 7.8, duration: 6.3 },
  { id: "pr", label: "Open pull request #491", kind: "tool", tool: "GitHub", start: 14.1, duration: 0.9 },
  { id: "review", label: "Reviewer checks the diff", kind: "agent", start: 15, duration: 7.4, mark: { pattern: "101010101", color: "#a651f0" } },
  { id: "tests", label: "Run the test suite", kind: "tool", tool: "GitHub", start: 15.6, duration: 5.2, parentId: "review" },
  { id: "comment", label: "Write the review", kind: "llm", start: 20.8, duration: 1.6, parentId: "review" },
  { id: "dry", label: "Dry run on staging", kind: "tool", tool: "Postgres", start: 22.4, duration: 1.6, failed: true },
  { id: "dry-retry", label: "Dry run on staging · retry", kind: "tool", tool: "Postgres", start: 24, duration: 9.6 },
  { id: "index", label: "Add the missing index", kind: "llm", start: 33.6, duration: 2.5 },
  { id: "pr-update", label: "Update pull request #491", kind: "tool", tool: "GitHub", start: 36.1, duration: 0.9 },
  { id: "tests-again", label: "Run the test suite again", kind: "tool", tool: "GitHub", start: 37, duration: 5.4 },
  { id: "guard", label: "Guard checks the data rules", kind: "agent", start: 37.4, duration: 7.4, mark: { pattern: "101101010", color: "#13b3a0" } },
  { id: "scan", label: "Scan the logs for personal data", kind: "tool", tool: "Postgres", start: 37.8, duration: 3.4, parentId: "guard" },
  { id: "access", label: "Check the access rules", kind: "llm", start: 41.2, duration: 3.2, parentId: "guard" },
  { id: "dry-final", label: "Dry run on staging · final", kind: "tool", tool: "Postgres", start: 44.8, duration: 8.4 },
  { id: "counts", label: "Compare row counts", kind: "tool", tool: "Postgres", start: 53.2, duration: 1.4 },
  { id: "summary", label: "Write the summary", kind: "llm", start: 54.6, duration: 3.3 },
  { id: "post", label: "Post the result", kind: "tool", tool: "Slack", start: 57.9, duration: 0.9 },
  { id: "approve", label: "Ask Alex to approve", kind: "tool", tool: "Slack", start: 58.8, duration: 0.8 },
];

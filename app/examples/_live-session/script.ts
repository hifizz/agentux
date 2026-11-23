import type { Agent, EventBody, FileRef, Message, Script, ScriptEvent, SessionState, SystemNote } from "./types";

export const AGENTS: Agent[] = [
  { id: "you", name: "You", pattern: "111111111", you: true },
  { id: "researcher", name: "Researcher", model: "Gemini 3.8 Flash", color: "rgba(166, 81, 240, 0.85)", pattern: "111010101" },
  { id: "writer", name: "Writer", model: "Sonnet 5.5", color: "rgba(20, 179, 240, 0.8)", pattern: "111000111" },
  { id: "orchestrator", name: "Orchestrator", model: "Gemini 3.8", color: "rgba(0, 96, 226, 0.78)", pattern: "000111111" },
  { id: "coder", name: "Coder", model: "Opus 5.5", color: "rgba(242, 138, 46, 0.82)", pattern: "101101010" },
];

const BRIEF = "Launch the new pricing page by Friday – per-seat plans, keep a free tier.";
const DRAFT_ASK = "Draft the copy for Free, Pro and Team – short, one line per plan.";

const copyFile: FileRef = {
  id: "plans-copy",
  label: "plans-copy.md",
  kind: "file",
  preview: {
    type: "doc",
    title: "plans-copy.md",
    lines: ["# Pricing copy", "Free – Everything you need to start, no seat limit.", "Pro – More history, more integrations, priority support.", "Team – Everything, together – for teams of 3 and more."],
  },
};

const tableFile: FileRef = {
  id: "pricing-table",
  label: "pricing-table.csv",
  kind: "file",
  preview: {
    type: "sheet",
    title: "pricing-table.csv",
    head: ["Product", "Per seat", "Free tier"],
    rows: [["Linear", "$10", "Yes"], ["Notion", "$12", "Yes"], ["Figma", "$15", "Yes"]],
  },
};

const billingFolder: FileRef = {
  id: "billing",
  label: "src/billing/",
  kind: "folder",
  preview: {
    type: "tree",
    title: "src/billing/",
    items: [
      { name: "billing", depth: 0, folder: true },
      { name: "plans.ts", depth: 1 },
      { name: "seat-picker.tsx", depth: 1 },
      { name: "pricing-page.tsx", depth: 1 },
    ],
  },
};

const frameFile: FileRef = {
  id: "frame",
  label: "Pricing / Desktop",
  kind: "frame",
  preview: { type: "doc", title: "Pricing / Desktop", lines: ["Figma frame · 1440 × 1024", "Three plan cards, seat picker below the Team card."] },
};

const prFile: FileRef = {
  id: "pr",
  label: "PR #482",
  kind: "pr",
  preview: { type: "doc", title: "PR #482", lines: ["Add per-seat pricing page", "4 files changed · preview deploy is ready for review."] },
};

const m = (v: Omit<Message, "kind" | "status"> & { status?: Message["status"] }): Message => ({ kind: "message", status: "done", ...v });
const sys = (v: Omit<SystemNote, "kind">): SystemNote => ({ kind: "system", ...v });

const brief = m({ id: "m-brief", from: "you", to: "orchestrator", text: BRIEF, time: "14:02" });
const research = m({
  id: "m-research",
  from: "researcher",
  to: "orchestrator",
  quote: "Find out what Linear, Notion and Figma charge per seat, and what their free tiers allow.",
  text: "Linear $10, {notion|Notion} $12, {figma|Figma} $15 per seat. All three keep a free tier.",
  time: "14:04",
  files: [{ id: "web", label: "web_search ×6", kind: "tool" }, tableFile],
  details: {
    facts: [["Model", "Gemini 3.8 Flash"], ["Tokens", "41.2k"], ["Cost", "$0.02"], ["Took", "1m 48s"]],
    items: [{ label: "web_search", detail: "6 searches – per-seat pricing 2026", icon: "search" }, { label: "Notion", detail: "Plans and limits", icon: "notion" }, { label: "pricing-table.csv", detail: "3 rows written", icon: "file" }],
  },
});
const writerAsk = m({ id: "m-writer-ask", from: "writer", to: "orchestrator", quote: DRAFT_ASK, text: "Do any of them cap seats on the free tier? I'd like to say ours doesn't.", time: "14:04", status: "typing" });
const researchAnswer = m({ id: "m-research-answer", from: "researcher", to: "writer", text: "None cap seats – {notion|Notion} limits guests to 10, Linear caps issues at 250.", time: "14:05", status: "typing" });
const writerDone = m({ id: "m-writer-done", from: "writer", to: "orchestrator", quote: DRAFT_ASK, text: "Copy for the three plans is ready in {notion|Notion} – Free says “no seat limit”.", time: "14:06", files: [copyFile], status: "typing" });
const handoff = m({
  id: "m-handoff",
  from: "orchestrator",
  to: "coder",
  tag: "Handoff",
  text: "Here's everything you need – copy, prices and the Figma frames.",
  time: "14:07",
  files: [billingFolder, copyFile, tableFile, frameFile],
  status: "typing",
  details: {
    facts: [["From", "Orchestrator"], ["To", "Coder"], ["Context", "18.4k tokens"]],
    items: [{ label: "src/billing/", detail: "Seat picker lives here", icon: "folder" }, { label: "Pricing / Desktop", detail: "Figma frame", icon: "frame" }],
  },
});
const coderAsk = m({ id: "m-coder-ask", from: "coder", to: "writer", text: "The Team line is two lines too long for its card – can you cut it?", time: "14:09", status: "typing" });
const writerCut = m({ id: "m-writer-cut", from: "writer", to: "coder", text: "“Everything, together – for teams of 3 and more.”", time: "14:09", status: "typing" });
const coderBlock = m({
  id: "m-coder-block",
  from: "coder",
  to: "you",
  quote: BRIEF,
  text: "The brief says Team is $12, the table suggests $15. Which one do I ship? Both prices are ready in {stripe|Stripe}.",
  time: "14:11",
  needsYou: true,
  status: "typing",
});
const wrapUp = m({ id: "m-wrap", from: "orchestrator", to: "everyone", text: "The pricing page is up for review on the preview deploy.", time: "14:12", files: [prFile], status: "typing" });

const segments = (files: number, conversation: number) => [
  { id: "system", label: "System prompt", tokens: 4200, color: "var(--ls-c1)" },
  { id: "tools", label: "Tools", tokens: 12800, color: "var(--ls-c2)" },
  { id: "files", label: "Files", tokens: files, color: "var(--ls-c3)" },
  { id: "conversation", label: "Conversation", tokens: conversation, color: "var(--ls-c4)" },
  { id: "memory", label: "Memory", tokens: 3900, color: "var(--ls-c5)" },
];

const initial: SessionState = {
  visible: ["you", "researcher", "writer"],
  items: [
    brief,
    sys({ id: "s-researcher", actor: "orchestrator", verb: "started", target: "researcher" }),
    sys({ id: "s-writer", actor: "orchestrator", verb: "started", target: "writer" }),
    research,
    writerAsk,
  ],
  steps: [
    { id: "compare", title: "Compare per-seat prices", status: "done", seconds: 84, agents: ["researcher"] },
    { id: "draft", title: "Draft the copy for the three plans", status: "active", seconds: 495, agents: ["writer", "orchestrator"] },
    { id: "build", title: "Build /pricing with the seat picker", status: "pending", agents: ["coder", "researcher"] },
    { id: "price", title: "Pick the Team price", status: "pending", agents: ["coder", "you"] },
    { id: "review", title: "Review the preview deploy", status: "pending", agents: ["orchestrator"] },
  ],
  context: { window: 200000, model: "Opus 5.5", segments: segments(12800, 18000) },
};

const at = (t: number, e: EventBody): ScriptEvent => ({ at: t, ...e });
const tokens = (files: number, conversation: number) => ({ type: "tokens" as const, values: { files, conversation } });

const events: ScriptEvent[] = [
  at(800, { type: "say", id: writerAsk.id }),
  at(1600, { type: "add", item: researchAnswer }),
  at(1600, tokens(12800, 21600)),
  at(2400, { type: "say", id: researchAnswer.id }),
  at(3200, { type: "add", item: writerDone }),
  at(3200, { type: "step", id: "draft", status: "done", seconds: 168 }),
  at(3200, { type: "step", id: "build", status: "active", seconds: 0 }),
  at(3800, { type: "say", id: writerDone.id }),
  at(4700, { type: "add", item: sys({ id: "s-coder", actor: "orchestrator", verb: "started", target: "coder" }) }),
  at(4700, tokens(19200, 27800)),
  at(5900, { type: "reveal", agent: "orchestrator" }),
  at(5900, { type: "add", item: handoff }),
  at(5900, tokens(38500, 31500)),
  at(6800, { type: "say", id: handoff.id }),
  at(6800, tokens(44800, 32400)),
  at(7900, { type: "reveal", agent: "coder" }),
  at(7900, { type: "add", item: coderAsk }),
  at(7900, tokens(44800, 36000)),
  at(8300, { type: "say", id: coderAsk.id }),
  at(9200, { type: "add", item: writerCut }),
  at(9200, tokens(44800, 39400)),
  at(9800, { type: "say", id: writerCut.id }),
  at(10700, { type: "add", item: coderBlock }),
  at(10700, tokens(44800, 42500)),
  at(11300, { type: "say", id: coderBlock.id }),
  at(11300, tokens(44800, 43200)),
  at(12200, { type: "add", item: wrapUp }),
  at(12200, { type: "step", id: "build", status: "done", seconds: 293 }),
  at(12200, { type: "step", id: "price", status: "done", seconds: 125 }),
  at(12200, { type: "step", id: "review", status: "active", seconds: 0 }),
  at(12800, { type: "say", id: wrapUp.id }),
  at(12800, tokens(51200, 46800)),
];

export const SCRIPT: Script = { agents: AGENTS, initial, events, duration: 18200, agentCount: 4, startSeconds: 579 };

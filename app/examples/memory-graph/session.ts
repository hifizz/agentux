export type FileMark = "chat" | "pdf" | "word" | "sheet" | "figma" | "markdown" | "file";
export type Memory = {
  kind: "memory"; id: string; name: string; source: string; file: string; mark: FileMark;
  tag: string; learned: string; uses: number; via?: string; related?: string[]; replaces?: string;
};
export type Tool = {
  kind: "tool"; id: string; name: string; access: string; scope: string; note: string; last: string; calls: number;
};
export type Entry = Memory | Tool;

export const memories: Memory[] = [
  { kind: "memory", id: "brief", name: "Likes a summary first", source: "From two recent reviews", file: "Chat · Review notes", mark: "chat", tag: "Preference", learned: "Sep 8", uses: 28 },
  { kind: "memory", id: "role", name: "Design lead at Cedar", source: "Listed in the team profile", file: "team-profile.pdf", mark: "pdf", tag: "Profile", learned: "Sep 15", uses: 19 },
  { kind: "memory", id: "date", name: "Pilot opens May 6", source: "Set in the launch brief", file: "pilot-brief.docx", mark: "word", tag: "Project", learned: "Apr 3", uses: 12, via: "notion", related: ["budget"] },
  { kind: "memory", id: "budget", name: "Pilot budget is $36k", source: "From the planning sheet", file: "pilot-costs.xlsx", mark: "sheet", tag: "Project", learned: "Apr 4", uses: 9, related: ["date"] },
  { kind: "memory", id: "palette", name: "Prefers muted palettes", source: "Chosen in the last review", file: "pilot-palette.fig", mark: "figma", tag: "Preference", learned: "Today", uses: 0, via: "figma", related: ["brief"] },
  { kind: "memory", id: "new-date", name: "Pilot opens May 13", source: "Revised at the team sync", file: "pilot-sync.md", mark: "markdown", tag: "Project", learned: "Today", uses: 0, via: "notion", replaces: "date", related: ["budget"] },
];

function tool(id: string, name: string, access: string, scope: string, note: string, last: string, calls: number): Tool {
  return { kind: "tool", id, name, access, scope, note, last, calls };
}
export const tools = [
  tool("github", "GitHub", "Read & write", "cedar/pilot", "Reviewed pull request #76", "35m ago", 145),
  tool("linear", "Linear", "Read", "Pilot", "Checked the pilot milestones", "2h ago", 86),
  tool("notion", "Notion", "Read", "Team wiki", "Found the latest sync notes", "1d ago", 43),
  tool("figma", "Figma", "Read", "Cedar files", "Viewed the palette studies", "4h ago", 27),
  tool("vercel", "Vercel", "Deploy", "Previews", "Published a review build", "2d ago", 8),
];
export const catalog = [
  tool("slack", "Slack", "Read", "#pilot", "Just connected", "", 0),
  tool("gmail", "Gmail", "Read", "Inbox", "Just connected", "", 0),
  tool("drive", "Google Drive", "Read", "Cedar", "Just connected", "", 0),
];

export type Flight = { from?: string; to: string };
type Beat = { at: number; using?: string; recall?: string[]; learn?: string; flight?: Flight };
export const beats: Beat[] = [
  { at: 0 },
  { at: 900, using: "linear", recall: ["brief"], flight: { to: "linear" } },
  { at: 3000 },
  { at: 3600, using: "figma", flight: { to: "figma" } },
  { at: 4700, using: "figma", learn: "palette", flight: { from: "figma", to: "palette" } },
  { at: 5600, learn: "palette" }, { at: 6000 },
  { at: 7200, using: "notion", flight: { to: "notion" } },
  { at: 8300, using: "notion", learn: "new-date", flight: { from: "notion", to: "new-date" } },
  { at: 9200, learn: "new-date" }, { at: 9600 },
  { at: 11400, using: "github", recall: ["budget", "new-date"], flight: { to: "github" } },
  { at: 14200 },
];
export function memoryFromFile(file: File): Memory {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  const marks: Record<string, FileMark> = { pdf: "pdf", doc: "word", docx: "word", xls: "sheet", xlsx: "sheet", csv: "sheet", fig: "figma", md: "markdown" };
  return { kind: "memory", id: crypto.randomUUID(), name: file.name.replace(/\.[^.]+$/, ""), file: file.name, mark: marks[ext] ?? "file", tag: "File", source: "Added from your files", learned: "Today", uses: 0 };
}

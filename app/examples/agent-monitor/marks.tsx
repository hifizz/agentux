import { Pencil } from "lucide-react";
import { AnthropicMark, GitHubMark, LinearMark, NotionMark, OpenAIMark, SlackMark } from "../_shared/ui/icons";
import type { Tool } from "./runs";

function Terminal() {
  return <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="1.5" y="3" width="13" height="10" rx="2"/><path d="m4.5 6 2 2-2 2m4 0h2.5"/></svg>;
}
function Drive() {
  return <svg viewBox="0 0 24 24" fill="#1aa365" aria-hidden="true"><path d="M8 2h8l8 14h-8ZM7 3l4 7-7.4 13L0 16Zm-.8 19.5 3.6-6.1h14L20 22.5Z"/></svg>;
}
const marks = { Linear: LinearMark, GitHub: GitHubMark, Notion: NotionMark, Slack: SlackMark, Terminal, Edit: Pencil, "Google Drive": Drive };
export function ToolMark({ tool }: { tool: Tool }) {
  const Mark = marks[tool];
  return <Mark aria-hidden="true" />;
}
export function Face({ scene }: { scene: number }) {
  return <span className="am-face" aria-hidden="true">{scene === 0 ? <AnthropicMark /> : <OpenAIMark />}</span>;
}

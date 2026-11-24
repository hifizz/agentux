import { File as FileIcon } from "lucide-react";
import { FigmaMark, GitHubMark, GmailMark, GoogleDriveMark, LinearMark, NotionMark, SlackMark, VercelMark } from "../_shared/ui/icons";
import { FileMark as OfficeMark } from "../agent-workbench/marks";
import type { Entry } from "./session";

const toolMarks = { github: GitHubMark, linear: LinearMark, notion: NotionMark, figma: FigmaMark, vercel: VercelMark, slack: SlackMark, gmail: GmailMark, drive: GoogleDriveMark };

export function Mark({ item }: { item: Entry }) {
  if (item.kind === "tool") {
    const Logo = toolMarks[item.id as keyof typeof toolMarks];
    return Logo ? <Logo style={item.id === "linear" ? { color: "#5e6ad2" } : undefined} /> : <span>{item.name[0]}</span>;
  }
  switch (item.mark) {
    case "word": return <OfficeMark kind="doc" />;
    case "sheet": case "pdf": return <OfficeMark kind={item.mark} />;
    case "figma": return <FigmaMark />;
    case "chat": return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="3" width="16" height="14" rx="4" fill="#00a1ff" /><path d="M5 7h10a4 4 0 0 1 4 4v5a4 4 0 0 1-4 4H9l-5 3v-4a4 4 0 0 1-3-4v-4a4 4 0 0 1 4-4Z" fill="#3cc7ff" /></svg>;
    case "markdown": return <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"><rect x="1.4" y="5" width="21.2" height="14" rx="2" /><path d="M5 15.5V9l3 3 3-3v6.5m5.5-7v6m-2.5-2.3 2.5 2.6 2.5-2.6" /></svg>;
    case "file": return <FileIcon aria-hidden="true" />;
  }
}

export function PixelMark({ busy }: { busy: boolean }) {
  return <span className="mg-avatar" aria-hidden="true"><span className="mg-pixels" data-busy={busy || undefined}>
    {[0,1,0,1,1,1,1,0,1].map((on,i) => <i key={i} data-on={on || undefined} style={{ animationDelay: ((i % 3) + Math.floor(i / 3)) * 120 + "ms" }} />)}
  </span></span>;
}

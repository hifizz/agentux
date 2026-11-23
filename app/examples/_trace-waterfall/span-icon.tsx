import { Bot, ChartColumn, Database, FileText, Folder, MessageSquare, Presentation, Search, Sparkles, SquareTerminal } from "lucide-react";
import type { IconKey, SpanKind } from "./types";

const ICONS = { bot: Bot, sparkle: Sparkles, search: Search, database: Database, file: FileText, chart: ChartColumn, terminal: SquareTerminal, slides: Presentation, message: MessageSquare, folder: Folder };

const FALLBACK: Record<SpanKind, IconKey> = { agent: "bot", subagent: "bot", llm: "sparkle", tool: "file" };

export function SpanIcon({ icon, kind }: { icon?: IconKey; kind: SpanKind }) {
  const Icon = ICONS[icon ?? FALLBACK[kind]];
  return (
    <span className="wf__icon" aria-hidden="true">
      <Icon size={12} />
    </span>
  );
}

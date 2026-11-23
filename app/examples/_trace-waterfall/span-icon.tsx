import { Bot, ChartColumn, Database, FileText, Folder, MessageSquare, Presentation, Search, Sparkles, SquareTerminal } from "lucide-react";
import { KindTile } from "../_trace-kit/kind-tile";
import type { IconKey, SpanKind } from "./types";

const ICONS = { bot: Bot, sparkle: Sparkles, search: Search, database: Database, file: FileText, chart: ChartColumn, terminal: SquareTerminal, slides: Presentation, message: MessageSquare, folder: Folder };

const FALLBACK: Record<SpanKind, IconKey> = { agent: "bot", subagent: "bot", llm: "sparkle", tool: "file" };

export function SpanIcon({ icon, kind }: { icon?: IconKey; kind: SpanKind }) {
  const Icon = ICONS[icon ?? FALLBACK[kind]];
  return (
    <KindTile aria-hidden="true">
      <Icon size={12} />
    </KindTile>
  );
}

import { createElement } from "react";
import {
  Binary, Bot, Code, Database, FilePen, FileText, FolderOpen, GitBranch, Globe, Layers, Link2, Mail, Scale, Search, ShieldCheck, Sparkles, SquareTerminal, Wrench, Zap, type LucideIcon,
} from "lucide-react";
import { KindIcon, type KindBadge, type KindShape } from "../_trace-kit/kind-icon";
import { PixelMark } from "../_trace-kit/pixel-mark";
import { avatarOf } from "./agent-avatar";
import type { NodeKind, TraceNode } from "./model";
import { toneOf } from "./view-model";

export const KIND_LABEL: Record<NodeKind, string> = {
  generation: "Generation",
  tool: "Tool",
  agent: "Agent",
  span: "Span",
  chain: "Chain",
  retriever: "Retriever",
  evaluator: "Evaluator",
  embedding: "Embedding",
  guardrail: "Guardrail",
  event: "Event",
};

type Look = { shape: KindShape; size: number; glyph: LucideIcon };

const LOOKS: Record<NodeKind, Look> = {
  agent: { shape: "square", size: 22, glyph: Bot },
  generation: { shape: "circle", size: 20, glyph: Sparkles },
  embedding: { shape: "circle", size: 20, glyph: Binary },
  tool: { shape: "square", size: 20, glyph: Wrench },
  retriever: { shape: "square", size: 20, glyph: Search },
  evaluator: { shape: "circle", size: 20, glyph: Scale },
  guardrail: { shape: "circle", size: 20, glyph: ShieldCheck },
  chain: { shape: "outline", size: 17, glyph: Link2 },
  span: { shape: "outline", size: 17, glyph: Layers },
  event: { shape: "diamond", size: 18, glyph: Zap },
};

const TOOL_GLYPHS: [RegExp, LucideIcon][] = [
  [/search|query|find|lookup/i, Search],
  [/url|web|http|fetch|browse|crawl/i, Globe],
  [/write|edit|patch|save|create_file/i, FilePen],
  [/read_file|file|doc|pdf|open/i, FileText],
  [/dir|folder|list|ls\b|glob/i, FolderOpen],
  [/sql|db|database|postgres|redis|store/i, Database],
  [/shell|bash|exec|run|command|terminal/i, SquareTerminal],
  [/git|branch|commit|pull_request|pr\b/i, GitBranch],
  [/mail|email|slack|message|notify/i, Mail],
  [/code|eval|python|script/i, Code],
];

export const glyphFor = (node: Pick<TraceNode, "kind" | "name">): LucideIcon => (node.kind === "tool" ? (TOOL_GLYPHS.find(([pattern]) => pattern.test(node.name))?.[1] ?? Wrench) : LOOKS[node.kind].glyph);

const badgeOf = (node: TraceNode): KindBadge | undefined => (node.failure === "origin" ? "failed" : node.failure === "propagated" ? "propagated" : node.status === "running" ? "running" : undefined);

export function NodeIcon({ node, scale = 1 }: { node: TraceNode; scale?: number }) {
  const look = LOOKS[node.kind];
  const tone = toneOf(node);
  const avatar = node.kind === "agent" && tone === "agent" ? avatarOf(node.name) : null;
  return (
    <KindIcon tone={tone} shape={look.shape} size={Math.round(look.size * scale)} hue={avatar?.hue} badge={badgeOf(node)} aria-hidden="true">
      {avatar ? <PixelMark pattern={avatar.pattern} color={avatar.hue} busy={node.status === "running"} /> : createElement(glyphFor(node), { size: 12 })}
    </KindIcon>
  );
}

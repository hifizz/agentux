import { Binary, Bot, Layers, Link2, Scale, Search, ShieldCheck, Sparkles, Wrench, Zap, type LucideIcon } from "lucide-react";
import { KindTile } from "../_trace-kit/kind-tile";
import type { NodeKind } from "./model";

const ICONS: Record<NodeKind, LucideIcon> = {
  generation: Sparkles,
  tool: Wrench,
  agent: Bot,
  span: Layers,
  chain: Link2,
  retriever: Search,
  evaluator: Scale,
  embedding: Binary,
  guardrail: ShieldCheck,
  event: Zap,
};

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

export function NodeIcon({ kind, size = 12 }: { kind: NodeKind; size?: number }) {
  const Icon = ICONS[kind];
  return (
    <KindTile aria-hidden="true">
      <Icon size={size} />
    </KindTile>
  );
}

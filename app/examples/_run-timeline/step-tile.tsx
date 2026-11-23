import { Database, GitBranch, MessageSquare, Sparkles, Wrench, type LucideIcon } from "lucide-react";
import { KindTile } from "../_trace-kit/kind-tile";
import { PixelMark } from "../_trace-kit/pixel-mark";
import type { StepView } from "./types";

const TOOL_ICONS: Record<string, LucideIcon> = { github: GitBranch, postgres: Database, slack: MessageSquare };

export function StepTile({ view }: { view: StepView }) {
  const { step } = view;
  const running = view.status === "running";
  const Icon = step.kind === "llm" ? Sparkles : (step.tool && TOOL_ICONS[step.tool.toLowerCase()]) || Wrench;
  return (
    <KindTile data-kind={step.kind} data-agent={step.kind === "agent" ? "" : undefined}>
      {step.kind === "agent" && step.mark ? <PixelMark pattern={step.mark.pattern} color={step.mark.color} busy={running} /> : <Icon size={11} aria-hidden="true" />}
    </KindTile>
  );
}

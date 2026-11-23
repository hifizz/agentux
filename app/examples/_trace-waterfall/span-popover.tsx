"use client";

import { CardHead, CardWho, CloseButton, ErrorNote, FactGrid, FloatingCard, LabeledText, type CardPosition } from "../_trace-kit/floating-card";
import { StatusPill } from "../_trace-kit/status-pill";
import { useClosable } from "../_trace-kit/use-closable";
import { formatCost, formatDuration, formatTokens } from "./format";
import { SpanIcon } from "./span-icon";
import type { SpanView } from "./types";

const KIND = { agent: "Agent run", subagent: "Sub-agent", llm: "LLM call", tool: "Tool call" };
const STATUS = { running: "Running", done: "Done", failed: "Failed" };

export type SpanPopoverProps = {
  view: SpanView;
  position: CardPosition;
  onClose: () => void;
};

export function SpanPopover({ view, position, onClose }: SpanPopoverProps) {
  const { span } = view;
  const { closing, close } = useClosable(onClose);

  const stats: [string, string][] = [
    ["Duration", formatDuration(view.elapsed)],
    ["Started", `+${formatDuration(span.start)}`],
  ];
  if (view.cost > 0) stats.push(["Cost", formatCost(view.cost)]);
  if (view.tokensIn > 0) stats.push(["Tokens in", formatTokens(view.tokensIn)], ["Tokens out", formatTokens(view.tokensOut)]);

  return (
    <FloatingCard aria-label={`${span.title} details`} data-kind={span.kind} data-status={view.status} position={position} closing={closing}>
      <CardHead>
        <SpanIcon icon={span.icon} kind={span.kind} />
        <CardWho title={span.title} sub={`${KIND[span.kind]}${span.detail ? ` · ${span.detail}` : ""}`} />
        <StatusPill status={view.status}>{STATUS[view.status]}</StatusPill>
        <CloseButton label="Close details" onClick={close} />
      </CardHead>
      <FactGrid items={stats} />
      {view.status === "failed" && span.error && <ErrorNote>{span.error}</ErrorNote>}
      {span.input && <LabeledText label="Input">{span.input}</LabeledText>}
    </FloatingCard>
  );
}

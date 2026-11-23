"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { TriangleAlert, X } from "lucide-react";
import { formatCost, formatDuration, formatTokens } from "./format";
import { SpanIcon } from "./span-icon";
import type { SpanView } from "./types";

const KIND = { agent: "Agent run", subagent: "Sub-agent", llm: "LLM call", tool: "Tool call" };
const STATUS = { running: "Running", done: "Done", failed: "Failed" };

export type SpanPopoverProps = {
  view: SpanView;
  position: { left: number; top?: number; bottom?: number; side: "above" | "below" };
  onClose: () => void;
};

export function SpanPopover({ view, position, onClose }: SpanPopoverProps) {
  const { span } = view;
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setClosing(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!closing) return;
    const id = window.setTimeout(onClose, 160);
    return () => window.clearTimeout(id);
  }, [closing, onClose]);

  const stats: [string, string][] = [
    ["Duration", formatDuration(view.elapsed)],
    ["Started", `+${formatDuration(span.start)}`],
  ];
  if (view.cost > 0) stats.push(["Cost", formatCost(view.cost)]);
  if (view.tokensIn > 0) stats.push(["Tokens in", formatTokens(view.tokensIn)], ["Tokens out", formatTokens(view.tokensOut)]);

  return (
    <div
      className="wf__pop"
      role="dialog"
      aria-label={`${span.title} details`}
      data-kind={span.kind}
      data-status={view.status}
      data-side={position.side}
      data-closing={closing ? "" : undefined}
      style={{ left: position.left, top: position.top, bottom: position.bottom } as CSSProperties}
      onClick={(event) => event.stopPropagation()}
    >
      <div className="wf__pop-head">
        <SpanIcon icon={span.icon} kind={span.kind} />
        <span className="wf__pop-who">
          <span className="wf__pop-name" dir="auto">{span.title}</span>
          <span className="wf__pop-kind">{KIND[span.kind]}{span.detail ? ` · ${span.detail}` : ""}</span>
        </span>
        <span className="wf__pill" data-status={view.status}>{STATUS[view.status]}</span>
        <button type="button" className="wf__close" aria-label="Close details" onClick={() => setClosing(true)}>
          <X size={14} aria-hidden="true" />
        </button>
      </div>
      <dl className="wf__pop-stats">
        {stats.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      {view.status === "failed" && span.error && (
        <div className="wf__pop-error">
          <TriangleAlert size={12} aria-hidden="true" />
          <span className="wf__pop-error-text">{span.error}</span>
        </div>
      )}
      {span.input && (
        <div className="wf__pop-io">
          <span>Input</span>
          <p dir="auto">{span.input}</p>
        </div>
      )}
    </div>
  );
}

import type { KeyboardEvent, Ref } from "react";
import { ChevronDown, LoaderCircle, TriangleAlert } from "lucide-react";
import { SpanBar, SpanMark } from "../_trace-kit/span-bar";
import { SpanTag } from "../_trace-kit/span-tag";
import { formatCost, formatDuration } from "./format";
import { SpanIcon } from "./span-icon";
import type { SpanView } from "./types";

export type TraceRowProps = {
  view: SpanView;
  range: number;
  index: number;
  hidden: boolean;
  folded: boolean;
  open: boolean;
  focusable: boolean;
  rowRef: Ref<HTMLDivElement>;
  onSelect: () => void;
  onToggle: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
};

const label = (view: SpanView, amount: string) => {
  const kind = { agent: "Agent run", subagent: "Sub-agent", llm: "LLM call", tool: "Tool call" }[view.span.kind];
  const status = { running: "Running", done: "Done", failed: "Failed" }[view.status];
  return `${view.span.title}, ${kind}, ${status}, ${amount}`;
};

export function TraceRow({ view, range, index, hidden, folded, open, focusable, rowRef, onSelect, onToggle, onKeyDown }: TraceRowProps) {
  const { span, status, elapsed } = view;
  const parent = view.childCount > 0 || span.kind === "agent" || span.kind === "subagent";
  const live = status === "running";
  const amount = formatDuration(elapsed);
  const cost = view.cost > 0 ? ` · ${formatCost(view.cost)}` : "";

  return (
    <div
      ref={rowRef}
      className="wf__row"
      role="treeitem"
      aria-level={view.depth + 1}
      aria-selected={open}
      aria-expanded={parent ? !folded : undefined}
      aria-label={label(view, amount + cost)}
      tabIndex={focusable ? 0 : -1}
      data-kind={span.kind}
      data-status={status}
      data-parent={parent ? "" : undefined}
      data-open={open ? "" : undefined}
      data-folded={parent && folded ? "" : undefined}
      data-hidden={hidden ? "" : undefined}
      style={{ animationDelay: `${Math.min(index, 6) * 20}ms` }}
      onClick={onSelect}
      onKeyDown={onKeyDown}
    >
      <div className="wf__name">
        <span className="wf__guides" aria-hidden="true" style={{ width: `calc(${view.depth} * var(--wf-indent))` }} />
        {parent ? (
          <button
            type="button"
            className="wf__chev"
            tabIndex={-1}
            aria-label={folded ? `Expand ${span.title}` : `Collapse ${span.title}`}
            onClick={(event) => {
              event.stopPropagation();
              onToggle();
            }}
          >
            <ChevronDown size={12} aria-hidden="true" />
          </button>
        ) : (
          <span className="wf__chev" data-leaf="" aria-hidden="true" />
        )}
        <SpanIcon icon={span.icon} kind={span.kind} />
        <span className="wf__label">
          <span className="wf__title" dir="auto">{span.title}</span>
          {span.detail && <span className="wf__detail" dir="auto">{span.detail}</span>}
        </span>
        {parent && folded && view.childCount > 0 && <span className="wf__more">+{view.childCount}</span>}
        <span className="wf__state" data-status={status}>
          {live && span.kind !== "agent" && span.kind !== "subagent" && <LoaderCircle className="tk-spin" size={12} aria-hidden="true" />}
          {status === "failed" && <TriangleAlert size={12} aria-hidden="true" />}
        </span>
        <span className="wf__meta">
          <span className="wf__amount" data-live={live ? "" : undefined}>
            {amount}
            {cost && <span className="wf__meta-cost">{cost}</span>}
          </span>
          {view.slowest && <span className="wf__slow">Slowest</span>}
        </span>
      </div>
      <div className="wf__track">
        <SpanBar status={status} start={span.start} duration={elapsed} range={range} />
        {view.marks.map((mark) => (
          <SpanMark key={mark.id} kind={mark.kind} start={mark.start} duration={mark.duration} range={range} />
        ))}
        <SpanTag side={view.side} start={span.start} duration={elapsed} range={range}>
          <span className="wf__amount" data-live={live ? "" : undefined}>
            {amount}
            {cost}
          </span>
          {view.slowest && <span className="wf__slow">Slowest</span>}
        </SpanTag>
      </div>
    </div>
  );
}

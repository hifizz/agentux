import type { KeyboardEvent } from "react";
import { ChevronDown } from "lucide-react";
import { tagSide, type Axis } from "../_trace-kit/axis";
import { SpanBar, SpanBracket, SpanDot } from "../_trace-kit/span-bar";
import { SpanTag } from "../_trace-kit/span-tag";
import { formatDuration, formatTokens } from "./format";
import type { TraceNode } from "./model";
import { KIND_LABEL, NodeIcon } from "./node-icon";
import { isInstant, toneOf } from "./view-model";

export type NodeRowProps = {
  node: TraceNode;
  axis: Axis;
  hidden: boolean;
  folded: boolean;
  expandable: boolean;
  below: number;
  selected: boolean;
  focusable: boolean;
  rowRef: (element: HTMLDivElement | null) => void;
  onSelect: () => void;
  onToggle: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
};

const STATUS = { running: "Running", ok: "Done", warning: "Warning", error: "Failed" };

export function NodeRow({ node, axis, hidden, folded, expandable, below, selected, focusable, rowRef, onSelect, onToggle, onKeyDown }: NodeRowProps) {
  const tone = toneOf(node);
  const amount = formatDuration(node.duration);
  const label = node.kind === "generation" && node.tokens ? `${amount} · ${formatTokens(node.tokens.total)}` : amount;
  const instant = isInstant(node);
  const wrapper = (node.kind === "span" || node.kind === "chain") && node.childIds.length > 0;
  const geometry = { start: node.start, duration: node.duration, range: axis.range };

  return (
    <div
      ref={rowRef}
      className="tv-row"
      role="treeitem"
      aria-level={node.depth + 1}
      aria-selected={selected}
      aria-expanded={expandable ? !folded : undefined}
      aria-label={`${node.name}, ${KIND_LABEL[node.kind]}, ${STATUS[node.status]}, ${amount}`}
      tabIndex={focusable ? 0 : -1}
      data-fail={node.failure ?? undefined}
      data-selected={selected ? "" : undefined}
      data-folded={expandable && folded ? "" : undefined}
      data-hidden={hidden ? "" : undefined}
      onClick={onSelect}
      onKeyDown={onKeyDown}
    >
      <div className="tv-name" style={{ paddingLeft: node.depth * 14 }}>
        {expandable ? (
          <button
            type="button"
            className="tv-chev"
            tabIndex={-1}
            aria-label={folded ? `Expand ${node.name}` : `Collapse ${node.name}`}
            onClick={(event) => {
              event.stopPropagation();
              onToggle();
            }}
          >
            <ChevronDown size={12} aria-hidden="true" />
          </button>
        ) : (
          <span className="tv-chev" data-leaf="" aria-hidden="true" />
        )}
        <span className="tv-icon"><NodeIcon node={node} /></span>
        <span className="tv-title" data-parent={node.childIds.length > 0 && node.kind !== "span" ? "" : undefined} dir="auto">{node.name}</span>
        {folded && below > 0 && <span className="tv-more">+{below}</span>}
        <span className="tv-amount">{amount}</span>
      </div>
      <div className="tv-track">
        {instant ? (
          <SpanDot start={node.start} range={axis.range} kind={tone} />
        ) : wrapper ? (
          <SpanBracket {...geometry} />
        ) : (
          <SpanBar {...geometry} kind={tone} status={node.status === "running" ? "running" : undefined} wait={node.kind === "generation" ? node.ttft : undefined} />
        )}
        <SpanTag {...geometry} side={tagSide(node.start, node.duration, axis.range)} gap={instant ? 8 : 4} kind={tone}>{label}</SpanTag>
      </div>
    </div>
  );
}

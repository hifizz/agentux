import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { StatusPill } from "../_trace-kit/status-pill";
import { formatDuration, formatSpan, formatTokens } from "./format";
import { summaryOf, type Turn } from "./session-model";
import { TokenBreakdown } from "./token-legend";
import { cachedShare } from "./view-model";

export type TurnRowProps = {
  turn: Turn;
  open: boolean;
  onToggle: () => void;
  rowRef: (element: HTMLLIElement | null) => void;
  children: ReactNode;
};

export function TurnRow({ turn, open, onToggle, rowRef, children }: TurnRowProps) {
  const { trace, state } = turn;
  const tokens = trace.totals.tokens;
  const share = cachedShare(tokens);
  const errors = trace.totals.errors;
  const bodyId = `turn-${trace.id}`;
  return (
    <li ref={rowRef} className="sv-turn" data-state={state} data-open={open ? "" : undefined}>
      <h3 className="sv-turn-head">
        <button type="button" className="sv-turn-toggle" aria-expanded={open} aria-controls={open ? bodyId : undefined} onClick={onToggle}>
          <ChevronDown className="sv-chevron" size={14} aria-hidden="true" />
          <span className="sv-n">{turn.index + 1}</span>
          <span className="sv-name">
            <b>{trace.name}</b>
            <em>{turn.offset === 0 ? "start" : `+${formatSpan(turn.offset)}`}</em>
          </span>
          <span className="sv-sum">{summaryOf(trace)}</span>
          <span className="sv-tok">
            {tokens ? (
              <>
                <span>{formatTokens(tokens.total)}</span>
                <TokenBreakdown tokens={tokens} size="sm" />
                <em>{share === null ? "" : `${Math.round(share * 100)}%`}</em>
              </>
            ) : null}
          </span>
          <span className="sv-dur">{formatDuration(trace.duration)}</span>
          <span className="sv-state">
            {state === "running" && <StatusPill status="running" pulse>Live</StatusPill>}
            {state === "failed" && <span className="sv-chip" data-tone="bad">Failed</span>}
            {state === "partial" && <span className="sv-chip" data-tone="warn">{errors} error{errors > 1 ? "s" : ""}</span>}
          </span>
        </button>
      </h3>
      {open && (
        <div id={bodyId} className="sv-turn-body">
          {children}
        </div>
      )}
    </li>
  );
}

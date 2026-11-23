import { Sparkle, TriangleAlert } from "lucide-react";
import { StatStrip, type Stat } from "../_trace-kit/stat-strip";
import { StatusPill } from "../_trace-kit/status-pill";
import { formatCost, formatDuration, formatStart, formatTokens } from "./format";
import type { Trace } from "./model";
import { TokenBreakdown } from "./token-legend";
import { cachedShare } from "./view-model";

export type TraceHeadProps = {
  trace: Trace;
  failures: number;
  onJump: () => void;
};

export function statsOf(trace: Trace): Stat[] {
  const { tokens, cost, errors, failedNodes, generations, tools } = trace.totals;
  const share = cachedShare(tokens);
  const propagated = failedNodes - errors;
  return [
    { label: "Duration", value: formatDuration(trace.duration) },
    { label: "Generations", value: String(generations) },
    { label: "Tools", value: String(tools) },
    tokens
      ? { label: "Tokens", value: formatTokens(tokens.total), caption: share === null ? undefined : `${Math.round(share * 100)}% cached`, footer: <TokenBreakdown tokens={tokens} size="sm" /> }
      : { label: "Tokens", value: "—", muted: true },
    cost === null ? { label: "Cost", value: "—", muted: true, caption: "no pricing" } : { label: "Cost", value: formatCost(cost) },
    { label: "Errors", value: String(errors), tone: errors > 0 ? "bad" : undefined, caption: propagated > 0 ? `+${propagated} propagated` : undefined },
  ];
}

export function TraceHead({ trace, failures, onJump }: TraceHeadProps) {
  const failed = trace.nodes.some((node) => node.parentId === null && node.status === "error");
  return (
    <>
      <header className="tv-head">
        <span className="tv-spark"><Sparkle size={14} fill="currentColor" aria-hidden="true" /></span>
        <b>{trace.name}</b>
        <span className="tv-meta">{[trace.environment, formatStart(trace.startedAt)].filter(Boolean).join(" · ")}</span>
        {failures > 0 && (
          <button type="button" className="tv-jump" onClick={onJump}>
            <TriangleAlert size={12} aria-hidden="true" />
            Jump to failure{failures > 1 ? ` (${failures})` : ""}
          </button>
        )}
        <StatusPill status={trace.running ? "running" : failed ? "failed" : "done"} pulse={trace.running} style={{ marginLeft: "auto" }}>
          {trace.running ? "Live" : failed ? "Failed" : "Done"}
        </StatusPill>
      </header>
      <StatStrip items={statsOf(trace)} />
    </>
  );
}

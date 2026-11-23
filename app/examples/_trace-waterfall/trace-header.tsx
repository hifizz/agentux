import { Sparkle } from "lucide-react";
import { StatStrip, type Stat } from "../_trace-kit/stat-strip";
import { StatusPill } from "../_trace-kit/status-pill";
import { formatCost, formatDuration, formatTokens } from "./format";
import type { TraceTotals } from "./types";

export type TraceHeaderProps = {
  title: string;
  task: string;
  live: boolean;
  totals: TraceTotals;
};

export function TraceHeader({ title, task, live, totals }: TraceHeaderProps) {
  const failed = !live && totals.errors > 0;
  const stats: Stat[] = [
    { label: "Duration", value: formatDuration(totals.duration) },
    { label: "Cost", value: formatCost(totals.cost) },
    { label: "Tokens", value: formatTokens(totals.tokens) },
    { label: "LLM calls", value: String(totals.llmCalls) },
    { label: "Tool calls", value: String(totals.toolCalls) },
    { label: "Errors", value: String(totals.errors), tone: totals.errors > 0 ? "bad" : undefined },
  ];
  return (
    <>
      <div className="wf__bar-head">
        <span className="wf__spark"><Sparkle size={14} fill="currentColor" aria-hidden="true" /></span>
        <span className="wf__heading">{title}</span>
        <span className="wf__task">{task}</span>
        <StatusPill status={live ? "running" : failed ? "failed" : "done"} pulse={live}>
          {live ? "Live" : "Done"}
        </StatusPill>
      </div>
      <StatStrip items={stats} />
    </>
  );
}

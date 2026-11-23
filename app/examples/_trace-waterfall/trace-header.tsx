import { Sparkle } from "lucide-react";
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
  const stats: [string, string, boolean?][] = [
    ["Duration", formatDuration(totals.duration)],
    ["Cost", formatCost(totals.cost)],
    ["Tokens", formatTokens(totals.tokens)],
    ["LLM calls", String(totals.llmCalls)],
    ["Tool calls", String(totals.toolCalls)],
    ["Errors", String(totals.errors), totals.errors > 0],
  ];
  return (
    <>
      <div className="wf__bar-head">
        <span className="wf__spark"><Sparkle size={14} fill="currentColor" aria-hidden="true" /></span>
        <span className="wf__heading">{title}</span>
        <span className="wf__task">{task}</span>
        <span className="wf__pill" data-status={live ? "running" : failed ? "failed" : "done"}>
          {live && <span className="wf__pulse" />}
          {live ? "Live" : "Done"}
        </span>
      </div>
      <dl className="wf__stats">
        {stats.map(([label, value, bad]) => (
          <div key={label} className="wf__stat" data-kind={bad ? "failed" : undefined}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </>
  );
}

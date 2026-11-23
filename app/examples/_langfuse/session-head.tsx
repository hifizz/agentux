import { Layers, TriangleAlert } from "lucide-react";
import { StatStrip, type Stat } from "../_trace-kit/stat-strip";
import { StatusPill } from "../_trace-kit/status-pill";
import { formatCost, formatSpan, formatStart, formatTokens } from "./format";
import type { Session } from "./model";
import { hasIssues, idleOf, type Turn } from "./session-model";
import { TokenBreakdown } from "./token-legend";
import { cachedShare } from "./view-model";

export function sessionStatsOf(session: Session, turns: Turn[]): Stat[] {
  const { tokens, cost, errors, generations, unpriced } = session.totals;
  const share = cachedShare(tokens);
  const idle = idleOf(session);
  const withIssues = turns.filter(hasIssues).length;
  return [
    { label: "Turns", value: String(turns.length) },
    { label: "Duration", value: formatSpan(session.duration), caption: idle >= 1000 ? `${formatSpan(idle)} idle` : undefined },
    { label: "Generations", value: String(generations) },
    tokens
      ? { label: "Tokens", value: formatTokens(tokens.total), caption: share === null ? undefined : `${Math.round(share * 100)}% cached`, footer: <TokenBreakdown tokens={tokens} size="sm" /> }
      : { label: "Tokens", value: "—", muted: true },
    cost === null ? { label: "Cost", value: "—", muted: true, caption: "no pricing" } : { label: "Cost", value: formatCost(cost), caption: unpriced > 0 ? `${unpriced} unpriced` : undefined },
    { label: "Errors", value: String(errors), tone: errors > 0 ? "bad" : undefined, caption: withIssues > 0 ? `in ${withIssues} turn${withIssues > 1 ? "s" : ""}` : undefined },
  ];
}

export type SessionHeadProps = {
  session: Session;
  turns: Turn[];
  jumpLabel: string | null;
  onJump: () => void;
};

export function SessionHead({ session, turns, jumpLabel, onJump }: SessionHeadProps) {
  const failed = turns.filter((turn) => turn.state === "failed").length;
  const running = turns.some((turn) => turn.state === "running");
  const environment = session.traces.find((trace) => trace.environment)?.environment;
  return (
    <>
      <header className="sv-head">
        <span className="sv-icon"><Layers size={14} aria-hidden="true" /></span>
        <b>Session</b>
        <code className="sv-id" title={session.id ?? undefined}>{session.id ? (session.id.length > 12 ? `${session.id.slice(0, 8)}…` : session.id) : "no id"}</code>
        <span className="sv-meta">{[environment, formatStart(session.startedAt)].filter(Boolean).join(" · ")}</span>
        {jumpLabel && (
          <button type="button" className="sv-jump" onClick={onJump}>
            <TriangleAlert size={12} aria-hidden="true" />
            {jumpLabel}
          </button>
        )}
        <StatusPill status={running ? "running" : failed ? "failed" : "done"} pulse={running} style={{ marginLeft: "auto" }}>
          {running ? "Live" : failed ? `${failed} failed` : "Done"}
        </StatusPill>
      </header>
      <StatStrip items={sessionStatsOf(session, turns)} />
    </>
  );
}

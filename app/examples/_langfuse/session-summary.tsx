import { formatCost, formatDuration, formatTokens } from "./format";
import type { Session } from "./model";
import { failuresOf, slowestOf, type Turn, type TurnNode } from "./session-model";
import { TokenBreakdown, TokenLegend } from "./token-legend";

export type SessionSummaryProps = {
  session: Session;
  turns: Turn[];
  onPick: (turn: Turn, nodeId: string) => void;
};

const MAX_FAILURES = 8;

function Pick({ item, onPick, children }: { item: TurnNode; onPick: SessionSummaryProps["onPick"]; children: React.ReactNode }) {
  return (
    <li>
      <button type="button" className="tv-pick" onClick={() => onPick(item.turn, item.node.id)}>
        <span className="sv-ref">
          <b>{item.turn.index + 1}</b>
          {item.node.name}
        </span>
        <em>{children}</em>
      </button>
    </li>
  );
}

export function SessionSummary({ session, turns, onPick }: SessionSummaryProps) {
  const { tokens, cost, unpriced } = session.totals;
  const failures = failuresOf(turns);
  const longest = slowestOf(turns);
  const generations = turns.flatMap((turn) => turn.trace.nodes).filter((node) => node.kind === "generation");
  const models = [...new Set(generations.flatMap((node) => (node.model ? [node.model] : [])))].map((model) => [model, generations.filter((node) => node.model === model).length] as const);

  return (
    <div className="tv-detail">
      <p className="tv-empty">Select a step in any turn for its details.</p>
      <div className="tv-detail-body">
        {tokens && (
          <div className="tv-sec">
            <span className="tv-label">Tokens · {formatTokens(tokens.total)}</span>
            <TokenBreakdown tokens={tokens} />
            <TokenLegend tokens={tokens} />
          </div>
        )}
        <div className="tv-cost">
          <span>Cost</span>
          {cost === null ? <span className="tv-none">— no pricing for these models</span> : <b>{formatCost(cost)}{unpriced > 0 ? ` · ${unpriced} unpriced` : ""}</b>}
        </div>
        {models.length > 0 && (
          <div className="tv-sec">
            <span className="tv-label">Models</span>
            <ul className="tv-list">
              {models.map(([model, count]) => (
                <li key={model}>
                  <span>{model}</span>
                  <em>{count} call{count > 1 ? "s" : ""}</em>
                </li>
              ))}
            </ul>
          </div>
        )}
        {failures.length > 0 && (
          <div className="tv-sec">
            <span className="tv-label">Failures · {failures.length}</span>
            <ul className="tv-list">
              {failures.slice(0, MAX_FAILURES).map((item) => (
                <Pick key={item.node.id} item={item} onPick={onPick}>{item.node.statusMessage ?? "Error"}</Pick>
              ))}
            </ul>
            {failures.length > MAX_FAILURES && <span className="tv-none">and {failures.length - MAX_FAILURES} more</span>}
          </div>
        )}
        {longest.length > 0 && (
          <div className="tv-sec">
            <span className="tv-label">Slowest steps</span>
            <ul className="tv-list">
              {longest.map((item) => (
                <Pick key={item.node.id} item={item} onPick={onPick}>{formatDuration(item.node.duration)}</Pick>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

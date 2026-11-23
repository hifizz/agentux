import { formatCost, formatDuration, formatTokens } from "./format";
import type { Trace, TraceNode } from "./model";
import { TokenBreakdown, TokenLegend } from "./token-legend";
import { failureOrigins, slowest } from "./view-model";

export type TraceSummaryProps = { trace: Trace; onSelect: (id: string) => void };

function Pick({ node, onSelect, children }: { node: TraceNode; onSelect: (id: string) => void; children: React.ReactNode }) {
  return (
    <li>
      <button type="button" className="tv-pick" onClick={() => onSelect(node.id)}>
        <span>{node.name}</span>
        <em>{children}</em>
      </button>
    </li>
  );
}

export function TraceSummary({ trace, onSelect }: TraceSummaryProps) {
  const { tokens, cost, models } = trace.totals;
  const failures = failureOrigins(trace);
  const generations = trace.nodes.filter((node) => node.kind === "generation");
  const counts = models.map((model) => [model, generations.filter((node) => node.model === model).length] as const);
  const longest = slowest(trace);

  return (
    <div className="tv-detail">
      <p className="tv-empty">Select a step for its details.</p>
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
        {cost === null ? <span className="tv-none">— no pricing for these models</span> : <b>{formatCost(cost)}</b>}
      </div>
      {counts.length > 0 && (
        <div className="tv-sec">
          <span className="tv-label">Models</span>
          <ul className="tv-list">
            {counts.map(([model, count]) => (
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
          <span className="tv-label">Failures</span>
          <ul className="tv-list">
            {failures.map((node) => (
              <Pick key={node.id} node={node} onSelect={onSelect}>{node.statusMessage ?? "Error"}</Pick>
            ))}
          </ul>
        </div>
      )}
      {longest.length > 0 && (
        <div className="tv-sec">
          <span className="tv-label">Slowest steps</span>
          <ul className="tv-list">
            {longest.map((node) => (
              <Pick key={node.id} node={node} onSelect={onSelect}>{formatDuration(node.duration)}</Pick>
            ))}
          </ul>
        </div>
      )}
      </div>
    </div>
  );
}

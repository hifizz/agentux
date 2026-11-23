import { StackBar, type StackSegment } from "../_trace-kit/stack-bar";
import { formatTokens } from "./format";
import type { Tokens } from "./model";

const COLORS = {
  input: "var(--tk-accent)",
  cached: "color-mix(in srgb, var(--tk-accent) 26%, transparent)",
  output: "var(--tk-llm-mark)",
  other: "var(--tk-agent-mark)",
};

function rows(tokens: Tokens) {
  const other = Math.max(0, tokens.total - tokens.input - tokens.output - (tokens.cached ?? 0));
  return [
    { key: "input", label: "New input", value: tokens.input },
    { key: "cached", label: "Cached", value: tokens.cached ?? 0 },
    { key: "output", label: "Output", value: tokens.output },
    { key: "other", label: "Other", value: other },
  ] as const;
}

export const tokenSegments = (tokens: Tokens): StackSegment[] => rows(tokens).map((row) => ({ value: row.value, color: COLORS[row.key] }));

export function TokenBreakdown({ tokens, size = "md" }: { tokens: Tokens; size?: "sm" | "md" }) {
  const label = rows(tokens).filter((row) => row.value > 0).map((row) => `${row.label} ${formatTokens(row.value)}`).join(", ");
  return <StackBar segments={tokenSegments(tokens)} size={size} label={label} />;
}

export function TokenLegend({ tokens }: { tokens: Tokens }) {
  return (
    <ul className="tv-legend">
      {rows(tokens).filter((row) => row.value > 0 || row.key === "input").map((row) => (
        <li key={row.key}>
          <i style={{ background: COLORS[row.key] }} />
          {row.label}
          <b>{formatTokens(row.value)}</b>
          <em>{tokens.total > 0 ? `${Math.round((row.value / tokens.total) * 100)}%` : ""}</em>
        </li>
      ))}
    </ul>
  );
}

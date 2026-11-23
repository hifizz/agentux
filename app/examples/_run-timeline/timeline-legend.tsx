import type { BarKind } from "./types";

const ITEMS: [BarKind, string][] = [["llm", "Thinking"], ["tool", "Tool call"], ["agent", "Sub-agent"], ["error", "Failed"]];

export function TimelineLegend() {
  return (
    <span className="rt-legend" aria-hidden="true">
      {ITEMS.map(([kind, label]) => (
        <span key={kind} data-kind={kind}>{label}</span>
      ))}
    </span>
  );
}

import { formatSeconds } from "./format";
import { StepTile } from "./step-tile";
import type { StepView } from "./types";

const KIND_LABEL = { llm: "Thinking", tool: "Tool call", agent: "Sub-agent" };

export type TimelineRowProps = {
  view: StepView;
  range: number;
  open: boolean;
  onSelect: () => void;
};

export function TimelineRow({ view, range, open, onSelect }: TimelineRowProps) {
  const { step, status } = view;
  const tag = status === "failed" ? "failed" : formatSeconds(view.status === "running" ? view.elapsed : step.duration);
  const left = (step.start / range) * 100;
  const width = (view.elapsed / range) * 100;
  const label = [`${step.label} – ${KIND_LABEL[step.kind]}`, step.tool, status === "running" ? "running" : tag].filter(Boolean).join(", ");

  return (
    <li className="rt-row rt-row--step" data-depth={view.depth > 0 ? view.depth : undefined} data-open={open ? "" : undefined}>
      <button type="button" className="rt-row__main" aria-label={label} aria-pressed={open} onClick={onSelect}>
        <span className="rt-row__label">
          <StepTile view={view} />
          <span className="rt-row__name" dir="auto" title={step.label}>{step.label}</span>
        </span>
        <span className="rt-row__track">
          <span className="rt-bar" data-kind={view.bar} data-running={status === "running" ? "" : undefined} style={{ left: `${left}%`, width: `max(3px, ${width}%)` }} />
          <span className="rt-tag" data-kind={view.bar} style={{ left: `calc(${left + width}% + 4px)` }}>{tag}</span>
        </span>
      </button>
    </li>
  );
}

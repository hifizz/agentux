"use client";

import { useMemo, useState } from "react";
import { endOf, ticksFor, viewAt } from "./timeline-model";
import { TimelineAxis, TimelineLines } from "./timeline-axis";
import { TimelineLegend } from "./timeline-legend";
import { TimelineRow } from "./timeline-row";
import type { Step } from "./types";
import "./run-timeline.css";

export type RunTimelineProps = {
  steps: Step[];
  now: number;
  range: number;
  selectedId?: string | null;
  onSelect?: (id: string | null) => void;
  label?: string;
  className?: string;
};

export function RunTimeline({ steps, now, range, selectedId, onSelect, label = "Steps", className }: RunTimelineProps) {
  const [inner, setInner] = useState<string | null>(null);
  const selected = selectedId === undefined ? inner : selectedId;
  const views = useMemo(() => viewAt(steps, now), [steps, now]);
  const ticks = useMemo(() => ticksFor(range), [range]);
  const running = now < endOf(steps);

  const select = (id: string) => {
    const next = selected === id ? null : id;
    setInner(next);
    onSelect?.(next);
  };

  return (
    <section className={className ? `rt ${className}` : "rt"} aria-label={label}>
      <div className="rt-top"><TimelineLegend /></div>
      <div className="rt-grid">
        <TimelineAxis ticks={ticks} range={range} />
        <ul className="rt-rows">
          <TimelineLines ticks={ticks} range={range} now={running && views.length > 0 ? now : null} />
          {views.map((view) => (
            <TimelineRow key={view.step.id} view={view} range={range} open={selected === view.step.id} onSelect={() => select(view.step.id)} />
          ))}
        </ul>
      </div>
    </section>
  );
}

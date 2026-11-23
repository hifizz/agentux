"use client";

import Stage from "@/components/examples/Stage";
import { RunTimeline } from "../_run-timeline/run-timeline";
import { RANGE, STEPS } from "../_run-timeline/script";
import { endOf } from "../_run-timeline/timeline-model";
import { useRunClock } from "../_run-timeline/use-run-clock";

const END = endOf(STEPS);

export default function Demo() {
  const { now, replay } = useRunClock({ end: END });
  return (
    <Stage wide status="Steps arrive as the run goes. Click a step to select it." onReplay={replay}>
      <div className="mx-auto w-full max-w-4xl rounded-2xl bg-card p-4 shadow-sm">
        <RunTimeline steps={STEPS} now={now} range={RANGE} />
      </div>
    </Stage>
  );
}

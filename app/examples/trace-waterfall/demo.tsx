"use client";

import Stage from "@/components/examples/Stage";
import { DEFAULT_FOLDED, SPANS, TASK } from "../_trace-waterfall/script";
import { TraceWaterfall } from "../_trace-waterfall/trace-waterfall";
import { useTraceClock } from "../_trace-waterfall/use-trace-clock";

const TOTAL = Math.max(...SPANS.map((span) => span.start + span.duration));

export default function Demo() {
  const { now, replay } = useTraceClock({ total: TOTAL });
  return (
    <Stage wide status="Click a row for its details. Use the arrows to fold a branch." onReplay={replay}>
      <div className="mx-auto w-full max-w-3xl">
        <TraceWaterfall spans={SPANS} now={now} task={TASK} defaultFolded={DEFAULT_FOLDED} />
      </div>
    </Stage>
  );
}

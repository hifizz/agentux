import { formatTick } from "./format";
import type { Axis } from "../_trace-kit/axis";

export function TraceLayer({ axis, now }: { axis: Axis; now: number }) {
  return (
    <div className="wf__layer" aria-hidden="true">
      {axis.ticks.map((tick) => (
        <span key={`${axis.range}-${tick}`} className="wf__tick" data-zero={tick === 0 ? "" : undefined} style={{ "--v": tick } as React.CSSProperties}>
          <span>{formatTick(tick)}</span>
        </span>
      ))}
      <span className="wf__now" style={{ "--wf-at": now } as React.CSSProperties} />
    </div>
  );
}

export function TraceAxisHead() {
  return (
    <div className="wf__axis" aria-hidden="true">
      <span>Span</span>
    </div>
  );
}

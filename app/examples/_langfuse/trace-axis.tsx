import { percent, type Axis } from "../_trace-kit/axis";
import { formatTick } from "./format";

export function AxisHead({ axis }: { axis: Axis }) {
  return (
    <div className="tv-axis" aria-hidden="true">
      <span>Step</span>
      <span className="tv-axis-track">
        {axis.ticks.map((tick) => (
          <span key={tick} className="tv-tick" data-first={tick === 0 ? "" : undefined} style={{ left: `${percent(tick, axis.range)}%` }}>
            {formatTick(tick)}
          </span>
        ))}
      </span>
    </div>
  );
}

export function GridLayer({ axis }: { axis: Axis }) {
  return (
    <div className="tv-layer" aria-hidden="true">
      {axis.ticks.map((tick) => (
        <i key={tick} style={{ left: `${percent(tick, axis.range)}%` }} />
      ))}
    </div>
  );
}

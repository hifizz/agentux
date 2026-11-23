import type { CSSProperties } from "react";
import { formatTick } from "./format";

export function TimelineAxis({ ticks, range }: { ticks: number[]; range: number }) {
  return (
    <div className="rt-axis" aria-hidden="true">
      <span />
      <span className="rt-axis__track">
        {ticks.map((tick, i) => (
          <span
            key={tick}
            className="rt-axis__tick"
            data-first={i === 0 ? "" : undefined}
            data-last={i === ticks.length - 1 ? "" : undefined}
            data-odd={i % 2 === 1 ? "" : undefined}
            style={{ left: `${(tick / range) * 100}%` } as CSSProperties}
          >
            {formatTick(tick)}
          </span>
        ))}
      </span>
    </div>
  );
}

export function TimelineLines({ ticks, range, now }: { ticks: number[]; range: number; now: number | null }) {
  return (
    <li className="rt-lines" aria-hidden="true">
      <span />
      <span className="rt-lines__track">
        {ticks.map((tick) => (
          <i key={tick} style={{ left: `${(tick / range) * 100}%` }} />
        ))}
        {now !== null && <b className="rt-now" style={{ left: `${(now / range) * 100}%` }} />}
      </span>
    </li>
  );
}

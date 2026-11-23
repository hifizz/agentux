import { formatDuration, formatSpan } from "./format";
import type { StripItem, Turn } from "./session-model";

const LABEL = { running: "running", failed: "failed", partial: "some steps failed", ok: "ok" };

export type SessionStripProps = {
  items: StripItem[];
  open: ReadonlySet<string>;
  onPick: (turn: Turn) => void;
};

export function SessionStrip({ items, open, onPick }: SessionStripProps) {
  return (
    <div className="sv-strip" role="group" aria-label="Turns, in time order">
      {items.map((item, i) =>
        item.type === "gap" ? (
          <span key={i} className="sv-gap" data-long={item.long ? "" : undefined} title={item.long ? `${formatSpan(item.ms)} later` : undefined}>
            {item.long && <em>{formatSpan(item.ms)}</em>}
          </span>
        ) : (
          <button
            key={i}
            type="button"
            className="sv-block"
            data-state={item.turn.state}
            data-open={open.has(item.turn.trace.id) ? "" : undefined}
            style={{ flexGrow: item.weight }}
            aria-label={`Turn ${item.turn.index + 1}, ${item.turn.trace.name}, ${formatDuration(item.turn.trace.duration)}, ${LABEL[item.turn.state]}`}
            title={`#${item.turn.index + 1} ${item.turn.trace.name} · ${formatDuration(item.turn.trace.duration)}`}
            onClick={() => onPick(item.turn)}
          >
            <span className="sv-num">{item.turn.index + 1}</span>
          </button>
        ),
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { Asterisk } from "lucide-react";
import { formatTokens } from "./format";
import { useTween } from "./use-ticker";
import type { ContextState } from "./types";

const COLS = 30;
const ROWS = 4;
const CELLS = COLS * ROWS;

function allocate(context: ContextState) {
  const cells: (string | null)[] = [];
  let used = 0;
  for (const segment of context.segments) {
    used += segment.tokens;
    const target = Math.min(CELLS, Math.max(cells.length + (segment.tokens > 0 ? 1 : 0), Math.round((used / context.window) * CELLS)));
    while (cells.length < target) cells.push(segment.id);
  }
  while (cells.length < CELLS) cells.push(null);
  return cells;
}

export function ContextWindow({ context, title = "Shared context" }: { context: ContextState; title?: string }) {
  const [hot, setHot] = useState<string | null>(null);
  const total = context.segments.reduce((sum, segment) => sum + segment.tokens, 0);
  const shown = useTween(total);
  const percent = Math.round((total / context.window) * 100);
  const level = percent >= 95 ? "full" : percent >= 80 ? "warn" : "ok";
  const cells = allocate(context);
  const colors = Object.fromEntries(context.segments.map((segment) => [segment.id, segment.color]));
  const frontier = cells.findIndex((cell) => cell === null);
  const busyFrom = (frontier === -1 ? CELLS : frontier) - 6;

  return (
    <section className="ls-ctx" data-level={level} aria-label={title}>
      <div className="ls-ctx__card">
        <div className="ls-ctx__head">
          <span className="ls-ctx__title">{title}</span>
          <span className="ls-ctx__model">
            <Asterisk size={12} aria-hidden="true" style={{ color: "#d97757" }} />
            <span>{context.model}</span>
          </span>
        </div>
        <div className="ls-ctx__figure">
          <span className="ls-ctx__big" aria-hidden="true">{formatTokens(shown.value)}</span>
          <span className="ls-ctx__of" aria-hidden="true">of {formatTokens(context.window).replace(".0", "")} tokens</span>
          <span className="ls-ctx__pill" aria-hidden="true">{percent}%</span>
          <span className="ls-sr">{formatTokens(total)} of {formatTokens(context.window)} tokens used, {percent} percent</span>
        </div>
        <div className="ls-ctx__field" aria-hidden="true" data-hot={hot ? "" : undefined} style={{ "--ls-cols": COLS } as React.CSSProperties}>
          {cells.map((cell, i) => (
            <span
              key={i}
              className="ls-cell"
              data-free={cell === null ? "" : undefined}
              data-on={cell !== null && cell === hot ? "" : undefined}
              data-busy={shown.moving && i >= busyFrom && cell !== null ? "" : undefined}
              style={{ "--i": i, "--ls-cell": cell ? colors[cell] : undefined } as React.CSSProperties}
            />
          ))}
        </div>
        <ul className="ls-ctx__parts" onMouseLeave={() => setHot(null)}>
          {context.segments.map((segment) => (
            <li key={segment.id} className="ls-part" onMouseEnter={() => setHot(segment.id)}>
              <div className="ls-part__row">
                <span className="ls-swatch" style={{ background: segment.color }} />
                <span className="ls-part__label">{segment.label}</span>
                <span className="ls-tnum ls-part__value">{formatTokens(segment.tokens)}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="ls-ctx__foot">
        <span className="ls-ctx__caption ls-tnum">{formatTokens(Math.max(0, context.window - total))} free</span>
      </div>
    </section>
  );
}

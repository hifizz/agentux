"use client";

import { PART_NAMES, PART_NOTES, formatK, partsOf } from "./context-model";
import { useFocus } from "./context-focus";
import { Rolled } from "./context-stats";
import type { ContextLook, PartKind, Prompt, PromptItem } from "./types";

const LOOK_MAP = (
  <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
    <rect x="1.5" y="2" width="5.5" height="12" rx="1.6" /><rect x="8.5" y="2" width="6" height="6.5" rx="1.6" /><rect x="8.5" y="10" width="6" height="4" rx="1.4" />
  </svg>
);
const LOOK_GRID = (
  <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
    {[2, 6.5, 11].flatMap((y) => [2, 6.5, 11].map((x) => <rect key={`${x}-${y}`} x={x} y={y} width="3" height="3" rx=".8" />))}
  </svg>
);

type LegendProps = {
  prompt: Prompt;
  look: ContextLook;
  onLook: (look: ContextLook) => void;
  onSelectItem?: (part: PartKind, item?: PromptItem) => void;
};

export function ContextLegend({ prompt, look, onLook, onSelectItem }: LegendProps) {
  const { setFocus } = useFocus();
  const window = prompt.window ?? 0;
  return (
    <div className="ctx-legend">
      {partsOf(prompt).map((part) => {
        const props = onSelectItem
          ? { role: "button", tabIndex: 0, onClick: () => onSelectItem(part.kind), onKeyDown: (e: React.KeyboardEvent) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelectItem(part.kind); } } }
          : {};
        return (
          <span key={part.kind} className={`ctx-leg${onSelectItem ? " ctx-click" : ""}`} title={PART_NOTES[part.kind]} onPointerEnter={() => setFocus({ f: part.kind })} onPointerLeave={() => setFocus(null)} {...props}>
            <i className={`dot k-${part.kind}`} />
            <span className="n">{PART_NAMES[part.kind]}</span>
            <Rolled value={part.tokens} />
          </span>
        );
      })}
      {window > prompt.tokens && (
        <span className="ctx-leg" onPointerEnter={() => setFocus({ f: "free" })} onPointerLeave={() => setFocus(null)}>
          <i className="dot free" /><span className="n">Free space</span><Rolled value={window - prompt.tokens} />
        </span>
      )}
      <span className="ctx-look" role="group">
        {([["map", "Context map", LOOK_MAP], ["grid", "Block grid", LOOK_GRID]] as const).map(([id, name, icon]) => (
          <button key={id} type="button" className={`ctx-look-b${look === id ? " on" : ""}`} title={name} aria-label={name} aria-pressed={look === id} onClick={() => onLook(id)}>{icon}</button>
        ))}
      </span>
    </div>
  );
}

export function ContextPartRows({ prompt }: { prompt: Prompt }) {
  const { setFocus } = useFocus();
  return (
    <div className="ctx-rows">
      {partsOf(prompt).map((part) => (
        <div key={part.kind} className="ctx-row" onPointerEnter={() => setFocus({ f: part.kind })} onPointerLeave={() => setFocus(null)}>
          <i className={`dot k-${part.kind}`} />
          <span className="ctx-name"><b>{PART_NAMES[part.kind]}</b></span>
          <span className="ctx-v">{formatK(part.tokens)}</span>
        </div>
      ))}
    </div>
  );
}

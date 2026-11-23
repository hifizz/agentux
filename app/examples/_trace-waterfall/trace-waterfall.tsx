"use client";

import { useMemo, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { SpanPopover, type SpanPopoverProps } from "./span-popover";
import { TraceAxisHead, TraceLayer } from "./trace-axis";
import { TraceHeader } from "./trace-header";
import { buildTree, viewAt } from "./trace-model";
import { TraceRow } from "./trace-row";
import type { Span } from "./types";
import "./trace-waterfall.css";

export type TraceWaterfallProps = {
  spans: Span[];
  now: number;
  title?: string;
  task: string;
  defaultFolded?: ReadonlySet<string>;
  className?: string;
};

type Selected = { id: string; position: SpanPopoverProps["position"] };

const NO_FOLDS: ReadonlySet<string> = new Set();
const POP_WIDTH = 320;
const POP_GUESS = 190;

export function TraceWaterfall({ spans, now, title = "Trace", task, defaultFolded = NO_FOLDS, className }: TraceWaterfallProps) {
  const tree = useMemo(() => buildTree(spans), [spans]);
  const view = useMemo(() => viewAt(tree, now), [tree, now]);
  const [folds, setFolds] = useState<Record<string, boolean>>({});
  const [selected, setSelected] = useState<Selected | null>(null);
  const [focusId, setFocusId] = useState<string | null>(null);
  const rowRefs = useRef(new Map<string, HTMLDivElement>());
  const rowsRef = useRef<HTMLDivElement>(null);

  const parentOf = useMemo(() => new Map(spans.map((span) => [span.id, span.parentId])), [spans]);
  const isFolded = (id: string) => folds[id] ?? defaultFolded.has(id);
  const isHidden = (id: string) => {
    for (let parent = parentOf.get(id); parent; parent = parentOf.get(parent)) if (isFolded(parent)) return true;
    return false;
  };

  const visible = view.rows.filter((row) => !isHidden(row.span.id));
  const roving = visible.find((row) => row.span.id === focusId)?.span.id ?? visible[0]?.span.id;
  const selectedRow = selected ? view.rows.find((row) => row.span.id === selected.id) : undefined;

  const toggle = (id: string) => setFolds((current) => ({ ...current, [id]: !(current[id] ?? defaultFolded.has(id)) }));

  const select = (id: string) => {
    if (selected?.id === id) return setSelected(null);
    const row = rowRefs.current.get(id);
    const rows = rowsRef.current;
    if (!row || !rows) return;
    const track = row.querySelector<HTMLElement>(".wf__track");
    const wide = (track?.offsetLeft ?? 0) > 24;
    const width = Math.min(POP_WIDTH, rows.clientWidth - 16);
    const left = Math.max(8, Math.min((wide ? track!.offsetLeft : 12) + row.offsetLeft, rows.clientWidth - width - 8));
    const below = row.offsetTop + row.offsetHeight + POP_GUESS < rows.clientHeight + 40;
    setSelected({
      id,
      position: below ? { left, top: row.offsetTop + row.offsetHeight + 4, side: "below" } : { left, bottom: rows.clientHeight - row.offsetTop + 4, side: "above" },
    });
  };

  const focusRow = (id: string | undefined) => {
    if (!id) return;
    setFocusId(id);
    rowRefs.current.get(id)?.focus();
  };

  const onKeyDown = (id: string, parent: boolean) => (event: KeyboardEvent<HTMLDivElement>) => {
    const index = visible.findIndex((row) => row.span.id === id);
    const key = event.key;
    if (key === "ArrowDown") focusRow(visible[index + 1]?.span.id);
    else if (key === "ArrowUp") focusRow(visible[index - 1]?.span.id);
    else if (key === "Home") focusRow(visible[0]?.span.id);
    else if (key === "End") focusRow(visible.at(-1)?.span.id);
    else if (key === "ArrowRight" && parent) {
      if (isFolded(id)) toggle(id);
      else focusRow(visible[index + 1]?.span.id);
    } else if (key === "ArrowLeft") {
      if (parent && !isFolded(id)) toggle(id);
      else focusRow(visible.find((row) => row.span.id === parentOf.get(id))?.span.id);
    } else if (key === "Enter" || key === " ") select(id);
    else return;
    event.preventDefault();
  };

  return (
    <section className={className ? `wf ${className}` : "wf"} aria-label="Trace waterfall" data-live={view.done ? undefined : ""}>
      <TraceHeader title={title} task={task} live={!view.done} totals={view.totals} />
      <div className="wf__body" style={{ "--wf-range": view.axis.range } as CSSProperties}>
        <TraceLayer axis={view.axis} now={view.now} />
        <TraceAxisHead />
        <div ref={rowsRef} className="wf__rows" role="tree" aria-label="Trace">
          {view.rows.map((row, index) => {
            const id = row.span.id;
            const parent = row.span.kind === "agent" || row.span.kind === "subagent";
            return (
              <TraceRow
                key={id}
                view={row}
                index={index}
                hidden={isHidden(id)}
                folded={isFolded(id)}
                open={selected?.id === id}
                focusable={roving === id}
                rowRef={(el) => {
                  if (el) rowRefs.current.set(id, el);
                  else rowRefs.current.delete(id);
                }}
                onSelect={() => select(id)}
                onToggle={() => toggle(id)}
                onKeyDown={onKeyDown(id, parent)}
              />
            );
          })}
          {selected && selectedRow && <SpanPopover key={selected.id} view={selectedRow} position={selected.position} onClose={() => setSelected(null)} />}
        </div>
      </div>
    </section>
  );
}

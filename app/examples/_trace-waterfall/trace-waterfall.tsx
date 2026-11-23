"use client";

import { useMemo, useRef, useState, type CSSProperties } from "react";
import type { CardPosition } from "../_trace-kit/floating-card";
import { useTreeNav } from "../_trace-kit/use-tree-nav";
import { SpanPopover } from "./span-popover";
import { TraceAxisHead, TraceLayer } from "./trace-axis";
import { TraceHeader } from "./trace-header";
import { buildTree, viewAt } from "./trace-model";
import { TraceRow } from "./trace-row";
import type { Span } from "./types";
import "../_trace-kit/trace-kit.css";
import "./trace-waterfall.css";

export type TraceWaterfallProps = {
  spans: Span[];
  now: number;
  title?: string;
  task: string;
  defaultFolded?: ReadonlySet<string>;
  className?: string;
};

type Selected = { id: string; position: CardPosition };

const POP_WIDTH = 320;
const POP_GUESS = 190;

const isParent = (span: Span) => span.kind === "agent" || span.kind === "subagent";

export function TraceWaterfall({ spans, now, title = "Trace", task, defaultFolded, className }: TraceWaterfallProps) {
  const tree = useMemo(() => buildTree(spans), [spans]);
  const view = useMemo(() => viewAt(tree, now), [tree, now]);
  const [selected, setSelected] = useState<Selected | null>(null);
  const rowsRef = useRef<HTMLDivElement>(null);

  const nav = useTreeNav({ nodes: view.rows.map((row) => ({ id: row.span.id, parentId: row.span.parentId, expandable: isParent(row.span) })), defaultFolded });
  const selectedRow = selected ? view.rows.find((row) => row.span.id === selected.id) : undefined;

  const select = (id: string) => {
    if (selected?.id === id) return setSelected(null);
    const row = nav.elements.current.get(id);
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

  return (
    <section className={className ? `tk wf ${className}` : "tk wf"} aria-label="Trace waterfall" data-live={view.done ? undefined : ""}>
      <TraceHeader title={title} task={task} live={!view.done} totals={view.totals} />
      <div className="wf__body" style={{ "--wf-range": view.axis.range } as CSSProperties}>
        <TraceLayer axis={view.axis} now={view.now} />
        <TraceAxisHead />
        <div ref={rowsRef} className="wf__rows" role="tree" aria-label="Trace">
          {view.rows.map((row, index) => {
            const id = row.span.id;
            return (
              <TraceRow
                key={id}
                view={row}
                range={view.axis.range}
                index={index}
                hidden={nav.isHidden(id)}
                folded={nav.isFolded(id)}
                open={selected?.id === id}
                focusable={nav.rovingId === id}
                rowRef={(element) => nav.register(id, element)}
                onSelect={() => select(id)}
                onToggle={() => nav.toggle(id)}
                onKeyDown={(event) => {
                  if (nav.handleKey(event, id)) return;
                  if (event.key !== "Enter" && event.key !== " ") return;
                  event.preventDefault();
                  select(id);
                }}
              />
            );
          })}
          {selected && selectedRow && <SpanPopover key={selected.id} view={selectedRow} position={selected.position} onClose={() => setSelected(null)} />}
        </div>
      </div>
    </section>
  );
}

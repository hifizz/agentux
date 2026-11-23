"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { PART_NAMES, cellsOf, formatK, itemName, partOf, pct, sortedItems, tileLabel, tilesOf } from "./context-model";
import { useFocus } from "./context-focus";
import type { Cell, ContextLook, PartKind, Prompt, PromptItem, Tile } from "./types";
import { Rolled } from "./context-stats";

type Tip = { cell: number } | { tile: Tile };

const gridLabel = (prompt: Prompt, window: number) => `${formatK(prompt.tokens)} of ${formatK(window || prompt.tokens)} tokens used`;

function TipBody({ tip, prompt, window, cells }: { tip: Tip; prompt: Prompt; window: number; cells: Cell[] }) {
  const free = formatK(Math.max(0, window - prompt.tokens));
  if ("cell" in tip) {
    const cell = cells[tip.cell];
    if (!cell) return <div className="ctx-tip-head"><i className="dot free" /><b>Free space</b><span className="grow" /><span>{free}</span></div>;
    const part = partOf(prompt, cell.kind)!;
    const items = sortedItems(part);
    const shown = items.slice(0, 4);
    const here = items[cell.item];
    if (here && !shown.includes(here)) shown[3] = here;
    return (
      <>
        <div className="ctx-tip-head">
          <i className={`dot k-${cell.kind}`} /><b>{PART_NAMES[cell.kind]}</b><span className="grow" />
          <span>{formatK(part.tokens)} · {pct(part.tokens / Math.max(1, prompt.tokens))}</span>
        </div>
        {shown.map((item) => (
          <div key={item.name + (item.tag ?? "")} className={`ctx-tip-row${item === here ? " on" : ""}`}>
            <span className="n">{itemName(item)}</span><span className="v">{formatK(item.tokens)}</span>
          </div>
        ))}
        {items.length > shown.length && <div className="ctx-tip-more">{items.length - shown.length} more</div>}
      </>
    );
  }
  const { tile } = tip;
  if (tile.free) return <div className="ctx-tip-head"><i className="dot free" /><b>Free space</b><span className="grow" /><span>{free}</span></div>;
  const kind = tile.kind as PartKind;
  if (tile.it) {
    return (
      <>
        <div className="ctx-tip-head"><i className={`dot k-${kind}`} /><b>{itemName(tile.it)}</b></div>
        <div className="ctx-tip-sub">{PART_NAMES[kind]} · {formatK(tile.it.tokens)} tokens · {pct(tile.it.tokens / Math.max(1, prompt.tokens))}</div>
      </>
    );
  }
  const its = tile.its ?? [];
  return (
    <>
      <div className="ctx-tip-head">
        <i className={`dot k-${kind}`} /><b>{PART_NAMES[kind]}</b><span className="grow" />
        <span>{formatK(tile.tokens)} · {pct(tile.tokens / Math.max(1, prompt.tokens))}</span>
      </div>
      {its.slice(0, 5).map((item) => (
        <div key={item.name + (item.tag ?? "")} className="ctx-tip-row"><span className="n">{itemName(item)}</span><span className="v">{formatK(item.tokens)}</span></div>
      ))}
      {its.length > 5 && <div className="ctx-tip-more">{its.length - 5} more</div>}
    </>
  );
}

type VizProps = {
  prompt: Prompt;
  look: ContextLook;
  onSelectItem?: (part: PartKind, item?: PromptItem) => void;
};

export function ContextViz({ prompt, look, onSelectItem }: VizProps) {
  const window = prompt.window ?? 0;
  const { focus, setFocus } = useFocus();
  const cells = useMemo(() => cellsOf(prompt, window), [prompt, window]);
  const [tip, setTip] = useState<{ tip: Tip; target: HTMLElement } | null>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const mapNode = useRef<HTMLDivElement | null>(null);
  const tipNode = useRef<HTMLDivElement | null>(null);
  const tiles = useMemo(() => (size && look === "map" ? tilesOf(prompt, window, size.w, size.h) : []), [prompt, window, size, look]);

  const mapRef = (node: HTMLDivElement | null) => {
    mapNode.current = node;
  };

  useLayoutEffect(() => {
    const node = mapNode.current;
    if (!node) return;
    const measure = () => {
      const w = node.clientWidth;
      const h = node.clientHeight;
      if (w && h) setSize((last) => (last && last.w === w && last.h === h ? last : { w, h }));
    };
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    measure();
    return () => observer.disconnect();
  }, [look]);

  useLayoutEffect(() => {
    const node = tipNode.current;
    const card = node?.closest(".ctx-card");
    if (!tip || !node || !card) return;
    const b = tip.target.getBoundingClientRect();
    const c = card.getBoundingClientRect();
    const left = Math.max(8, Math.min(c.width - node.offsetWidth - 8, b.left - c.left + b.width / 2 - node.offsetWidth / 2));
    let top = b.top - c.top - node.offsetHeight - 8;
    if (top < 4) top = b.bottom - c.top + 8;
    node.style.left = `${left}px`;
    node.style.top = `${top}px`;
  }, [tip]);

  const clear = () => { setTip(null); setFocus(null); };
  const clickable = !!onSelectItem;
  const label = gridLabel(prompt, window);
  const pc = (a: number, b: number) => +((a / b) * 100).toFixed(3);

  return (
    <>
      <div className="ctx-viz" data-look={look}>
        <div
          ref={mapRef}
          className="ctx-map"
          role="img"
          aria-label={label}
          data-f={focus?.f === "tile" ? "tile" : focus?.f === "item" ? "tile" : focus?.f}
          onPointerLeave={clear}
        >
          {size && tiles.map((tile, i) => {
            const cls = `ctx-tile ${tile.free ? "free" : `k-${tile.kind}`}${tile.w < 54 || tile.h < 30 ? " bare" : tile.h < 46 ? " low" : ""}`;
            const on = focus?.f === "tile" && focus.tileKey === tile.key
              || focus?.f === "item" && tile.kind === focus.kind && !!focus.item && !!tile.its?.includes(focus.item);
            const { name, value } = tileLabel(tile, window, prompt);
            return (
              <div
                key={tile.key}
                className={`${cls}${on ? " on" : ""}`}
                style={{
                  left: `calc(${pc(tile.x, size.w)}% + 1.5px)`,
                  top: `calc(${pc(tile.y, size.h)}% + 1.5px)`,
                  width: `max(0px, calc(${pc(tile.w, size.w)}% - 3px))`,
                  height: `max(0px, calc(${pc(tile.h, size.h)}% - 3px))`,
                  animationDelay: `${30 + Math.min(i, 16) * 20}ms`,
                }}
                onPointerEnter={(e) => { setFocus({ f: "tile", tileKey: tile.key }); setTip({ tip: { tile }, target: e.currentTarget }); }}
                onClick={tile.free || !clickable ? undefined : () => onSelectItem?.(tile.kind as PartKind, tile.it)}
              >
                <b className="n">{name}</b>
                <span className="v"><Rolled value={tile.tokens} format={value} /></span>
              </div>
            );
          })}
        </div>
        <div
          className="ctx-waffle"
          role="img"
          aria-label={label}
          data-f={focus && focus.f !== "tile" ? focus.f : undefined}
          onPointerLeave={clear}
        >
          {cells.map((cell, i) => {
            const on = focus?.f === "item" && !!cell && cell.kind === focus.kind && cell.item === focus.index;
            return (
              <i
                key={i}
                className={`${cell ? `k-${cell.kind}` : "free"}${on ? " on" : ""}${cell && clickable ? " ctx-click" : ""}`}
                style={{ "--d": `${Math.round(i * 1.4)}ms` } as React.CSSProperties}
                onPointerEnter={(e) => { setFocus({ f: cell ? cell.kind : "free" }); setTip({ tip: { cell: i }, target: e.currentTarget }); }}
                onClick={cell && clickable ? () => onSelectItem?.(cell.kind, sortedItems(partOf(prompt, cell.kind))[cell.item]) : undefined}
              />
            );
          })}
        </div>
      </div>
      {tip && (
        <div ref={tipNode} className="ctx-tip">
          <TipBody tip={tip.tip} prompt={prompt} window={window} cells={cells} />
        </div>
      )}
    </>
  );
}

export function ContextGrid({ prompt }: { prompt: Prompt }) {
  return <ContextViz prompt={prompt} look="grid" />;
}

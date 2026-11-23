"use client";

import { useMemo, useState } from "react";
import { PART_NAMES, formatK, itemName, partOf, partsOf, tagOf } from "./context-model";
import { useFocus } from "./context-focus";
import type { ContextTab, PartKind, Prompt, PromptItem } from "./types";

type ContentsProps = {
  prompt: Prompt;
  tab: ContextTab;
  onTab: (tab: ContextTab) => void;
  onSelectItem?: (part: PartKind, item?: PromptItem) => void;
};

type Row = { item: PromptItem; index: number; kind: PartKind };

function ItemLabel({ item, kind }: { item: PromptItem; kind: PartKind }) {
  const name = itemName(item);
  const at = name.lastIndexOf("/");
  const split = (kind === "files" || kind === "memory") && at >= 0;
  return (
    <span className="ctx-name" title={name}>
      {split ? <><b>{name.slice(at + 1)}</b><small>{name.slice(0, at + 1)}</small></> : <b>{name}</b>}
    </span>
  );
}

export function ContextContents({ prompt, tab, onTab, onSelectItem }: ContentsProps) {
  const { setFocus } = useFocus();
  const [more, setMore] = useState(false);
  const tabs = useMemo(() => [{ id: "all" as ContextTab, name: "All" }, ...partsOf(prompt).map((part) => ({ id: part.kind as ContextTab, name: PART_NAMES[part.kind] }))], [prompt]);
  const rows = useMemo(() => {
    const kinds = tab === "all" ? prompt.parts.map((part) => part.kind) : [tab];
    const list: Row[] = kinds.flatMap((kind) => (partOf(prompt, kind)?.items ?? []).map((item, index) => ({ item, index, kind })));
    return list.sort((a, b) => b.item.tokens - a.item.tokens);
  }, [prompt, tab]);
  const most = Math.max(1, ...rows.map((row) => row.item.tokens));
  const shown = more ? rows : rows.slice(0, 8);

  return (
    <div className="ctx-contents">
      <div className="ctx-contents-head">
        <span className="ctx-k">Contents</span>
        <span className="grow" />
        <div className="segs">
          {tabs.map((entry) => (
            <button key={entry.id} type="button" className={`opt${entry.id === tab ? " on" : ""}`} aria-pressed={entry.id === tab} onClick={() => { setMore(false); onTab(entry.id); }}>{entry.name}</button>
          ))}
        </div>
      </div>
      <div className="ctx-rows">
        {shown.map(({ item, index, kind }) => {
          const sorted = [...(partOf(prompt, kind)?.items ?? [])].sort((a, b) => b.tokens - a.tokens);
          const tag = tagOf(item);
          const props = onSelectItem
            ? { role: "button", tabIndex: 0, onClick: () => onSelectItem(kind, item), onKeyDown: (e: React.KeyboardEvent) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelectItem(kind, item); } } }
            : {};
          return (
            <div
              key={`${kind}-${index}-${item.name}`}
              className={`ctx-row${onSelectItem ? " ctx-click" : ""}`}
              onPointerEnter={() => setFocus({ f: "item", kind, item, index: sorted.indexOf(item) })}
              onPointerLeave={() => setFocus(null)}
              {...props}
            >
              <i className={`dot k-${kind}`} />
              <ItemLabel item={item} kind={kind} />
              {(item.n ?? 0) > 1 && item.tag !== "turns" && item.tag !== "more" && <span className="ctx-x">×{item.n}</span>}
              {tag && <code className="ctx-tag">{tag}</code>}
              <span className={`ctx-mini k-${kind}`}><i style={{ width: `${Math.max(2, (item.tokens / most) * 100).toFixed(1)}%` }} /></span>
              <span className="ctx-v">{formatK(item.tokens)}</span>
            </div>
          );
        })}
        {!rows.length && <div className="ctx-empty">Nothing in it</div>}
        {rows.length > 8 && <button type="button" className="ctx-more" onClick={() => setMore(!more)}>{more ? "Show fewer" : `Show all ${rows.length}`}</button>}
      </div>
    </div>
  );
}

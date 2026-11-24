"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent, ReactNode } from "react";
import { flatOptions, jumpKey, moveKey, edgeKey, segments, viewGroups, type MenuOption } from "./menu-model";
import { MENU_LABELS, type CommandGroup, type CommandItem, type MenuLabels } from "./types";
import "./command-menu.css";

export type CommandMenuProps = {
  groups: CommandGroup[];
  query?: string;
  onQueryChange?: (q: string) => void;
  active?: string | null;
  onActiveChange?: (key: string) => void;
  onRun?: (item: CommandItem) => void;
  ran?: string | null;
  done?: string | null;
  askIcon?: ReactNode;
  labels?: Partial<MenuLabels>;
  placeholder?: string;
  className?: string;
};

const FLASH_MS = 2200;
const LIST_MAX = 360;

export function CommandMenu({ groups, query: queryProp, onQueryChange, active: activeProp, onActiveChange, onRun, ran: ranProp, done: doneProp, askIcon, labels, placeholder, className }: CommandMenuProps) {
  const L = useMemo(() => ({ ...MENU_LABELS, ...labels }), [labels]);
  const uid = useId();

  const [qLocal, setQLocal] = useState("");
  const [selLocal, setSelLocal] = useState<string | null>(null);
  const [dim, setDim] = useState(false);
  const [ranLocal, setRanLocal] = useState<string | null>(null);
  const [doneLocal, setDoneLocal] = useState<string | null>(null);
  const flash = useRef<number>(0);

  const itemEls = useRef(new Map<string, HTMLElement>());
  const listEl = useRef<HTMLDivElement>(null);
  const innerEl = useRef<HTMLDivElement>(null);
  const pillEl = useRef<HTMLSpanElement>(null);

  const query = queryProp ?? qLocal;
  const q = query.trim();
  const view = useMemo(() => viewGroups(groups, query, L, askIcon), [groups, query, L, askIcon]);
  const flat = useMemo(() => flatOptions(view), [view]);

  const active = activeProp !== undefined ? activeProp : selLocal && flat.some((o) => o.key === selLocal) ? selLocal : (flat[0]?.key ?? null);
  const ran = ranProp !== undefined ? ranProp : ranLocal;
  const done = doneProp !== undefined ? doneProp : doneLocal;
  const lit = flat.length > 1 && active !== null && !dim;

  const [prevActive, setPrevActive] = useState(active);
  if (prevActive !== active) {
    setPrevActive(active);
    setDim(false);
  }

  const setQuery = (next: string) => {
    setSelLocal(null);
    setDim(false);
    if (queryProp === undefined) setQLocal(next);
    onQueryChange?.(next);
  };

  const select = (key: string | null) => {
    if (!key) return;
    setDim(false);
    if (activeProp === undefined) setSelLocal(key);
    onActiveChange?.(key);
  };

  const run = (opt: MenuOption, viaPointer: boolean) => {
    select(opt.key);
    if (viaPointer) setDim(true);
    onRun?.(opt.item);
    if (ranProp === undefined) {
      setRanLocal(opt.key);
      setDoneLocal(opt.item.done ?? opt.item.name);
      window.clearTimeout(flash.current);
      flash.current = window.setTimeout(() => {
        setRanLocal(null);
        setDoneLocal(null);
      }, FLASH_MS);
    }
  };

  useEffect(() => () => window.clearTimeout(flash.current), []);

  const scrollKey = (key: string | null) => {
    const list = listEl.current;
    const el = key ? itemEls.current.get(key) : null;
    if (!list || !el) return;
    const top = el.offsetTop;
    const bottom = top + el.offsetHeight;
    if (top < list.scrollTop) list.scrollTop = top;
    else if (bottom > list.scrollTop + list.clientHeight) list.scrollTop = bottom - list.clientHeight;
  };

  const onKey = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const k = moveKey(flat, active, e.key === "ArrowDown" ? 1 : -1);
      select(k);
      scrollKey(k);
    } else if (e.key === "Tab") {
      e.preventDefault();
      const k = jumpKey(view, active, e.shiftKey ? -1 : 1);
      select(k);
      scrollKey(k);
    } else if (e.key === "Home" || e.key === "End") {
      e.preventDefault();
      const k = edgeKey(flat, e.key === "End" ? 1 : -1);
      select(k);
      scrollKey(k);
    } else if (e.key === "Enter") {
      const opt = flat.find((o) => o.key === active);
      if (opt) {
        e.preventDefault();
        run(opt, false);
      }
    } else if (e.key === "Escape" && query) {
      e.preventDefault();
      setQuery("");
    }
  };

  const prevQ = useRef(q);
  const seen = useRef<string | null>(null);
  useEffect(() => {
    const list = listEl.current;
    const inner = innerEl.current;
    const pill = pillEl.current;
    if (!list || !inner || !pill) return;
    list.style.height = `${Math.min(LIST_MAX, inner.scrollHeight + 4)}px`;
    const el = active ? itemEls.current.get(active) : null;
    if (el) {
      pill.style.transform = `translateY(${el.offsetTop}px)`;
      pill.style.height = `${el.offsetHeight}px`;
    }
    if (prevQ.current !== q) {
      prevQ.current = q;
      list.scrollTop = 0;
    }
    if (el && seen.current !== active) {
      seen.current = active;
      const top = el.offsetTop;
      const bottom = top + el.offsetHeight;
      if (top < list.scrollTop) list.scrollTop = top;
      else if (bottom > list.scrollTop + list.clientHeight) list.scrollTop = bottom - list.clientHeight;
    }
  });

  const marked = (text: string) =>
    segments(text, q).map((s, i) => (s.m ? <mark key={i}>{s.t}</mark> : s.t));

  const option = (opt: MenuOption) => {
    const item = opt.item;
    const selected = opt.key === active;
    return (
      <button
        key={opt.key}
        id={`${uid}-${opt.key}`}
        data-key={opt.key}
        type="button"
        role="option"
        aria-selected={selected}
        className="cm__item"
        tabIndex={-1}
        data-ran={ran === opt.key || undefined}
        ref={(el) => {
          if (el) itemEls.current.set(opt.key, el);
          else itemEls.current.delete(opt.key);
        }}
        onPointerMove={() => select(opt.key)}
        onPointerDown={(e: ReactPointerEvent) => e.preventDefault()}
        onClick={() => run(opt, true)}
      >
        {item.logo ? (
          <span className="cm__logo" data-letter={item.name.slice(0, 1)} aria-hidden="true">
            {item.logo}
          </span>
        ) : item.icon ? (
          <span className="cm__icon" data-letter={item.name.slice(0, 1)} aria-hidden="true">
            {item.icon}
          </span>
        ) : null}
        <span className="cm__text">
          <span className="cm__name" dir="auto" title={item.name}>
            {marked(item.name)}
          </span>
          {item.hint && (
            <span className="cm__hint" dir="auto" title={item.hint}>
              {marked(item.hint)}
            </span>
          )}
        </span>
        {item.keys?.length ? (
          <span className="cm__keys" aria-hidden="true">
            {item.keys.map((k, i) => (
              <kbd key={i}>{k}</kbd>
            ))}
          </span>
        ) : null}
      </button>
    );
  };

  return (
    <div className={`cm${className ? ` ${className}` : ""}`}>
      <div className="cm__card">
        <label className="cm__search">
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <circle cx="7" cy="7" r="4.5" />
            <path d="m13.2 13.2-2.75-2.75" />
          </svg>
          <input
            dir="auto"
            placeholder={placeholder ?? L.placeholder}
            aria-label={L.searchLabel}
            role="combobox"
            aria-expanded="true"
            aria-controls={`${uid}-list`}
            aria-activedescendant={active ? `${uid}-${active}` : undefined}
            value={query}
            onChange={(e) => setQuery(e.currentTarget.value)}
            onKeyDown={onKey}
          />
          <kbd className="cm__enter" aria-hidden="true">
            <svg viewBox="0 0 16 16">
              <path d="M12.5 4v3a2 2 0 0 1-2 2h-7M6 6.5 3.5 9 6 11.5" />
            </svg>
          </kbd>
        </label>
        <div id={`${uid}-list`} className="cm__list" role="listbox" aria-label={L.listLabel} ref={listEl}>
          <span className="cm__pill" data-lit={lit || undefined} aria-hidden="true" ref={pillEl} />
          <div className="cm__inner" ref={innerEl}>
            {view.map((g) => (
              <div key={g.id} role="group" aria-label={g.ariaLabel} className="cm__group">
                {g.label && (
                  <span className="cm__label" dir="auto">
                    {g.label}
                  </span>
                )}
                {g.options.map(option)}
              </div>
            ))}
          </div>
        </div>
        <footer className="cm__foot" aria-live="polite">
          {done ? (
            <span className="cm__done">
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="m3.5 8.5 3 3 6-7" />
              </svg>
              <span className="cm__done-text" dir="auto">
                {done}
              </span>
            </span>
          ) : (
            <span className="cm__tip">
              <kbd>{L.tipKey}</kbd> {L.tip}
            </span>
          )}
          <span className="cm__foot-right">
            <span className="cm__keys" aria-hidden="true">
              {L.openKeys.map((k, i) => (
                <kbd key={i}>{k}</kbd>
              ))}
            </span>
            {L.openHint}
          </span>
        </footer>
      </div>
    </div>
  );
}

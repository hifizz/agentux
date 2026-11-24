"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent as ReactKeyboardEvent, FocusEvent as ReactFocusEvent, ReactNode } from "react";
import { SEGS, ariaOf, fmtPrice, fmtTtfb, moveEffort, moveIndex, speakOf, statsOf } from "./menu-model";
import { MM_LABELS, type MenuEffort, type MenuModel, type MmLabels } from "./types";
import "./model-menu.css";

export type ModelMenuProps = {
  models: MenuModel[];
  value?: string;
  defaultValue?: string;
  onChange?: (id: string, model: MenuModel) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  active?: string | null;
  onActiveChange?: (id: string | null) => void;
  pointing?: boolean;
  onPointingChange?: (pointing: boolean) => void;
  thinking?: boolean;
  defaultThinking?: boolean;
  onThinkingChange?: (on: boolean) => void;
  effort?: MenuEffort;
  defaultEffort?: MenuEffort;
  onEffortChange?: (effort: MenuEffort) => void;
  web?: boolean;
  defaultWeb?: boolean;
  onWebChange?: (on: boolean) => void;
  align?: "start" | "end";
  side?: "top" | "bottom";
  labels?: Partial<MmLabels>;
  className?: string;
};

const SWAP_MS = 400;
const ROLL_MS = 460;
const EFFORTS: MenuEffort[] = ["low", "medium", "high"];

function Chev() {
  return (
    <svg className="mm__chevron" viewBox="0 0 12 12" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m3.2 4.7 2.8 2.8 2.8-2.8" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="mm__check" viewBox="0 0 14 14" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m3.5 7.5 2.3 2.3 4.7-5" />
    </svg>
  );
}

function BulbIcon() {
  return (
    <svg viewBox="0 0 14 14" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5.4 10.5h3.2M5.9 12.2h2.2M7 1.8a3.85 3.85 0 0 0-2.2 7c.4.3.6.7.6 1.1v.1h3.2v-.1c0-.4.2-.8.6-1.1A3.85 3.85 0 0 0 7 1.8Z" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg viewBox="0 0 14 14" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="7" cy="7" r="5.25" />
      <path d="M1.95 7h10.1M7 1.75c1.35 1.45 1.95 3.25 1.95 5.25s-.6 3.8-1.95 5.25c-1.35-1.45-1.95-3.25-1.95-5.25S5.65 3.2 7 1.75Z" />
    </svg>
  );
}

export function SparkIcon() {
  return (
    <svg viewBox="0 0 12 12" width="12" height="12" fill="currentColor" aria-hidden="true">
      <path d="M6 1.6 7.05 4.95 10.4 6 7.05 7.05 6 10.4 4.95 7.05 1.6 6 4.95 4.95Z" />
    </svg>
  );
}

type SwapItem = { key: number; kind: string; out: boolean; fresh: boolean };

function Swap({ kind, render, className }: { kind: string; render: (kind: string) => ReactNode; className?: string }) {
  const [items, setItems] = useState<SwapItem[]>(() => [{ key: 0, kind, out: false, fresh: false }]);
  const [prev, setPrev] = useState(kind);
  if (prev !== kind) {
    setPrev(kind);
    setItems((cur) => {
      const key = cur.reduce((m, i) => Math.max(m, i.key), 0) + 1;
      return [...cur.map((i) => ({ ...i, out: true, fresh: false })), { key, kind, out: false, fresh: true }];
    });
  }
  useEffect(() => {
    if (!items.some((i) => i.out || i.fresh)) return;
    const id = window.setTimeout(() => {
      setItems((cur) => cur.filter((i) => !i.out).map((i) => (i.fresh ? { ...i, fresh: false } : i)));
    }, SWAP_MS);
    return () => window.clearTimeout(id);
  }, [items]);
  return (
    <span className={`mm__swap${className ? ` ${className}` : ""}`}>
      {items.map((i) => (
        <span key={i.key} className="mm__swap-item" dir="auto" data-fresh={i.fresh || undefined} data-out={i.out || undefined} aria-hidden={i.out || undefined}>
          {render(i.kind)}
        </span>
      ))}
    </span>
  );
}

function Roll({ value, format }: { value: number; format: (v: number) => string }) {
  const reduced = useMemo(() => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches, []);
  const [disp, setDisp] = useState(value);
  const [anim, setAnim] = useState<{ from: number } | null>(null);
  const [prev, setPrev] = useState(value);
  if (prev !== value) {
    setPrev(value);
    if (reduced) {
      setAnim(null);
      setDisp(value);
    } else {
      setAnim({ from: disp });
    }
  }
  useEffect(() => {
    if (!anim) return;
    let start = -1;
    let raf = window.requestAnimationFrame(function tick(t) {
      if (start < 0) start = t;
      const k = Math.min(1, (t - start) / ROLL_MS);
      if (k >= 1) {
        setDisp(value);
        setAnim(null);
        return;
      }
      setDisp(anim.from + (value - anim.from) * (1 - Math.pow(1 - k, 3)));
      raf = window.requestAnimationFrame(tick);
    });
    return () => window.cancelAnimationFrame(raf);
  }, [anim, value]);
  return <b>{format(disp)}</b>;
}

export function ModelMenu({
  models,
  value,
  defaultValue,
  onChange,
  open,
  defaultOpen = false,
  onOpenChange,
  active: activeProp,
  onActiveChange,
  pointing: pointingProp,
  onPointingChange,
  thinking,
  defaultThinking = false,
  onThinkingChange,
  effort,
  defaultEffort = "medium",
  onEffortChange,
  web,
  defaultWeb = false,
  onWebChange,
  align = "start",
  side = "bottom",
  labels,
  className,
}: ModelMenuProps) {
  const L = useMemo(() => ({ ...MM_LABELS, ...labels }), [labels]);
  const uid = useId();
  const root = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const segRef = useRef<HTMLDivElement>(null);
  const optEls = useRef(new Map<string, HTMLElement>());

  const [selLocal, setSelLocal] = useState(() => defaultValue ?? models[0]?.id ?? "");
  const [openLocal, setOpenLocal] = useState(defaultOpen);
  const [actLocal, setActLocal] = useState<string | null>(null);
  const [pointLocal, setPointLocal] = useState(false);
  const [thinkLocal, setThinkLocal] = useState(defaultThinking);
  const [effLocal, setEffLocal] = useState<MenuEffort>(defaultEffort);
  const [webLocal, setWebLocal] = useState(defaultWeb);
  const [note, setNote] = useState<string | null>(null);
  const [thumb, setThumb] = useState({ x: 0, w: 0 });

  const sel = value ?? selLocal;
  const isOpen = open ?? openLocal;
  const active = activeProp !== undefined ? activeProp : actLocal;
  const pointing = pointingProp ?? pointLocal;
  const think = thinking ?? thinkLocal;
  const eff = effort ?? effLocal;
  const webOn = web ?? webLocal;

  const selModel = models.find((m) => m.id === sel) ?? models[0];
  const litId = pointing && active ? active : sel;
  const litModel = models.find((m) => m.id === litId) ?? selModel;
  const litStats = litModel ? statsOf(litModel, think, eff) : null;

  const setOpen = useCallback(
    (v: boolean) => {
      if (open === undefined) setOpenLocal(v);
      onOpenChange?.(v);
    },
    [open, onOpenChange],
  );
  const setActive = useCallback(
    (id: string | null) => {
      if (activeProp === undefined) setActLocal(id);
      onActiveChange?.(id);
    },
    [activeProp, onActiveChange],
  );
  const setPointing = useCallback(
    (p: boolean) => {
      if (pointingProp === undefined) setPointLocal(p);
      onPointingChange?.(p);
    },
    [pointingProp, onPointingChange],
  );
  const setThink = useCallback(
    (v: boolean) => {
      if (thinking === undefined) setThinkLocal(v);
      onThinkingChange?.(v);
    },
    [thinking, onThinkingChange],
  );
  const setEff = useCallback(
    (v: MenuEffort) => {
      if (effort === undefined) setEffLocal(v);
      onEffortChange?.(v);
    },
    [effort, onEffortChange],
  );
  const setWeb = useCallback(
    (v: boolean) => {
      if (web === undefined) setWebLocal(v);
      onWebChange?.(v);
    },
    [web, onWebChange],
  );

  const openMenu = useCallback(() => {
    setNote(null);
    setActive(sel);
    setPointing(false);
    setOpen(true);
  }, [sel, setActive, setOpen, setPointing]);

  const closeMenu = useCallback(
    (backToTrigger: boolean) => {
      setNote(null);
      setPointing(false);
      setOpen(false);
      if (backToTrigger) triggerRef.current?.focus();
    },
    [setOpen, setPointing],
  );

  const select = useCallback(
    (id: string) => {
      const m = models.find((x) => x.id === id);
      if (!m) return;
      if (value === undefined) setSelLocal(id);
      onChange?.(id, m);
      closeMenu(true);
    },
    [models, value, onChange, closeMenu],
  );

  const lit = useCallback(
    (id: string | null, p: boolean) => {
      setNote(null);
      setActive(id);
      setPointing(p);
    },
    [setActive, setPointing],
  );

  const nav = useCallback(
    (dir: 1 | -1) => {
      const i = models.findIndex((m) => m.id === active);
      const next = models[moveIndex(models.length, i, dir)];
      if (!next) return;
      lit(next.id, true);
      optEls.current.get(next.id)?.scrollIntoView({ block: "nearest" });
    },
    [models, active, lit],
  );

  const edge = useCallback(
    (last: boolean) => {
      const next = models[last ? models.length - 1 : 0];
      if (!next) return;
      lit(next.id, true);
      optEls.current.get(next.id)?.scrollIntoView({ block: "nearest" });
    },
    [models, lit],
  );

  const chooseEffort = useCallback(
    (e: MenuEffort) => {
      setNote(null);
      setEff(e);
    },
    [setEff],
  );

  useEffect(() => {
    if (!isOpen) return;
    listRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const down = (e: PointerEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) closeMenu(false);
    };
    document.addEventListener("pointerdown", down);
    return () => document.removeEventListener("pointerdown", down);
  }, [isOpen, closeMenu]);

  useLayoutEffect(() => {
    const group = segRef.current;
    if (!group) return;
    const measure = () => {
      const btn = group.querySelector<HTMLButtonElement>('[aria-checked="true"]');
      if (btn) setThumb((last) => (last.x === btn.offsetLeft && last.w === btn.offsetWidth ? last : { x: btn.offsetLeft, w: btn.offsetWidth }));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(group);
    group.querySelectorAll("button").forEach((b) => observer.observe(b));
    return () => observer.disconnect();
  }, [eff, think, isOpen]);

  const onRootKey = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape" && isOpen) {
      e.preventDefault();
      closeMenu(true);
    }
  };

  const onRootBlur = (e: ReactFocusEvent<HTMLDivElement>) => {
    const to = e.relatedTarget as HTMLElement | null;
    if (to === null || (root.current && root.current.contains(to))) return;
    closeMenu(false);
  };

  const onListKey = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      nav(1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      nav(-1);
    } else if (e.key === "Home") {
      e.preventDefault();
      edge(false);
    } else if (e.key === "End") {
      e.preventDefault();
      edge(true);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (active) select(active);
    }
  };

  const onSegKey = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      const next = moveEffort(EFFORTS, eff, 1);
      chooseEffort(next);
      segRef.current?.querySelector<HTMLElement>(`[data-effort="${next}"]`)?.focus();
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      const next = moveEffort(EFFORTS, eff, -1);
      chooseEffort(next);
      segRef.current?.querySelector<HTMLElement>(`[data-effort="${next}"]`)?.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      chooseEffort(EFFORTS[0]);
      segRef.current?.querySelector<HTMLElement>(`[data-effort="${EFFORTS[0]}"]`)?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      const last = EFFORTS[EFFORTS.length - 1];
      chooseEffort(last);
      segRef.current?.querySelector<HTMLElement>(`[data-effort="${last}"]`)?.focus();
    }
  };

  const activeIdx = models.findIndex((m) => m.id === active);

  const meters = (m: MenuModel) => [m.stats?.speed ?? 0, m.stats?.quality ?? 0, m.stats?.cost ?? 0];

  const captionKind = note !== null ? `t:${note}` : litStats ? "s" : `t:${litModel?.tagline ?? ""}`;

  const captionNode = (kind: string) =>
    kind === "s" ? (
      <>
        <span>
          ~<Roll value={litStats?.ttfb ?? 0} format={fmtTtfb} /> first token
        </span>
        <span className="mm__dot"> · </span>
        <span>
          <Roll value={litStats?.price ?? 0} format={fmtPrice} /> / M tokens
        </span>
      </>
    ) : (
      kind.slice(2)
    );

  const srText = isOpen ? (note ?? (litModel ? speakOf(litModel, think, eff) : "")) : "";

  const toggleEl = (icon: ReactNode, label: string, on: boolean, flip: () => void) => (
    <button type="button" role="switch" aria-checked={on} className="mm__toggle" onClick={flip}>
      <span className="mm__toggle-icon">{icon}</span>
      <span className="mm__toggle-label">{label}</span>
      <span className="mm__switch" aria-hidden="true" />
    </button>
  );

  const optionEl = (m: MenuModel, i: number) => (
    <div
      key={m.id}
      id={`${uid}-opt-${i}`}
      role="option"
      aria-selected={m.id === sel}
      aria-label={ariaOf(m, L)}
      className="mm__option"
      data-active={m.id === active || undefined}
      data-lit={m.id === litId || undefined}
      ref={(el) => {
        if (el) optEls.current.set(m.id, el);
        else optEls.current.delete(m.id);
      }}
      onPointerEnter={() => lit(m.id, true)}
      onClick={() => select(m.id)}
    >
      <span className="mm__glyph" aria-hidden="true">
        {m.glyph ?? m.name.slice(0, 1)}
      </span>
      <span className="mm__text">
        <span className="mm__title">
          <span className="mm__title-name" dir="auto" title={m.name}>
            {m.name}
          </span>
          {m.id === sel && <CheckIcon />}
        </span>
        <span className="mm__desc" dir="auto" title={m.tagline}>
          {m.tagline}
        </span>
      </span>
      {m.stats ? (
        <span className="mm__bars" aria-hidden="true">
          {meters(m).map((v, c) => (
            <span key={c} className="mm__meter" style={{ "--c": c } as CSSProperties}>
              {Array.from({ length: SEGS }, (_, s) => (
                <span key={s} className="mm__seg" data-on={s < v || undefined} style={{ "--s": s } as CSSProperties} />
              ))}
            </span>
          ))}
        </span>
      ) : (
        <span className="mm__varies" aria-hidden="true">
          {L.varies}
        </span>
      )}
    </div>
  );

  return (
    <div className={`mm${className ? ` ${className}` : ""}`} ref={root} data-open={isOpen || undefined} data-align={align} data-side={side} onKeyDown={onRootKey} onBlur={onRootBlur}>
      <button
        ref={triggerRef}
        type="button"
        className="mm__trigger"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls={`${uid}-menu`}
        aria-label={`${L.model}: ${selModel?.name ?? ""}${think ? `, ${L.thinking.toLowerCase()}` : ""}`}
        onClick={() => (isOpen ? closeMenu(false) : openMenu())}
        onKeyDown={(e) => {
          if ((e.key === "ArrowDown" || e.key === "ArrowUp") && !isOpen) {
            e.preventDefault();
            openMenu();
          }
        }}
      >
        <span className="mm__glyph" aria-hidden="true">
          {selModel?.glyph ?? selModel?.name.slice(0, 1)}
        </span>
        <span className="mm__name" title={selModel?.name}>
          <Swap kind={selModel?.id ?? ""} render={(k) => models.find((m) => m.id === k)?.name ?? k} />
        </span>
        <span className="mm__flag" data-on={think || undefined} aria-hidden="true">
          <span>
            <BulbIcon />
          </span>
        </span>
        <Chev />
      </button>
      <div id={`${uid}-menu`} className="mm__pop" role="dialog" aria-label={L.dialog} inert={!isOpen || undefined}>
        <div className="mm__card">
          <div className="mm__head" aria-hidden="true">
            <span>{L.model}</span>
            <span className="mm__cols">
              <span>{L.speed}</span>
              <span>{L.quality}</span>
              <span>{L.cost}</span>
            </span>
          </div>
          <div
            ref={listRef}
            className="mm__list"
            role="listbox"
            aria-label={L.model}
            tabIndex={0}
            aria-activedescendant={isOpen && activeIdx >= 0 ? `${uid}-opt-${activeIdx}` : undefined}
            data-pointing={pointing || undefined}
            onPointerLeave={() => setPointing(false)}
            onKeyDown={onListKey}
          >
            {models.length ? models.map(optionEl) : <p className="mm__empty">{L.empty}</p>}
          </div>
          <div className="mm__settings">
            {toggleEl(
              <BulbIcon />,
              L.thinking,
              think,
              () => {
                const next = !think;
                setThink(next);
                setNote(next ? L.thinkingNote : null);
              },
            )}
            <div className="mm__fold" data-open={think || undefined} inert={!think || undefined}>
              <div className="mm__clip">
                <div className="mm__effort">
                  <span className="mm__effort-label" id={`${uid}-effort`}>
                    {L.effort}
                  </span>
                  <div
                    ref={segRef}
                    className="mm__segmented"
                    role="radiogroup"
                    aria-labelledby={`${uid}-effort`}
                    onKeyDown={onSegKey}
                    style={{ "--x": `${thumb.x}px`, "--w": `${thumb.w}px` } as CSSProperties}
                  >
                    <span className="mm__thumb" aria-hidden="true" />
                    {EFFORTS.map((e) => (
                      <button key={e} type="button" role="radio" aria-checked={e === eff} tabIndex={e === eff ? 0 : -1} data-effort={e} className="mm__seg-btn" onClick={() => chooseEffort(e)}>
                        {L.efforts[e]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {toggleEl(
              <GlobeIcon />,
              L.web,
              webOn,
              () => {
                const next = !webOn;
                setWeb(next);
                setNote(next ? L.webNote : null);
              },
            )}
          </div>
        </div>
        <div className="mm__foot">
          <span className="mm__caption" aria-hidden="true">
            <Swap kind={captionKind} render={captionNode} className="mm__caption-swap" />
          </span>
          <span className="mm__keys" aria-hidden="true">
            <kbd>↑↓</kbd>
            <kbd>↵</kbd>
          </span>
          <span className="mm__sr" role="status" aria-live="polite">
            {srText}
          </span>
        </div>
      </div>
    </div>
  );
}

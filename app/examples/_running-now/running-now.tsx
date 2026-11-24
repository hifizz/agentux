"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent, FocusEvent as ReactFocusEvent } from "react";
import { ariaOf, countOf, fracOf, markColorOf, needsWord, stepTextOf, stepsOf, summaryOf } from "./now-model";
import { NOW_LABELS, type NowLabels, type NowTask } from "./types";
import "./running-now.css";

export type RunningNowProps = {
  tasks: NowTask[];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onPause?: (id: string) => void;
  onResume?: (id: string) => void;
  onOpen?: (id: string) => void;
  onOpenAll?: () => void;
  align?: "start" | "end";
  labels?: Partial<NowLabels>;
  className?: string;
};

const PIE_C = 12.5664;
const SWAP_MS = 400;

function Chev() {
  return (
    <svg className="rn__chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 9C18 9 13.58 15 12 15C10.42 15 6 9 6 9" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5.4" y="4.4" width="4.4" height="15.2" rx="1.7" fill="currentColor" />
      <rect x="14.2" y="4.4" width="4.4" height="15.2" rx="1.7" fill="currentColor" />
    </svg>
  );
}

function ResumeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M8.2 5.3c0-.98 1.1-1.58 1.96-1.06l9.36 5.7c.82.5.82 1.62 0 2.12l-9.36 5.7c-.86.52-1.96-.08-1.96-1.06V5.3Z" fill="currentColor" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4.6 12.8 9.2 17.4 19.4 7" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="5" y="4.5" width="14" height="16" rx="2.6" />
      <path d="M9.2 4.5a2.8 2.8 0 0 1 5.6 0" />
      <path d="M9 10.5h6M9 14h4" />
    </svg>
  );
}

type SwapItem = { key: number; text: string; out: boolean; fresh: boolean };

function Swap({ text, className }: { text: string; className?: string }) {
  const [items, setItems] = useState<SwapItem[]>(() => [{ key: 0, text, out: false, fresh: false }]);
  const [prev, setPrev] = useState(text);
  if (prev !== text) {
    setPrev(text);
    setItems((cur) => {
      const key = cur.reduce((m, i) => Math.max(m, i.key), 0) + 1;
      return [...cur.map((i) => ({ ...i, out: true, fresh: false })), { key, text, out: false, fresh: true }];
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
    <span className={`rn__swap${className ? ` ${className}` : ""}`}>
      {items.map((i) => (
        <span key={i.key} dir="auto" title={i.text} data-fresh={i.fresh || undefined} data-out={i.out || undefined} aria-hidden={i.out || undefined}>
          {i.text}
        </span>
      ))}
    </span>
  );
}

export function RunningNow({
  tasks,
  open,
  defaultOpen = false,
  onOpenChange,
  onPause,
  onResume,
  onOpen,
  onOpenAll,
  align = "end",
  labels,
  className,
}: RunningNowProps) {
  const L = useMemo(() => ({ ...NOW_LABELS, ...labels }), [labels]);
  const counts = useMemo(() => countOf(tasks), [tasks]);
  const panelId = useId();
  const root = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const mainRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const lastRow = useRef<{ id: string; index: number } | null>(null);
  const pendingFocus = useRef<"first" | "last" | null>(null);

  const [openLocal, setOpenLocal] = useState(defaultOpen);
  const isOpen = open ?? openLocal;
  const setOpen = useCallback(
    (v: boolean, focus?: "first" | "last") => {
      pendingFocus.current = focus ?? null;
      if (open === undefined) setOpenLocal(v);
      onOpenChange?.(v);
    },
    [open, onOpenChange],
  );

  const focusRow = useCallback(
    (i: number) => {
      const clamped = Math.max(0, Math.min(i, tasks.length - 1));
      mainRefs.current[clamped]?.focus();
    },
    [tasks.length],
  );

  useEffect(() => {
    if (!isOpen || pendingFocus.current === null) return;
    const which = pendingFocus.current;
    pendingFocus.current = null;
    focusRow(which === "last" ? tasks.length - 1 : 0);
  }, [isOpen, tasks.length, focusRow]);

  useEffect(() => {
    if (!isOpen) return;
    const down = (e: PointerEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", down);
    return () => document.removeEventListener("pointerdown", down);
  }, [isOpen, setOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const ae = document.activeElement as HTMLElement | null;
    if (ae && ae !== document.body) return;
    const last = lastRow.current;
    if (!last) return;
    let idx = tasks.findIndex((t) => t.id === last.id);
    if (idx < 0) idx = Math.min(last.index, tasks.length - 1);
    if (idx >= 0) mainRefs.current[idx]?.focus();
  }, [tasks, isOpen]);

  const [sr, setSr] = useState("");
  const [prevTasks, setPrevTasks] = useState(tasks);
  if (prevTasks !== tasks) {
    const prevMap = new Map(prevTasks.map((t) => [t.id, t.state]));
    const msgs: string[] = [];
    for (const t of tasks) {
      const p = prevMap.get(t.id);
      if (p === undefined || p === t.state) continue;
      if (t.state === "done") msgs.push(`${t.title}: ${L.done.toLowerCase()}`);
      else if (t.state === "needs-you") msgs.push(`${t.title} ${L.needsYouOne}`);
    }
    if (msgs.length) setSr(msgs.join(". "));
    setPrevTasks(tasks);
  }

  const onTriggerKey = (e: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen(!isOpen, isOpen ? undefined : "first");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true, "first");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setOpen(true, "last");
    }
  };

  const onRootKey = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape" && isOpen) {
      setOpen(false);
      triggerRef.current?.focus();
    }
  };

  const onRootBlur = (e: ReactFocusEvent<HTMLDivElement>) => {
    const to = e.relatedTarget as HTMLElement | null;
    if (to === null || (root.current && root.current.contains(to))) return;
    setOpen(false);
  };

  const onPanelKey = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    const row = (e.target as HTMLElement).closest?.(".rn__row");
    const idx = row ? tasks.findIndex((t) => t.id === row.getAttribute("data-id")) : -1;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      focusRow(idx < 0 ? 0 : idx + 1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      focusRow(idx < 0 ? tasks.length - 1 : idx - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      focusRow(0);
    } else if (e.key === "End") {
      e.preventDefault();
      focusRow(tasks.length - 1);
    }
  };

  const both = counts.running > 0 && counts.needs > 0;
  const idlePaused = counts.running === 0 && counts.needs === 0 && counts.paused > 0;
  const idle = counts.running === 0 && counts.needs === 0 && counts.paused === 0;
  const long = counts.running >= 1000 || counts.needs >= 1000 || counts.paused >= 1000;

  const actOf = (t: NowTask) => {
    if (t.state === "running" && onPause) {
      return (
        <button type="button" className="rn__btn" aria-label={`${L.pause} ${t.title}`} title={L.pause} onClick={() => onPause(t.id)}>
          <PauseIcon />
        </button>
      );
    }
    if (t.state === "paused" && onResume) {
      return (
        <button type="button" className="rn__btn" aria-label={`${L.resume} ${t.title}`} title={L.resume} onClick={() => onResume(t.id)}>
          <ResumeIcon />
        </button>
      );
    }
    if (t.state === "needs-you" && onOpen) {
      return (
        <button type="button" className="rn__btn rn__btn--text" aria-label={`${L.open} ${t.title} – ${L.needsYouOne}`} onClick={() => onOpen(t.id)}>
          {L.open}
        </button>
      );
    }
    if (t.state === "done") {
      return (
        <span className="rn__btn" aria-hidden="true">
          <CheckIcon />
        </span>
      );
    }
    return null;
  };

  const rowEl = (t: NowTask, i: number) => {
    const steps = stepsOf(t);
    return (
      <li key={t.id} className="rn__row" data-state={t.state} data-id={t.id} onFocus={() => (lastRow.current = { id: t.id, index: i })}>
        <button
          type="button"
          className="rn__main"
          aria-label={ariaOf(t, L)}
          ref={(el) => {
            mainRefs.current[i] = el;
          }}
          onClick={() => onOpen?.(t.id)}
        >
          <svg className="rn__mark" viewBox="0 0 14 14" width="14" height="14" aria-hidden="true" style={{ color: `var(--rn-${markColorOf(t)})` }}>
            <circle cx="7" cy="7" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <circle className="rn__pie" cx="7" cy="7" r="2" fill="none" stroke="currentColor" strokeWidth="4" transform="rotate(-90 7 7)" style={{ strokeDasharray: `${(fracOf(t) * PIE_C).toFixed(5)}, ${PIE_C}` }} />
          </svg>
          <span className="rn__text">
            <span className="rn__title" dir="auto" title={t.title}>
              {t.title}
            </span>
            <Swap className="rn__step" text={stepTextOf(t, L)} />
          </span>
          {t.state === "needs-you" ? <span className="rn__badge">{L.needsYouBadge}</span> : steps !== null && <span className="rn__steps">{steps}</span>}
        </button>
        <span className="rn__act">{actOf(t)}</span>
      </li>
    );
  };

  return (
    <div
      className={`rn${className ? ` ${className}` : ""}`}
      ref={root}
      data-open={isOpen || undefined}
      data-align={align}
      data-both={both || undefined}
      data-long={long || undefined}
      onKeyDown={onRootKey}
      onBlur={onRootBlur}
    >
      <button
        ref={triggerRef}
        type="button"
        className="rn__trigger"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls={panelId}
        aria-label={`${L.title}: ${summaryOf(counts, L)}`}
        onClick={() => setOpen(!isOpen)}
        onKeyDown={onTriggerKey}
      >
        {counts.running > 0 && (
          <span className="rn__part">
            <span className="rn__ring" aria-hidden="true" />
            <Swap className="rn__n" text={String(counts.running)} />
            <span className="rn__word">{L.running}</span>
          </span>
        )}
        {both && (
          <span className="rn__sep" aria-hidden="true">
            ·
          </span>
        )}
        {counts.needs > 0 && (
          <span className="rn__part">
            <span className="rn__dot" aria-hidden="true" />
            <Swap className="rn__n" text={String(counts.needs)} />
            <span className="rn__word">{needsWord(counts.needs, L)}</span>
          </span>
        )}
        {idlePaused && (
          <span className="rn__part">
            <span className="rn__ring" data-idle="" aria-hidden="true" />
            <Swap className="rn__n" text={String(counts.paused)} />
            <span className="rn__word">{L.pausedCount}</span>
          </span>
        )}
        {idle && (
          <span className="rn__part">
            <span className="rn__ring" data-idle="" aria-hidden="true" />
            <span className="rn__word">{L.idle}</span>
          </span>
        )}
        <Chev />
      </button>
      <div id={panelId} className="rn__panel" role="dialog" aria-label={L.title} tabIndex={-1} hidden={!isOpen} onKeyDown={onPanelKey}>
        <div className="rn__head">
          <span className="rn__label">{L.title}</span>
          <span className="rn__count">{tasks.length}</span>
        </div>
        <div className="rn__body">
          {tasks.length ? (
            <ul className="rn__list">{tasks.map(rowEl)}</ul>
          ) : (
            <p className="rn__empty">{L.empty}</p>
          )}
        </div>
        {onOpenAll && (
          <div className="rn__foot">
            <button type="button" className="rn__all" onClick={onOpenAll}>
              <ListIcon />
              <span>{L.openAll}</span>
              <svg className="rn__chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 6C9 6 15 10.42 15 12C15 13.58 9 18 9 18" />
              </svg>
            </button>
          </div>
        )}
      </div>
      <span className="rn__sr" role="status" aria-live="polite">
        {sr}
      </span>
    </div>
  );
}

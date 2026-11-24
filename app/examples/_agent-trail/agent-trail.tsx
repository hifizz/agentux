"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { ariaOf, foldWindow, metaOf, runningSubIndex, stepDuration } from "./trail-model";
import { TRAIL_LABELS, type TrailStep, type TrailSub } from "./types";
import "./agent-trail.css";

export type AgentTrailProps = {
  title?: string;
  agent?: { name: string; logo?: ReactNode };
  steps: TrailStep[];
  expanded?: string[];
  onExpandedChange?: (ids: string[]) => void;
  onApprove?: (step: TrailStep) => void;
  onDecline?: (step: TrailStep) => void;
  labels?: Partial<typeof TRAIL_LABELS>;
  className?: string;
};

const SLICES = 14;
const TAIL = 28;

const markOf = (step: TrailStep) => {
  if (step.state === "pending") return step.gate ? "gate" : "pending";
  return step.state;
};

function Mark({ kind }: { kind: string }) {
  switch (kind) {
    case "done":
      return (
        <svg viewBox="0 0 16 16" width="16" height="16">
          <path d="M5 8.3L7 10.2L11 6" pathLength="1" />
        </svg>
      );
    case "running":
      return (
        <svg viewBox="0 0 16 16" width="16" height="16">
          <circle className="at__track" cx="8" cy="8" r="6.25" />
          <circle className="at__arc" cx="8" cy="8" r="6.25" pathLength="40" />
        </svg>
      );
    case "gate":
      return (
        <svg viewBox="0 0 16 16" width="16" height="16">
          <circle cx="8" cy="8" r="6.25" />
        </svg>
      );
    case "waiting":
      return (
        <svg viewBox="0 0 16 16" width="16" height="16">
          <path d="M6.4 5.6v4.8M9.6 5.6v4.8" />
        </svg>
      );
    case "failed":
      return (
        <svg viewBox="0 0 16 16" width="16" height="16">
          <path d="M5.6 5.6l4.8 4.8M10.4 5.6l-4.8 4.8" />
        </svg>
      );
    case "declined":
      return (
        <svg viewBox="0 0 16 16" width="16" height="16">
          <path d="M5 8h6" />
        </svg>
      );
    default:
      return null;
  }
}

function Chev() {
  return (
    <svg className="at__chev" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 9C18 9 13.58 15 12 15C10.42 15 6 9 6 9" />
    </svg>
  );
}

export function AgentTrail({ title, agent, steps, expanded, onExpandedChange, onApprove, onDecline, labels, className }: AgentTrailProps) {
  const L = useMemo(() => ({ ...TRAIL_LABELS, ...labels }), [labels]);
  const uid = useId();
  const root = useRef<HTMLDivElement>(null);

  const runningId = steps.find((s) => s.state === "running")?.id;
  const [openLocal, setOpenLocal] = useState<Set<string>>(() => new Set(runningId ? [runningId] : []));
  const [unfolded, setUnfolded] = useState<Set<string>>(new Set());
  const [askOpen, setAskOpen] = useState<string | null>(null);
  const [sr, setSr] = useState("");
  const [now, setNow] = useState(() => Date.now());
  const coarse = useMemo(() => typeof window !== "undefined" && window.matchMedia("(hover: none) and (pointer: coarse)").matches, []);

  const openIds = useMemo(() => (expanded ? new Set(expanded) : openLocal), [expanded, openLocal]);
  const toggle = useCallback(
    (id: string) => {
      const next = new Set(openIds);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      if (!expanded) setOpenLocal(next);
      onExpandedChange?.([...next]);
    },
    [expanded, openIds, onExpandedChange],
  );

  const [prevRun, setPrevRun] = useState(runningId);
  if (prevRun !== runningId) {
    setOpenLocal((cur) => {
      const next = new Set(cur);
      if (prevRun) next.delete(prevRun);
      if (runningId) next.add(runningId);
      return next;
    });
    setPrevRun(runningId);
  }

  const needsClock = steps.some((s) => s.state === "running" && s.startedAt !== undefined);
  useEffect(() => {
    if (!needsClock) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [needsClock]);

  const [prevSteps, setPrevSteps] = useState(steps);
  if (prevSteps !== steps) {
    const prevMap = new Map(prevSteps.map((s) => [s.id, s.state]));
    const msgs: string[] = [];
    for (const s of steps) {
      const p = prevMap.get(s.id);
      if (p === undefined || p === s.state) continue;
      const name = s.title || L.untitled;
      if (s.state === "done") msgs.push(`${name}: ${L.done.toLowerCase()}`);
      else if (s.state === "failed") msgs.push(`${name}: ${L.failed.toLowerCase()}`);
      else if (s.state === "waiting") msgs.push(`${name}: ${L.waiting.toLowerCase()}`);
    }
    if (msgs.length) setSr((old) => (old ? `${old}. ${msgs.join(". ")}` : msgs.join(". ")));
    setPrevSteps(steps);
  }

  useEffect(() => {
    if (!askOpen) return;
    root.current?.querySelector<HTMLElement>(`[id="${CSS.escape(askOpen)}"] [data-approve]`)?.focus();
  }, [askOpen]);

  useEffect(() => {
    const ae = document.activeElement as HTMLElement | null;
    const stuck = ae?.closest(".at__subs[inert]");
    if (stuck) stuck.closest(".at__step")?.querySelector<HTMLElement>(".at__row")?.focus();
  });

  const doneCount = steps.filter((s) => s.state === "done").length;
  const isOpen = (s: TrailStep) => !!s.substeps?.length && openIds.has(s.id);

  const subRow = (sub: TrailSub, key: number | string) => (
    <li key={key} className="at__sub" data-state={sub.state ?? "done"} aria-current={sub.state === "running" ? "step" : undefined}>
      <span className="at__dot" aria-hidden="true" />
      <span className="at__subtitle" dir="auto" title={sub.title || undefined} data-untitled={!sub.title || undefined}>
        {sub.title || L.untitled}
      </span>
      {sub.detail !== undefined && (
        <span className="at__detail" dir="auto" title={sub.detail}>
          {sub.detail}
        </span>
      )}
    </li>
  );

  const stepEl = (s: TrailStep, i: number) => {
    const hasSubs = !!s.substeps?.length;
    const open = isOpen(s);
    const subsId = `${uid}-${i}`;
    const askId = `${uid}-ask-${i}`;
    const interactive = !!(onApprove || onDecline);
    const meta = metaOf(s, L, now);
    const dur = stepDuration(s);
    const rIdx = s.substeps ? runningSubIndex(s.substeps) : -1;
    const fold = s.substeps ? foldWindow(s.substeps.length, rIdx) : null;
    const isUnfolded = unfolded.has(s.id);
    const shownSubs = s.substeps ? (fold && !isUnfolded ? s.substeps.slice(fold.start, fold.start + 5) : s.substeps) : [];

    const rowInner = (
      <>
        <span className="at__mark" data-kind={markOf(s)} aria-hidden="true">
          <Mark kind={markOf(s)} />
        </span>
        {s.tool && (
          <span className="at__tool at__logo" title={s.tool.name} aria-hidden="true">
            {s.tool.logo}
          </span>
        )}
        <span className="at__title" dir="auto" title={s.title || undefined} data-untitled={!s.title || undefined}>
          {s.title || L.untitled}
        </span>
        {hasSubs && <Chev />}
        <span className="at__meta" key={s.state}>
          {meta.kind === "done" && dur && (
            <span className="at__time" dir="auto">
              {dur}
            </span>
          )}
          {meta.kind === "running" && (
            <span className="at__live">
              <span className="at__status" dir="auto" title={meta.text}>
                {meta.text}
              </span>
              {meta.clock && (
                <span className="at__clock" dir="auto">
                  {meta.clock}
                </span>
              )}
            </span>
          )}
          {meta.kind === "waiting" &&
            (interactive ? (
              <button
                type="button"
                className="at__needs"
                data-needs={s.id}
                aria-expanded={askOpen === askId}
                aria-controls={askId}
                onClick={() => setAskOpen((cur) => (cur === askId ? null : askId))}
              >
                {L.waiting}
                <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
            ) : (
              <span className="at__needs">{L.waiting}</span>
            ))}
          {meta.kind === "approval" && (
            <span className="at__badge" dir="auto" title={L.approval}>
              {L.approval}
            </span>
          )}
          {meta.kind === "failed" && <span className="at__fail">{L.failed}</span>}
          {meta.kind === "declined" && <span className="at__declined">{L.declined}</span>}
        </span>
      </>
    );

    return (
      <li
        key={s.id}
        className="at__step"
        data-state={s.state}
        data-in={i > 0 ? (s.state !== "pending" ? "on" : "off") : undefined}
        data-out={i < steps.length - 1 ? (s.state === "done" ? "on" : "off") : undefined}
        data-open={open || undefined}
        data-after-branch={i > 0 && isOpen(steps[i - 1]) ? "true" : undefined}
        data-gate={s.gate || undefined}
        aria-current={s.state === "running" ? "step" : undefined}
      >
        {hasSubs ? (
          <button type="button" className="at__row" aria-expanded={open} aria-controls={subsId} aria-label={ariaOf(s, L, now)} onClick={() => toggle(s.id)}>
            {rowInner}
          </button>
        ) : (
          <div className="at__row" role="group" aria-label={ariaOf(s, L, now)} tabIndex={-1}>
            {rowInner}
          </div>
        )}
        {hasSubs && (
          <span className="at__wire" aria-hidden="true">
            <svg className="at__bend" viewBox="0 0 28 14" width="28" height="14">
              <path d="M9 0 C9 8 21 6 21 14" />
            </svg>
            <span className="at__spine" />
            {i < steps.length - 1 && (
              <svg className="at__bend at__bend--out" viewBox="0 0 28 14" width="28" height="14">
                <path d="M21 0 C21 8 9 6 9 14" />
              </svg>
            )}
          </span>
        )}
        {open && rIdx >= 0 && (
          <svg
            className="at__spark"
            viewBox="0 0 28 48"
            width="28"
            height="48"
            aria-hidden="true"
            style={{ "--len": 28 + rIdx * (coarse ? 28 : 24), "--tail": TAIL } as CSSProperties}
          >
            <path d={`M9 0 C9 8 21 6 21 14 L21 ${22 + rIdx * (coarse ? 28 : 24)}`} className="at__probe" />
            {Array.from({ length: SLICES }, (_, j) => (
              <path
                key={j}
                d={`M9 0 C9 8 21 6 21 14 L21 ${22 + rIdx * (coarse ? 28 : 24)}`}
                className="at__slice"
                style={{ "--k": TAIL - 2 * j, opacity: (j + 1) / SLICES, strokeDasharray: "2, 9999" } as CSSProperties}
              />
            ))}
          </svg>
        )}
        {hasSubs && (
          <div id={subsId} className="at__subs" data-open={open || undefined} inert={!open || undefined}>
            <ul className="at__sublist">
              {fold && !isUnfolded && fold.earlier > 0 && (
                <li key="earlier" className="at__sub at__sub--fold">
                  <button type="button" className="at__fold" onClick={() => setUnfolded((cur) => new Set(cur).add(s.id))}>
                    <span className="at__dot" aria-hidden="true" />
                    {L.earlier.replace("{n}", String(fold.earlier))}
                  </button>
                </li>
              )}
              {shownSubs.map((sub, j) => subRow(sub, sub.id ?? j))}
              {fold && !isUnfolded && fold.more > 0 && (
                <li key="more" className="at__sub at__sub--fold">
                  <button type="button" className="at__fold" onClick={() => setUnfolded((cur) => new Set(cur).add(s.id))}>
                    <span className="at__dot" aria-hidden="true" />
                    {L.more.replace("{n}", String(fold.more))}
                  </button>
                </li>
              )}
              {fold && isUnfolded && (
                <li key="fewer" className="at__sub at__sub--fold">
                  <button
                    type="button"
                    className="at__fold"
                    onClick={() =>
                      setUnfolded((cur) => {
                        const next = new Set(cur);
                        next.delete(s.id);
                        return next;
                      })
                    }
                  >
                    <span className="at__dot" aria-hidden="true" />
                    {L.fewer}
                  </button>
                </li>
              )}
            </ul>
          </div>
        )}
        {s.state === "waiting" && s.ask && (
          <div
            id={askId}
            className="at__ask"
            data-open={askOpen === askId || undefined}
            inert={askOpen !== askId || undefined}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setAskOpen(null);
                root.current?.querySelector<HTMLElement>(`[data-needs="${CSS.escape(s.id)}"]`)?.focus();
              }
            }}
          >
            <div className="at__ask-in">
              <p className="at__ask-text" dir="auto">
                {s.ask}
              </p>
              <div className="at__ask-actions">
                {onDecline && (
                  <button type="button" className="at__ask-btn" onClick={() => onDecline(s)}>
                    {L.decline}
                  </button>
                )}
                {onApprove && (
                  <button type="button" className="at__ask-btn" data-approve="" onClick={() => onApprove(s)}>
                    {L.approve}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </li>
    );
  };

  return (
    <div className={`at${className ? ` ${className}` : ""}`} ref={root}>
      {(title || agent) && (
        <div className="at__head">
          {title && (
            <span className="at__task" dir="auto" title={title}>
              {title}
            </span>
          )}
          {agent && (
            <span className="at__agent" title={agent.name}>
              {agent.logo && (
                <span className="at__logo" aria-hidden="true">
                  {agent.logo}
                </span>
              )}
              <span className="at__agent-name" dir="auto">
                {agent.name}
              </span>
            </span>
          )}
          <span className="at__count" aria-label={`${doneCount} of ${steps.length} steps done`}>
            {doneCount}/{steps.length}
          </span>
        </div>
      )}
      {steps.length === 0 ? (
        <p className="at__empty">{L.empty}</p>
      ) : (
        <ol className="at__list" aria-label={title ?? L.title}>
          {steps.map(stepEl)}
        </ol>
      )}
      <span className="at__sr" role="status" aria-live="polite">
        {sr}
      </span>
    </div>
  );
}

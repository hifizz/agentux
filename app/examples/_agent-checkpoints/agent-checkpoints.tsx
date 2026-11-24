"use client";

import { useId, useMemo } from "react";
import type { CSSProperties, KeyboardEvent } from "react";
import { ariaOf, cap, lanesOf, liveIds, railSegs, railWidth, sumOf, LIST_MAX, ROW_H } from "./checkpoint-model";
import { CP_LABELS, type Checkpoint, type CpLabels } from "./types";
import "./agent-checkpoints.css";

export type AgentCheckpointsProps = {
  title?: string;
  task?: string;
  checkpoints: Checkpoint[];
  onRewind?: (checkpoint: Checkpoint) => void;
  labels?: Partial<CpLabels>;
  className?: string;
};

function Mark() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M5 2.5v11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.45" />
      <path d="M5 8c0 2 1.6 2.6 3.2 2.6H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.45" />
      <circle cx="5" cy="5" r="2.25" fill="currentColor" />
      <circle cx="11.25" cy="10.6" r="2.25" fill="currentColor" />
    </svg>
  );
}

function FilesMark() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M1.4 3.1c0-.72.58-1.3 1.3-1.3h1.72c.38 0 .73.19.94.5l.6.9h3.34c.72 0 1.3.58 1.3 1.3V6H1.4Z" fill="currentColor" />
      <path d="M1 6.95C.86 6.3 1.36 5.7 2.02 5.7h7.96c.66 0 1.16.6 1.02 1.25l-.5 2.4a1.3 1.3 0 0 1-1.27 1.05H2.77A1.3 1.3 0 0 1 1.5 9.35Z" fill="currentColor" opacity="0.45" />
    </svg>
  );
}

function RewindMark() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M2.6 3.6A4 4 0 1 1 2 6.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M2.2 1.6v2.4h2.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function AgentCheckpoints({ title, task, checkpoints, onRewind, labels, className }: AgentCheckpointsProps) {
  const L = useMemo(() => ({ ...CP_LABELS, ...labels }), [labels]);
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const rows = checkpoints;
  const lanes = useMemo(() => lanesOf(rows), [rows]);
  const live = useMemo(() => liveIds(rows), [rows]);
  const segs = useMemo(() => railSegs(rows, lanes, live), [rows, lanes, live]);
  const maxLane = useMemo(() => lanes.reduce((m, l) => Math.max(m, l), 0), [lanes]);
  const railW = railWidth(maxLane);
  const headIdx = rows.length - 1;
  const interactive = !!onRewind;

  const onKeyDown = (e: KeyboardEvent<HTMLOListElement>) => {
    const li = (e.target as HTMLElement).closest("li.ac__row");
    if (!li) return;
    const items = [...e.currentTarget.querySelectorAll<HTMLElement>("li.ac__row")];
    const i = items.indexOf(li as HTMLElement);
    if (e.key === "ArrowDown" && i >= 0 && i < items.length - 1) {
      e.preventDefault();
      items[i + 1].focus();
    } else if (e.key === "ArrowUp" && i > 0) {
      e.preventDefault();
      items[i - 1].focus();
    } else if (e.key === "Enter" && interactive && i >= 0 && i !== headIdx) {
      e.preventDefault();
      onRewind(rows[i]);
    }
  };

  return (
    <div className={`ac${className ? ` ${className}` : ""}`} style={{ "--ac-gutter": `${railW + 2}px` } as CSSProperties}>
      <header className="ac__head">
        <span className="ac__mark">
          <Mark />
        </span>
        <span className="ac__title" id={uid} dir="auto" title={title ?? L.title}>
          {title ?? L.title}
        </span>
        {task && (
          <span className="ac__task" dir="auto" title={task}>
            {task}
          </span>
        )}
        <span className="ac__sum" aria-live="polite">
          {sumOf(rows, L)}
        </span>
      </header>
      {rows.length === 0 ? (
        <p className="ac__empty">{L.empty}</p>
      ) : (
        <ol
          className="ac__list"
          aria-labelledby={uid}
          style={{ "--ac-rows": rows.length } as CSSProperties}
          data-scrolls={rows.length * ROW_H + 10 > LIST_MAX || undefined}
          onKeyDown={onKeyDown}
        >
          <svg className="ac__rail" width={railW} height={rows.length * ROW_H} aria-hidden="true">
            <defs>
              <linearGradient id={`ac-${uid}-glint`} x1="0" x2="1" y1="0" y2="0">
                <stop offset="0" stopColor="#fff" stopOpacity="0" />
                <stop offset="0.5" stopColor="#fff" stopOpacity="0.55" />
                <stop offset="1" stopColor="#fff" stopOpacity="0" />
              </linearGradient>
            </defs>
            {segs.map((s) => (
              <path key={s.row} className="ac__line" d={s.d} pathLength="1" data-live={s.live || undefined} data-fork={s.fork || undefined} />
            ))}
            {rows.map((r, i) => {
              const cx = 22 + lanes[i] * 14;
              const cy = 15 + i * ROW_H;
              const head = i === headIdx;
              return (
                <g key={r.id} className="ac__dot" data-live={live.has(r.id) || undefined} data-head={head || undefined} data-status={r.status}>
                  <circle cx={cx} cy={cy} r={head ? 4.5 : 3.5} />
                  {head && (
                    <>
                      <clipPath id={`ac-${uid}-${r.id}`}>
                        <circle cx={cx} cy={cy} r="4.5" />
                      </clipPath>
                      <g clipPath={`url(#ac-${uid}-${r.id})`}>
                        <rect className="ac__glint" x={cx - 4} y={cy - 8} width="8" height="16" fill={`url(#ac-${uid}-glint)`} />
                      </g>
                    </>
                  )}
                </g>
              );
            })}
          </svg>
          {rows.map((r, i) => {
            const head = i === headIdx;
            return (
              <li
                key={r.id}
                className="ac__row"
                tabIndex={head ? 0 : -1}
                data-live={live.has(r.id) || undefined}
                data-head={head || undefined}
                data-status={r.status}
                aria-current={head ? "step" : undefined}
                aria-label={ariaOf(r, live.has(r.id), head, interactive, L)}
              >
                {r.icon && (
                  <span className="ac__icon" aria-hidden="true">
                    {r.icon}
                  </span>
                )}
                <span className="ac__name" dir="auto" title={r.title || L.untitled}>
                  {r.title || L.untitled}
                </span>
                {r.attempt !== undefined && r.attempt > 1 && <span className="ac__attempt">{cap(L.attempt.replace("{n}", String(r.attempt)))}</span>}
                {r.status === "failed" && <span className="ac__badge">{cap(L.failed)}</span>}
                <span className="ac__meta" aria-hidden="true">
                  {r.status === "stopped" && <span className="ac__stopped">{cap(L.stopped)}</span>}
                  {r.files !== undefined && (
                    <span className="ac__files">
                      <FilesMark />
                      {r.files} {r.files === 1 ? L.file : L.files}
                    </span>
                  )}
                  {r.time !== undefined && <span className="ac__time">{r.time}</span>}
                </span>
                {!head && interactive && (
                  <button type="button" className="ac__rewind" tabIndex={-1} aria-hidden="true" onClick={() => onRewind(r)}>
                    <RewindMark />
                    {L.rewind}
                  </button>
                )}
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}

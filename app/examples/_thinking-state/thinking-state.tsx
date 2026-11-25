"use client";

import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { chipDelay, extraChipDelay, formatElapsed, LOOP_HOLD_MS, pauseAfter, prepareSteps, sourceParts, stepsKey, type PreparedStep } from "./think-model";
import type { ThinkingSource, ThinkingStep } from "./types";
import "./thinking-state.css";

export type ThinkingStateProps = {
  steps: ThinkingStep[];
  doneLabel?: string;
  stepMs?: number;
  loop?: boolean;
  collapseOnDone?: boolean;
  onDone?: (seconds: number) => void;
  className?: string;
};

const PIXEL_DELAYS = [0, 120, 240, 120, 240, 360, 240, 360, 480];

type Playback = { visible: number; done: boolean; seconds: number };
type PlaybackAction = { type: "show"; visible: number } | { type: "finish"; seconds: number };

function playbackOf(visible: number): Playback {
  return { visible, done: false, seconds: 0 };
}

function reducePlayback(state: Playback, action: PlaybackAction): Playback {
  if (action.type === "show") return state.visible === action.visible ? state : { ...state, visible: action.visible };
  return { ...state, done: true, seconds: action.seconds };
}

function ElapsedTime({ since }: { since: number }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(id);
  }, []);
  return <>{formatElapsed((now - since) / 1000)}</>;
}

function GlobeSearch() {
  return (
    <svg viewBox="0 0 24 24" className="tk__globe" aria-hidden="true">
      <path d="M21.8 12a9.8 9.8 0 1 0-9.8 9.8" />
      <path d="M19.7 5.8c-.9.1-2 .5-2.8 1.4-1.4 1.8-2.8 2-3.8 1.4-1.4-.9-.2-2.4-1.9-3.2-1-.5-1.2-1.9-.6-3" />
      <path d="M2.2 10.9c.7.7 1.7 1.3 2.9 1.3 2.4 0 2.9.5 2.9 2.3s0 1.9.5 3.2c.3.9.4 1.8-.2 2.5" />
      <path d="m18.9 18.9 2 2m-.8-4.7a3.8 3.8 0 1 1-7.6 0 3.8 3.8 0 0 1 7.6 0Z" />
    </svg>
  );
}

function SourceChip({ source, delay }: { source: ThinkingSource; delay: number }) {
  const tip = source.tooltip ?? source.href?.replace(/^https?:\/\//, "");
  const content = (
    <>
      {source.icon && (
        <span
          className="tk__favicon"
          aria-hidden="true"
          onErrorCapture={(event) => {
            event.currentTarget.style.display = "none";
          }}
        >
          {source.icon}
        </span>
      )}
      <span className="tk__source-label" dir="auto" title={tip ? undefined : source.label}>
        {source.label}
      </span>
      {tip && (
        <span className="tk__tip" aria-hidden="true">
          {tip}
        </span>
      )}
    </>
  );
  const shared = {
    className: "tk__source",
    "data-count": !source.icon || undefined,
    style: { animationDelay: `${delay}ms` } as CSSProperties,
  };
  if (source.href) {
    return (
      <a {...shared} href={source.href} target="_blank" rel="noreferrer">
        {content}
      </a>
    );
  }
  return <span {...shared}>{content}</span>;
}

function StepRow({ step, index, active, expanded, onToggleSources }: { step: PreparedStep; index: number; active: boolean; expanded: boolean; onToggleSources: (index: number) => void }) {
  const label = step.kind === "search" && active ? (step.activeLabel ?? "Searching") : step.label;
  const parts = step.kind === "search" ? sourceParts(step) : null;
  const sources = parts ? (expanded ? [...parts.visible, ...parts.hidden] : parts.visible) : [];
  return (
    <li className="tk__item" data-kind={step.kind} data-active={active || undefined}>
      <span className="tk__node" aria-hidden="true">
        {step.kind === "search" ? <GlobeSearch /> : <span className="tk__dot" />}
      </span>
      <div className="tk__content">
        <span className={active ? "tk__label tk__shimmer" : "tk__label"} data-text={label} dir="auto">
          {label}
        </span>
        {parts && (
          <div className="tk__sources">
            {sources.map((source, sourceIndex) => {
              const extra = expanded && sourceIndex >= parts.visible.length;
              return <SourceChip key={`${source.label}-${sourceIndex}`} source={source} delay={extra ? extraChipDelay(sourceIndex - parts.visible.length) : chipDelay(sourceIndex)} />;
            })}
            {parts.hidden.length > 0 && (
              <button type="button" className="tk__source tk__more" aria-expanded={expanded} style={{ animationDelay: `${chipDelay(parts.visible.length)}ms` }} onClick={() => onToggleSources(index)}>
                {expanded ? "Show less" : `+${parts.hidden.length.toLocaleString("en-US")} more`}
              </button>
            )}
          </div>
        )}
      </div>
    </li>
  );
}

type RunProps = Omit<ThinkingStateProps, "steps" | "onDone"> & {
  steps: PreparedStep[];
  onDone?: (seconds: number) => void;
  onLoop: () => void;
};

function ThinkingStateRun({ steps, doneLabel = "Finished thinking", stepMs = 1300, loop = false, collapseOnDone = false, onDone, className, onLoop }: RunProps) {
  const [startedAt] = useState(() => Date.now());
  const [playback, dispatch] = useReducer(reducePlayback, steps.length, (count) => playbackOf(Math.min(1, count)));
  const [open, setOpen] = useState(true);
  const [expanded, setExpanded] = useState<ReadonlySet<number>>(() => new Set());
  const interacted = useRef(false);
  const doneRef = useRef(onDone);

  useEffect(() => {
    doneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    const timers: number[] = [];
    let at = 0;
    steps.forEach((step, index) => {
      if (index > 0) timers.push(window.setTimeout(() => dispatch({ type: "show", visible: index + 1 }), at));
      at += pauseAfter(step, stepMs);
    });
    timers.push(
      window.setTimeout(() => {
        const seconds = Math.max(1, Math.round((Date.now() - startedAt) / 1000));
        dispatch({ type: "finish", seconds });
        doneRef.current?.(seconds);
      }, at),
    );
    if (loop) {
      timers.push(
        window.setTimeout(() => {
          if (!interacted.current) onLoop();
        }, at + LOOP_HOLD_MS),
      );
    }
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [steps, stepMs, loop, startedAt, onLoop]);

  const [wasDone, setWasDone] = useState(false);
  if (wasDone !== playback.done) {
    setWasDone(playback.done);
    if (playback.done && collapseOnDone) setOpen(false);
  }

  const toggleSources = useCallback((index: number) => {
    interacted.current = true;
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }, []);

  const activeIndex = playback.done ? -1 : playback.visible - 1;
  const shown = steps.slice(0, playback.visible);

  return (
    <div className={`tk${className ? ` ${className}` : ""}`} data-done={playback.done || undefined}>
      <button type="button" className="tk__head" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
        <span className="tk__mark" aria-hidden="true">
          {PIXEL_DELAYS.map((delay, index) => (
            <i key={index} style={{ animationDelay: `${delay}ms` }} />
          ))}
        </span>
        <span className="tk__title" key={playback.done ? "done" : "busy"}>
          {playback.done ? (
            `Worked for ${formatElapsed(playback.seconds)}`
          ) : (
            <>
              <span className="tk__shimmer" data-text="Thinking">
                Thinking
              </span>
              <span className="tk__time">
                <ElapsedTime since={startedAt} />
              </span>
            </>
          )}
        </span>
        <span className="tk__chevron" aria-hidden="true">
          <svg viewBox="0 0 16 16">
            <path d="M4.5 6.25 8 9.75l3.5-3.5" />
          </svg>
        </span>
      </button>
      <div className="tk__body" data-open={open}>
        <div className="tk__clip">
          <ol className="tk__list" aria-live="polite">
            {shown.map((step, index) => (
              <StepRow key={`${step.kind}-${index}`} step={step} index={index} active={index === activeIndex} expanded={expanded.has(index)} onToggleSources={toggleSources} />
            ))}
            {playback.done && (
              <li className="tk__item" data-kind="done">
                <span className="tk__node" aria-hidden="true">
                  <svg viewBox="0 0 16 16" className="tk__check">
                    <circle cx="8" cy="8" r="6.5" />
                    <path d="M5.4 8.3l1.75 1.75L10.7 6.4" />
                  </svg>
                </span>
                <div className="tk__content">
                  <span className="tk__label" dir="auto">
                    {doneLabel}
                  </span>
                </div>
              </li>
            )}
          </ol>
        </div>
      </div>
    </div>
  );
}

export function ThinkingState({ steps, doneLabel = "Finished thinking", stepMs = 1300, loop = false, collapseOnDone = false, onDone, className }: ThinkingStateProps) {
  const prepared = useMemo(() => prepareSteps(steps), [steps]);
  const resolvedStepMs = Number.isFinite(stepMs) && stepMs >= 0 ? stepMs : 1300;
  const fingerprint = useMemo(() => stepsKey(prepared), [prepared]);
  const [cycle, setCycle] = useState(0);
  const restart = useCallback(() => setCycle((value) => value + 1), []);
  return (
    <ThinkingStateRun
      key={`${cycle}:${fingerprint}:${resolvedStepMs}:${loop}:${collapseOnDone}`}
      steps={prepared}
      doneLabel={doneLabel}
      stepMs={resolvedStepMs}
      loop={loop}
      collapseOnDone={collapseOnDone}
      onDone={onDone}
      className={className}
      onLoop={restart}
    />
  );
}

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Brain, ChevronDown, ChevronRight, FilePen, FileText, FolderOpen, Globe, Search, Sparkles, SquareTerminal } from "lucide-react";
import { cx } from "@/app/examples/_shared/ui/cx";
import { EASE_OUT_STRONG } from "@/app/examples/_shared/ui/motion";
import { Collapse } from "./collapse";
import { ShadowScroll } from "./shadow-scroll";

type Base = { id: string };
export type WorkStep = Base &
  (
    | { kind: "read"; file: string; range?: string }
    | { kind: "search"; pattern: string; scope?: string }
    | { kind: "list"; path: string }
    | { kind: "run"; command: string; output?: string }
    | { kind: "edit"; file: string; added?: number; removed?: number }
    | { kind: "think"; seconds: number; text?: string }
    | { kind: "web"; query: string }
    | { kind: "note"; label: string; detail?: string; body?: React.ReactNode; icon?: React.ReactNode }
  );

export type WorkStatus = "working" | "done" | "stopped" | "failed";
export type WorkLogVariant = "rail" | "timeline" | "ticker";

export type WorkLogProps = {
  steps: WorkStep[];
  status: WorkStatus;
  seconds?: number;
  added?: number;
  removed?: number;
  variant?: WorkLogVariant;
  group?: boolean;
  defaultOpen?: boolean;
  maxHeight?: number;
  className?: string;
};

type Item = { id: string; steps: WorkStep[] };

const ICONS: Record<WorkStep["kind"], React.ReactNode> = {
  read: <FileText />,
  search: <Search />,
  list: <FolderOpen />,
  run: <SquareTerminal />,
  edit: <FilePen />,
  think: <Brain />,
  web: <Globe />,
  note: <Sparkles />,
};

const GROUPABLE = new Set<WorkStep["kind"]>(["read", "search", "list", "web"]);
const PLURAL: Partial<Record<WorkStep["kind"], [string, string, string]>> = {
  read: ["Read", "file", "files"],
  search: ["Searched", "pattern", "patterns"],
  list: ["Listed", "folder", "folders"],
  web: ["Searched the web for", "query", "queries"],
};

export function formatDuration(total: number) {
  const s = Math.max(0, Math.round(total));
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ${s % 60}s`;
  return `${Math.floor(m / 60)}h ${m % 60}m`;
}

function useElapsed(active: boolean) {
  const start = useRef<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (!active) return;
    start.current ??= Date.now();
    const id = window.setInterval(() => setElapsed((Date.now() - (start.current ?? Date.now())) / 1000), 1000);
    return () => window.clearInterval(id);
  }, [active]);
  return elapsed;
}

function toItems(steps: WorkStep[], group: boolean): Item[] {
  const items: Item[] = [];
  for (const step of steps) {
    const last = items.at(-1);
    if (group && last && GROUPABLE.has(step.kind) && last.steps[0].kind === step.kind) last.steps.push(step);
    else items.push({ id: step.id, steps: [step] });
  }
  return items;
}

export function digest(steps: WorkStep[]) {
  const count = (k: WorkStep["kind"]) => steps.filter((s) => s.kind === k).length;
  const parts = [
    [count("read"), "file read", "files read"],
    [count("search") + count("web"), "search", "searches"],
    [count("run"), "command", "commands"],
    [count("edit"), "edit", "edits"],
  ] as const;
  return parts.filter(([n]) => n > 0).map(([n, one, many]) => `${n} ${n === 1 ? one : many}`).join(" · ");
}

function Target({ children, file }: { children: React.ReactNode; file?: boolean }) {
  return <span className={cx("text-ch-ink", file && "underline decoration-ch-ink-subtle decoration-dotted underline-offset-4")}>{children}</span>;
}

function StepText({ step }: { step: WorkStep }) {
  switch (step.kind) {
    case "read":
      return <>Read <Target file>{step.file}{step.range && `:${step.range}`}</Target></>;
    case "search":
      return step.scope ? <>Searched <Target file>{step.scope}</Target> for {step.pattern}</> : <>Searched for {step.pattern}</>;
    case "list":
      return <>Listed <Target>{step.path}</Target></>;
    case "run":
      return <>Ran <span className="font-mono text-[0.92em]">{step.command}</span></>;
    case "edit":
      return (
        <>
          Edited <Target file>{step.file}</Target> <DiffStat added={step.added} removed={step.removed} />
        </>
      );
    case "think":
      return <>Thought for {formatDuration(step.seconds)}</>;
    case "web":
      return <>Searched the web for <Target>{step.query}</Target></>;
    case "note":
      return <>{step.label}{step.detail && <span className="text-ch-ink-subtle"> {step.detail}</span>}</>;
  }
}

function stepBody(step: WorkStep): React.ReactNode {
  if (step.kind === "think" && step.text) return <p className="text-ch-caption leading-5 whitespace-pre-wrap text-ch-ink-muted">{step.text}</p>;
  if (step.kind === "run" && step.output) return <pre className="max-h-40 overflow-auto rounded-ch-field bg-ch-sunken px-2.5 py-2 font-mono text-ch-micro leading-4 text-ch-ink-muted">{step.output}</pre>;
  if (step.kind === "note") return step.body;
  return null;
}

export function DiffStat({ added, removed, className }: { added?: number; removed?: number; className?: string }) {
  if (!added && !removed) return null;
  return (
    <span className={cx("inline-flex gap-1.5 tabular-nums", className)}>
      {!!added && <span className="text-ch-success-ink">+{added}</span>}
      {!!removed && <span className="text-ch-diff-del-ink">−{removed}</span>}
    </span>
  );
}

function Row({ item, live, timeline }: { item: Item; live: boolean; timeline: boolean }) {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const first = item.steps[0];
  const grouped = item.steps.length > 1;
  const body = grouped ? (
    <ul className="flex flex-col">
      {item.steps.map((s) => (
        <li key={s.id} className="truncate py-0.5 text-ch-caption text-ch-ink-muted">
          <StepText step={s} />
        </li>
      ))}
    </ul>
  ) : (
    stepBody(first)
  );
  const plural = PLURAL[first.kind];
  const text = grouped && plural ? <>{plural[0]} <Target>{item.steps.length} {plural[2]}</Target></> : <StepText step={first} />;
  const icon = first.kind === "note" && first.icon ? first.icon : ICONS[first.kind];
  return (
    <motion.li
      layout="position"
      initial={reduced ? false : { opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: EASE_OUT_STRONG }}
      className="relative flex flex-col"
    >
      <button
        type="button"
        disabled={!body}
        aria-expanded={body ? open : undefined}
        onClick={() => setOpen((o) => !o)}
        className={cx("group/step ch-focus flex h-7 w-full min-w-0 items-center gap-2 rounded-ch-badge text-left text-ch-body text-ch-ink-muted", body && "cursor-pointer hover:text-ch-ink")}
      >
        {timeline && (
          <span className={cx("relative z-10 grid size-5 shrink-0 place-items-center rounded-full bg-card text-ch-ink-subtle ring-1 ring-ch-line [&_svg]:size-3", live && "text-ch-ink ring-ch-ink-subtle")}>{icon}</span>
        )}
        <span className={cx("min-w-0 truncate", live && "ch-anim-shimmer")}>{text}</span>
        {body && <ChevronRight aria-hidden className={cx("size-3.5 shrink-0 text-ch-ink-subtle transition-transform duration-200", open && "rotate-90")} />}
      </button>
      {body && (
        <Collapse open={open} className={cx("pt-0.5 pb-1.5", timeline && "pl-7")}>
          {body}
        </Collapse>
      )}
    </motion.li>
  );
}

function Ticker({ step }: { step?: WorkStep }) {
  const reduced = useReducedMotion();
  return (
    <div className="relative h-7 overflow-hidden" aria-live="polite">
      <AnimatePresence initial={false} mode="popLayout">
        {step && (
          <motion.p
            key={step.id}
            initial={reduced ? false : { y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduced ? { opacity: 0 } : { y: -14, opacity: 0 }}
            transition={{ duration: 0.26, ease: EASE_OUT_STRONG }}
            className="ch-anim-shimmer absolute inset-x-0 flex h-7 items-center truncate text-ch-body text-ch-ink-muted"
          >
            <span className="truncate">
              <StepText step={step} />
            </span>
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

const HEAD: Record<WorkStatus, [string, string]> = {
  working: ["Working for", "Working"],
  done: ["Worked for", "Worked"],
  stopped: ["Stopped after", "Stopped"],
  failed: ["Failed after", "Failed"],
};

export function WorkLog({ steps, status, seconds, added, removed, variant = "rail", group = false, defaultOpen, maxHeight = 320, className }: WorkLogProps) {
  const live = status === "working";
  const elapsed = useElapsed(live);
  const [open, setOpen] = useState(defaultOpen ?? variant !== "ticker");
  const items = useMemo(() => toItems(steps, group), [steps, group]);
  const time = seconds ?? (live ? elapsed : undefined);
  const [withTime, bare] = HEAD[status];
  const timeline = variant === "timeline";
  const showTicker = variant === "ticker" && !open;

  return (
    <div data-status={status} style={{ "--tf-work-max": `${maxHeight}px` } as React.CSSProperties} className={cx("flex flex-col", className)}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="group/head ch-focus -mx-1 flex h-8 w-fit max-w-full min-w-0 cursor-pointer items-center gap-2 rounded-ch-badge px-1 text-left text-ch-body"
      >
        <ChevronDown aria-hidden className={cx("size-4 shrink-0 text-ch-ink-subtle transition-transform duration-200 group-hover/head:text-ch-ink", !open && "-rotate-90")} />
        <span className={cx("truncate text-ch-ink-muted group-hover/head:text-ch-ink", live && "ch-anim-shimmer", status === "failed" && "text-ch-diff-del-ink")}>
          {time === undefined ? bare : `${withTime} ${formatDuration(time)}`}
        </span>
        <DiffStat added={added} removed={removed} className="shrink-0" />
      </button>

      {showTicker && (
        <div className="ml-[7px] border-l border-ch-line pl-[19px]">
          {live ? <Ticker step={steps.at(-1)} /> : <p className="flex h-7 items-center truncate text-ch-caption text-ch-ink-subtle">{digest(steps)}</p>}
        </div>
      )}

      <Collapse open={open}>
        <ShadowScroll follow={live} contentClassName={cx("relative", timeline ? "pl-0" : "ml-[7px] border-l border-ch-line pl-[19px]")} className="[&>div]:max-h-[var(--tf-work-max)] [&>div]:[scrollbar-width:none]">
          {timeline && <span aria-hidden className="absolute top-3.5 bottom-3.5 left-2.5 w-px bg-ch-line" />}
          <ul className="flex flex-col py-0.5">
            {items.map((item, i) => (
              <Row key={item.id} item={item} timeline={timeline} live={live && i === items.length - 1} />
            ))}
          </ul>
        </ShadowScroll>
      </Collapse>
    </div>
  );
}

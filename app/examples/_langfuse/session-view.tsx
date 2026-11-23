"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "../_trace-kit/cn";
import type { Session } from "./model";
import { SessionHead } from "./session-head";
import { SessionStrip } from "./session-strip";
import { defaultOpen, filterTurns, hasIssues, stripOf, turnsOf, type Turn, type TurnFilter } from "./session-model";
import { TraceView } from "./trace-view";
import { TurnRow } from "./turn-row";
import type { LoadIo } from "./use-node-io";
import "../_trace-kit/trace-kit.css";
import "./session-view.css";

export type SessionViewProps = {
  session: Session;
  loadIo?: LoadIo;
  defaultOpenId?: string | null;
  className?: string;
};

export function SessionView({ session, loadIo, defaultOpenId, className }: SessionViewProps) {
  const turns = useMemo(() => turnsOf(session), [session]);
  const strip = useMemo(() => stripOf(turns), [turns]);
  const [open, setOpen] = useState<ReadonlySet<string>>(() => {
    const id = defaultOpenId === undefined ? defaultOpen(turns) : defaultOpenId;
    return new Set(id ? [id] : []);
  });
  const [filter, setFilter] = useState<TurnFilter>("all");
  const [jump, setJump] = useState(0);
  const [scroll, setScroll] = useState<{ id: string; n: number } | null>(null);
  const rows = useRef(new Map<string, HTMLLIElement>());

  const issues = turns.filter(hasIssues);
  const failed = turns.filter((turn) => turn.state === "failed");
  const targets = failed.length > 0 ? failed : issues;
  const shown = filterTurns(turns, filter);

  useEffect(() => {
    if (!scroll) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    rows.current.get(scroll.id)?.scrollIntoView({ block: "start", behavior: reduced ? "auto" : "smooth" });
  }, [scroll]);

  const reveal = (turn: Turn) => {
    if (!filterTurns(turns, filter).includes(turn)) setFilter("all");
    setOpen((current) => new Set(current).add(turn.trace.id));
    setScroll((current) => ({ id: turn.trace.id, n: (current?.n ?? 0) + 1 }));
  };

  const toggle = (id: string) =>
    setOpen((current) => {
      const next = new Set(current);
      if (!next.delete(id)) next.add(id);
      return next;
    });

  return (
    <section className={cn("tk sv", className)} aria-label="Session">
      <SessionHead
        session={session}
        turns={turns}
        jumpLabel={targets.length === 0 ? null : failed.length > 0 ? `Jump to failure${failed.length > 1 ? ` (${failed.length})` : ""}` : `Jump to error${issues.length > 1 ? ` (${issues.length})` : ""}`}
        onJump={() => {
          reveal(targets[jump % targets.length]);
          setJump((count) => count + 1);
        }}
      />
      <SessionStrip items={strip} open={open} onPick={reveal} />
      <div className="sv-toolbar">
        <div className="sv-chips" role="group" aria-label="Filter turns">
          <button type="button" className="sv-filter" aria-pressed={filter === "all"} onClick={() => setFilter("all")}>
            All turns<em>{turns.length}</em>
          </button>
          <button type="button" className="sv-filter" aria-pressed={filter === "issues"} disabled={issues.length === 0} onClick={() => setFilter("issues")}>
            With errors<em>{issues.length}</em>
          </button>
        </div>
        <button type="button" className="sv-link" disabled={open.size === 0} onClick={() => setOpen(new Set())}>Collapse all</button>
      </div>
      <ol className="sv-turns">
        {shown.map((turn) => (
          <TurnRow
            key={turn.trace.id}
            turn={turn}
            open={open.has(turn.trace.id)}
            onToggle={() => toggle(turn.trace.id)}
            rowRef={(element) => {
              if (element) rows.current.set(turn.trace.id, element);
              else rows.current.delete(turn.trace.id);
            }}
          >
            <TraceView trace={turn.trace} loadIo={loadIo} />
          </TurnRow>
        ))}
      </ol>
    </section>
  );
}

"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { cn } from "../_trace-kit/cn";
import { formatSpan } from "./format";
import type { Session } from "./model";
import { NodePanel } from "./node-panel";
import { SessionHead } from "./session-head";
import { SessionStrip } from "./session-strip";
import { defaultOpen, filterTurns, hasIssues, stripOf, turnsOf, type Turn, type TurnFilter } from "./session-model";
import { SessionSummary } from "./session-summary";
import { TraceView } from "./trace-view";
import { TurnRow } from "./turn-row";
import { useNarrow, useScrollerHeight } from "./use-layout";
import type { LoadIo } from "./use-node-io";
import { failureOrigins } from "./view-model";
import "../_trace-kit/trace-kit.css";
import "./session-view.css";

export type SessionViewProps = {
  session: Session;
  loadIo?: LoadIo;
  defaultOpenId?: string | null;
  detail?: "side" | "dock";
  className?: string;
};

type Selection = { traceId: string; nodeId: string };

const SIDE_MIN_WIDTH = 980;

export function SessionView({ session, loadIo, defaultOpenId, detail = "side", className }: SessionViewProps) {
  const turns = useMemo(() => turnsOf(session), [session]);
  const strip = useMemo(() => stripOf(turns), [turns]);
  const [open, setOpen] = useState<ReadonlySet<string>>(() => {
    const id = defaultOpenId === undefined ? defaultOpen(turns) : defaultOpenId;
    return new Set(id ? [id] : []);
  });
  const [filter, setFilter] = useState<TurnFilter>("all");
  const [jump, setJump] = useState(0);
  const [scroll, setScroll] = useState<{ id: string; n: number } | null>(null);
  const [sel, setSel] = useState<Selection | null>(null);
  const rows = useRef(new Map<string, HTMLLIElement>());
  const root = useRef<HTMLElement>(null);
  const narrow = useNarrow(root, SIDE_MIN_WIDTH);
  const scrollerHeight = useScrollerHeight(root);
  const side = detail === "side" && !narrow;

  const issues = turns.filter(hasIssues);
  const failed = turns.filter((turn) => turn.state === "failed");
  const targets = failed.length > 0 ? failed : issues;
  const shown = filterTurns(turns, filter);

  useEffect(() => {
    if (!scroll) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    rows.current.get(scroll.id)?.scrollIntoView({ block: "start", behavior: reduced ? "auto" : "smooth" });
  }, [scroll]);

  const selTurn = sel ? turns.find((turn) => turn.trace.id === sel.traceId) : undefined;
  const selNode = sel ? selTurn?.trace.nodes.find((node) => node.id === sel.nodeId) : undefined;

  const reveal = (turn: Turn, nodeId?: string) => {
    if (!filterTurns(turns, filter).includes(turn)) setFilter("all");
    setOpen((current) => new Set(current).add(turn.trace.id));
    if (nodeId) setSel({ traceId: turn.trace.id, nodeId });
    else setScroll((current) => ({ id: turn.trace.id, n: (current?.n ?? 0) + 1 }));
  };

  const changeFilter = (next: TurnFilter) => {
    setFilter(next);
    if (selTurn && !filterTurns(turns, next).includes(selTurn)) setSel(null);
  };

  const toggle = (id: string) => {
    if (open.has(id) && sel?.traceId === id) setSel(null);
    setOpen((current) => {
      const next = new Set(current);
      if (!next.delete(id)) next.add(id);
      return next;
    });
  };

  const main = (
    <div className="sv-main">
      <SessionHead
        session={session}
        turns={turns}
        jumpLabel={targets.length === 0 ? null : failed.length > 0 ? `Jump to failure${failed.length > 1 ? ` (${failed.length})` : ""}` : `Jump to error${issues.length > 1 ? ` (${issues.length})` : ""}`}
        onJump={() => {
          const turn = targets[jump % targets.length];
          reveal(turn, failureOrigins(turn.trace)[0]?.id);
          setJump((count) => count + 1);
        }}
      />
      <SessionStrip items={strip} open={open} onPick={(turn) => reveal(turn)} />
      <div className="sv-toolbar">
        <div className="sv-chips" role="group" aria-label="Filter turns">
          <button type="button" className="sv-filter" aria-pressed={filter === "all"} onClick={() => changeFilter("all")}>
            All turns<em>{turns.length}</em>
          </button>
          <button type="button" className="sv-filter" aria-pressed={filter === "issues"} disabled={issues.length === 0} onClick={() => changeFilter("issues")}>
            With errors<em>{issues.length}</em>
          </button>
        </div>
        <button
          type="button"
          className="sv-link"
          disabled={open.size === 0}
          onClick={() => {
            setOpen(new Set());
            setSel(null);
          }}
        >
          Collapse all
        </button>
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
            <TraceView
              trace={turn.trace}
              loadIo={loadIo}
              detail={side ? "none" : "dock"}
              selectedId={sel?.traceId === turn.trace.id ? sel.nodeId : null}
              onSelect={(id) => setSel(id ? { traceId: turn.trace.id, nodeId: id } : (current) => (current?.traceId === turn.trace.id ? null : current))}
            />
          </TurnRow>
        ))}
      </ol>
    </div>
  );

  return (
    <section ref={root} className={cn("tk sv", className)} aria-label="Session" data-side={side ? "" : undefined} style={scrollerHeight ? ({ "--sv-pane-h": `${scrollerHeight}px` } as CSSProperties) : undefined}>
      {side ? (
        <div className="sv-layout">
          {main}
          <aside className="sv-side" aria-label="Details">
            <div className="sv-side-in">
              {selTurn && selNode ? (
                <>
                  <button type="button" className="sv-turnref" onClick={() => reveal(selTurn)}>
                    <b>{selTurn.index + 1}</b>
                    {selTurn.trace.name}
                    <em>{selTurn.offset === 0 ? "start" : `+${formatSpan(selTurn.offset)}`}</em>
                  </button>
                  <NodePanel
                    key={selNode.id}
                    trace={selTurn.trace}
                    node={selNode}
                    loadIo={loadIo}
                    onClose={() => setSel(null)}
                    onNavigate={(id) => setSel({ traceId: selTurn.trace.id, nodeId: id })}
                  />
                </>
              ) : (
                <SessionSummary session={session} turns={turns} onPick={reveal} />
              )}
            </div>
          </aside>
        </div>
      ) : (
        main
      )}
    </section>
  );
}

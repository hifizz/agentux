"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent, MouseEvent as ReactMouseEvent, PointerEvent as ReactPointerEvent } from "react";
import { busyUntil, earliestFree, estimateOf, fmtClock, fmtMoney, previewFor, spend } from "./board-model";
import type { BoardAgent, BoardData, BoardDrag, BoardTask, DropTarget } from "./types";
import "./delegate-board.css";

export type DelegateBoardProps = BoardData & {
  title?: string;
  hint?: string;
  autoHint?: string;
  now: number;
  auto?: boolean;
  onAutoChange?: (auto: boolean) => void;
  onAssign?: (taskId: string, to: DropTarget, from: string | null) => void;
  drag?: BoardDrag | null;
  queueLimit?: number;
  className?: string;
};

const AUTO_MS = 850;
const DRAG_PX = 6;

function GripIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
      {[3, 6, 9].map((y) => [4.3, 7.7].map((x) => <circle key={`${x}${y}`} cx={x} cy={y} r="0.95" fill="currentColor" />))}
    </svg>
  );
}

function SpinIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" className="db-spin">
      <circle cx="6" cy="6" r="4.6" fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.6" />
      <path d="M6 1.4a4.6 4.6 0 0 1 4.6 4.6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
      <path d="M7 1.5 8.5 5.5 12.5 7 8.5 8.5 7 12.5 5.5 8.5 1.5 7 5.5 5.5Z" fill="currentColor" />
      <circle cx="11.8" cy="11.8" r="1" fill="currentColor" opacity="0.55" />
    </svg>
  );
}

function TaskBody({ task }: { task: BoardTask }) {
  return (
    <>
      <span className="db-grip">
        <GripIcon />
      </span>
      <span className="db-task-main">
        <span className="db-task-title" dir="auto" title={task.title}>
          {task.title}
        </span>
        <span className="db-task-meta">
          {task.tools?.length ? (
            <span className="db-tools" aria-hidden="true">
              {task.tools.map((tool, i) => (
                <span key={i} className="db-tool" title={tool.name}>
                  {tool.icon}
                </span>
              ))}
            </span>
          ) : null}
          {estimateOf(task)}
        </span>
      </span>
    </>
  );
}

export function DelegateBoard({
  title = "Delegate",
  hint = "Drag a task onto an agent",
  autoHint = "New tasks go to whoever is free first",
  tasks,
  agents,
  now,
  auto,
  onAutoChange,
  onAssign,
  drag,
  queueLimit = 4,
  className,
}: DelegateBoardProps) {
  const uid = useId();
  const pileId = `${uid}-pile`;
  const agentsId = `${uid}-agents`;
  const howId = `${uid}-how`;

  const root = useRef<HTMLDivElement>(null);
  const press = useRef<{ task: BoardTask; from: string | null; x0: number; y0: number; gx: number; gy: number; w: number; moved: boolean } | null>(null);
  const dropped = useRef(false);
  const [live, setLive] = useState<BoardDrag | null>(null);
  const [pick, setPick] = useState<{ task: BoardTask; from: string | null; target: string | null } | null>(null);
  const [autoLocal, setAutoLocal] = useState(false);
  const [announce, setAnnounce] = useState("");

  const autoOn = auto ?? autoLocal;
  const view: BoardDrag | null = drag ?? live ?? (pick ? { task: pick.task, from: pick.from, over: pick.target, picked: true } : null);

  const commit = useCallback(
    (taskId: string, to: DropTarget, from: string | null) => {
      setPick(null);
      setLive(null);
      onAssign?.(taskId, to, from);
    },
    [onAssign],
  );

  useEffect(() => {
    const overAt = (x: number, y: number, from: string | null): DropTarget | null => {
      const el = document.elementFromPoint(x, y);
      const agent = el?.closest("[data-agent]")?.getAttribute("data-agent");
      if (agent) return agent === from ? null : agent;
      if (from !== null && el?.closest("[data-pile]")) return "pile";
      return null;
    };
    const move = (e: PointerEvent) => {
      const p = press.current;
      if (!p) return;
      if (!p.moved && Math.hypot(e.clientX - p.x0, e.clientY - p.y0) < DRAG_PX) return;
      p.moved = true;
      const box = root.current?.getBoundingClientRect();
      setPick(null);
      setLive({
        task: p.task,
        from: p.from,
        over: overAt(e.clientX, e.clientY, p.from),
        ghost: box ? { x: e.clientX - box.x - p.gx, y: e.clientY - box.y - p.gy, width: p.w } : null,
      });
    };
    const up = (e: PointerEvent) => {
      const p = press.current;
      press.current = null;
      if (!p?.moved) return;
      dropped.current = true;
      window.setTimeout(() => {
        dropped.current = false;
      }, 350);
      setLive(null);
      const over = overAt(e.clientX, e.clientY, p.from);
      if (over) commit(p.task.id, over, p.from);
    };
    const cancel = () => {
      press.current = null;
      setLive(null);
    };
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && press.current?.moved) cancel();
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", cancel);
    window.addEventListener("keydown", esc);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", cancel);
      window.removeEventListener("keydown", esc);
    };
  }, [commit]);

  useEffect(() => {
    if (!autoOn || tasks.length === 0 || live) return;
    const id = window.setTimeout(() => {
      const free = earliestFree(agents, now);
      if (free) commit(tasks[0].id, free.id, null);
    }, AUTO_MS);
    return () => window.clearTimeout(id);
  }, [autoOn, tasks, agents, now, live, commit]);

  const seen = useRef<Map<string, string> | null>(null);
  useEffect(() => {
    const cur = new Map<string, string>();
    for (const t of tasks) cur.set(t.id, "pile");
    for (const a of agents) for (const t of a.queue) cur.set(t.id, a.id);
    if (seen.current) {
      let msg: string | null = null;
      for (const a of agents) {
        for (const t of a.queue) {
          if (seen.current.get(t.id) !== a.id) msg = `${t.title} → ${a.name}`;
        }
      }
      if (msg) setAnnounce(msg);
    }
    seen.current = cur;
  }, [tasks, agents]);

  const onPress = (e: ReactPointerEvent, task: BoardTask, from: string | null) => {
    if (e.button !== 0) return;
    const box = e.currentTarget.getBoundingClientRect();
    press.current = { task, from, x0: e.clientX, y0: e.clientY, gx: e.clientX - box.x, gy: e.clientY - box.y, w: box.width, moved: false };
  };

  const onKey = (e: ReactKeyboardEvent, task: BoardTask, from: string | null) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (pick?.task.id === task.id) {
        if (pick.target) commit(task.id, pick.target, from);
        else setPick(null);
      } else {
        setPick({ task, from, target: agents[0]?.id ?? null });
      }
    } else if (e.key.startsWith("Arrow") && pick?.task.id === task.id) {
      e.preventDefault();
      const ids = agents.map((a) => a.id);
      if (!ids.length) return;
      const dir = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : -1;
      const i = Math.max(0, ids.indexOf(pick.target ?? ""));
      setPick({ ...pick, target: ids[(i + dir + ids.length) % ids.length] });
    } else if (e.key === "Escape") {
      setPick(null);
    } else if (/^[1-9]$/.test(e.key)) {
      const a = agents[Number(e.key) - 1];
      if (a) commit(task.id, a.id, from);
    }
  };

  const onClickItem = (e: ReactMouseEvent, task: BoardTask, from: string | null) => {
    e.stopPropagation();
    if (dropped.current) return;
    setPick((cur) => (cur?.task.id === task.id ? null : { task, from, target: agents[0]?.id ?? null }));
  };

  const itemProps = (task: BoardTask, from: string | null) => ({
    "data-picked": view?.picked && view.task.id === task.id && view.from === from ? "" : undefined,
    "data-dragging": live && live.task.id === task.id && live.from === from ? "" : undefined,
    "aria-describedby": howId,
    onPointerDown: (e: ReactPointerEvent) => onPress(e, task, from),
    onKeyDown: (e: ReactKeyboardEvent) => onKey(e, task, from),
    onClick: (e: ReactMouseEvent) => onClickItem(e, task, from),
  });

  const agentRow = (a: BoardAgent, index: number) => {
    const until = busyUntil(a, now);
    const targeted = view?.over === a.id;
    const shown = a.queue.slice(0, queueLimit);
    const more = a.queue.slice(queueLimit);
    return (
      <li
        key={a.id}
        className="db-agent"
        data-agent={a.id}
        data-target={targeted ? "" : undefined}
        onClick={pick ? () => commit(pick.task.id, a.id, pick.from) : undefined}
      >
        <span className="db-avatar" data-logo={a.mark ? "" : undefined}>
          {a.mark ?? a.name.slice(0, 2)}
        </span>
        <span className="db-who">
          <span className="db-name-line">
            <span className="db-name" dir="auto" title={a.name}>
              {a.name}
            </span>
            <span className="db-key" aria-hidden="true">
              {index + 1}
            </span>
          </span>
          <span className="db-model">
            <span className="db-model-text" dir="auto" title={a.model}>
              {a.model}
            </span>
            <span className="db-rate">{`${fmtMoney(a.rate)}/min`}</span>
          </span>
        </span>
        <span className="db-load">
          {targeted && view ? (
            <>
              <span className="db-price">+{fmtMoney(previewFor(a, view.task, now).cost)}</span>
              <span className="db-tag" data-kind="preview">
                {`+${view.task.minutes}m until ${fmtClock(previewFor(a, view.task, now).until)}`}
              </span>
            </>
          ) : until === null ? (
            <span className="db-tag" data-kind="free">
              Free
            </span>
          ) : (
            <span className="db-tag" data-kind="busy">
              Busy until {fmtClock(until)}
            </span>
          )}
        </span>
        {a.queue.length > 0 && (
          <ul className="db-queue" aria-label={`${a.name}'s queue`}>
            {shown.map((t, i) => (
              <li className="db-chip-slot" key={t.id}>
                <button type="button" className="db-chip" data-chip={t.id} data-running={i === 0 || undefined} title={`${t.title} · ${estimateOf(t)}`} {...itemProps(t, a.id)}>
                  {i === 0 ? (
                    <SpinIcon />
                  ) : t.tools?.length ? (
                    <span className="db-tools" aria-hidden="true">
                      {t.tools.map((tool, j) => (
                        <span key={j} className="db-tool" title={tool.name}>
                          {tool.icon}
                        </span>
                      ))}
                    </span>
                  ) : null}
                  <span className="db-chip-title" dir="auto">
                    {t.title}
                  </span>
                </button>
              </li>
            ))}
            {more.length > 0 && (
              <li className="db-chip-slot db-more">
                <span className="db-chip db-chip-more" tabIndex={0}>
                  +{more.length}
                </span>
                <span className="db-tip" role="tooltip">
                  <span className="db-tip-list">
                    {more.map((t) => (
                      <span key={t.id} className="db-tip-row">
                        <span className="db-tip-title">{t.title}</span>
                        <span className="db-tip-min">{estimateOf(t)}</span>
                      </span>
                    ))}
                  </span>
                </span>
              </li>
            )}
          </ul>
        )}
      </li>
    );
  };

  return (
    <div className={`db${className ? ` ${className}` : ""}`} ref={root} data-dragging={live ? "" : undefined}>
      <div className="db-card">
        <header className="db-bar">
          <span className="db-spark">
            <SparkIcon />
          </span>
          <span className="db-title" dir="auto" title={title}>
            {title}
          </span>
          <span className="db-hint">{autoOn ? autoHint : hint}</span>
          <button
            type="button"
            role="switch"
            aria-checked={autoOn}
            className="db-auto"
            onClick={() => {
              const next = !autoOn;
              setAutoLocal(next);
              onAutoChange?.(next);
            }}
          >
            <span className="db-auto-label">Auto</span>
            <span className="db-switch" aria-hidden="true">
              <span />
            </span>
          </button>
        </header>
        <div className="db-body">
          <section
            className="db-pile"
            data-pile=""
            data-over={view?.over === "pile" ? "" : undefined}
            aria-labelledby={pileId}
            onClick={pick?.from ? () => commit(pick.task.id, "pile", pick.from) : undefined}
          >
            <h4 className="db-head" id={pileId}>
              Unassigned <span className="db-count">{tasks.length}</span>
            </h4>
            <ul className="db-tasks" data-long={tasks.length > 6 ? "" : undefined}>
              {tasks.map((t) => (
                <li className="db-task-slot" key={t.id}>
                  <button type="button" className="db-task" data-task={t.id} {...itemProps(t, null)}>
                    <TaskBody task={t} />
                  </button>
                </li>
              ))}
              {tasks.length === 0 && <li className="db-empty">Everything is handed out</li>}
            </ul>
          </section>
          <section className="db-agents" aria-labelledby={agentsId}>
            <h4 className="db-head" id={agentsId}>
              Agents <span className="db-spend">{`${fmtMoney(spend(agents))} in queues`}</span>
            </h4>
            <ul className="db-roster">{agents.map(agentRow)}</ul>
          </section>
        </div>
      </div>
      {live?.ghost && (
        <div className="db-ghost" aria-hidden="true" style={{ left: live.ghost.x, top: live.ghost.y, width: live.ghost.width }}>
          <TaskBody task={live.task} />
        </div>
      )}
      <span className="db-sr" id={howId}>
        Drag onto an agent, or press Enter, choose with the arrow keys and press Enter again. Number keys hand it over at once.
      </span>
      <span className="db-sr" aria-live="polite">
        {announce}
      </span>
    </div>
  );
}

"use client";

import {
  useEffect,
  useLayoutEffect,
  useReducer,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import {
  BadgeCheck,
  Check,
  ChevronRight,
  Inbox,
  RotateCcw,
  SquarePen,
  Undo2,
  X,
} from "lucide-react";
import { items } from "./items";
import { Avatar, Detail } from "./proposal";
import { filters, fresh, matches, reasons, reduce, sequence, waiting, type Action } from "./queue";
import "./review.css";

function KeyButton({
  children,
  shortcut,
  hint = shortcut,
  onClick,
  disabled,
  primary,
  danger,
}: {
  children: ReactNode;
  shortcut: string;
  hint?: string;
  onClick: () => void;
  disabled?: boolean;
  primary?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      className="rc-button"
      data-primary={primary || undefined}
      data-danger={danger || undefined}
      aria-keyshortcuts={shortcut}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
      <kbd>{hint}</kbd>
    </button>
  );
}

export default function Demo() {
  const [state, dispatch] = useReducer(reduce, fresh),
    [clock, setClock] = useState({ run: 0, manual: false, activity: 0 });
  const shell = useRef<HTMLElement>(null),
    stage = useRef<HTMLDivElement>(null),
    queue = useRef<HTMLUListElement>(null);
  const pending = waiting(state),
    visible = pending.filter((i) => matches(i, state.filter)),
    current = visible.find((i) => i.id === state.active),
    last = state.history.at(-1),
    reviewed = 24 + state.history.length,
    total = state.arrived ? 33 : 32;
  const rows = items.filter(
    (i) => visible.includes(i) || (i.id === state.leaving?.item.id && matches(i, state.filter)),
  );
  const touch = () => setClock((c) => ({ ...c, manual: true, activity: c.activity + 1 }));
  const restart = () => {
    dispatch({ type: "reset" });
    setClock((c) => ({ run: c.run + 1, manual: false, activity: 0 }));
  };
  useEffect(() => {
    const timers = clock.manual
      ? []
      : sequence.map(([at, action]) => setTimeout(() => dispatch(action), at));
    timers.push(setTimeout(restart, clock.manual ? 9000 : 25900));
    return () => timers.forEach(clearTimeout);
  }, [clock]);
  useEffect(() => {
    if (!state.leaving) return;
    const timer = setTimeout(() => dispatch({ type: "clearLeave" }), 550);
    return () => clearTimeout(timer);
  }, [state.leaving]);
  useEffect(() => {
    if (!state.showUndo) return;
    const timer = setTimeout(() => dispatch({ type: "hideUndo" }), 6000);
    return () => clearTimeout(timer);
  }, [last, state.showUndo]);
  useLayoutEffect(() => {
    const list = queue.current,
      row = list?.querySelector<HTMLElement>('[aria-current="true"]');
    if (!list || !row) return;
    const a = row.getBoundingClientRect(),
      b = list.getBoundingClientRect();
    if (a.bottom > b.bottom) list.scrollTop += a.bottom - b.bottom + 4;
    else if (a.top < b.top) list.scrollTop += a.top - b.top - 4;
  }, [current?.id]);
  useLayoutEffect(() => {
    const s = stage.current,
      child = s?.querySelector<HTMLElement>(".rc-detail:not([data-ghost]),.rc-empty");
    if (!s || !child) return;
    const resize = () => s.style.setProperty("--detail-height", `${child.offsetHeight}px`);
    resize();
    s.scrollTop = 0;
    const ro = new ResizeObserver(resize);
    ro.observe(child);
    return () => ro.disconnect();
  }, [current?.id, state.mode.kind]);
  function send(action: Action) {
    dispatch(action);
    if (action.type === "edit")
      requestAnimationFrame(() =>
        stage.current?.querySelector<HTMLElement>("input,textarea")?.focus({ preventScroll: true }),
      );
    else if (action.type !== "draft" && action.type !== "note" && action.type !== "cycleFlag")
      shell.current?.focus({ preventScroll: true });
  }
  function keys(e: KeyboardEvent) {
    const key = e.key.toLowerCase();
    let action: Action | undefined;
    if (key === "escape") action = { type: "cancel" };
    else if (state.mode.kind === "edit") {
      if (key === "enter" && (e.metaKey || e.ctrlKey)) action = { type: "decide" };
    } else if (key === "z" && !e.altKey) action = { type: "undo" };
    else if (e.metaKey || e.ctrlKey || e.altKey) return;
    else if (state.mode.kind === "reject") {
      if (/^[1-4]$/.test(key)) action = { type: "decide", reason: reasons[Number(key) - 1] };
    } else if (key === "a") action = { type: "decide" };
    else if (key === "e") action = { type: "edit" };
    else if (key === "r") action = { type: "reject" };
    else if (key === "s") action = { type: "skip" };
    else if (key === "f") action = { type: "cycleFlag" };
    else if (["j", "arrowdown", "k", "arrowup"].includes(key))
      action = { type: "move", by: key === "j" || key === "arrowdown" ? 1 : -1 };
    if (action) {
      e.preventDefault();
      e.stopPropagation();
      send(action);
    }
  }
  return (
    <div className="rc-view">
      <div className="rc-wrap">
        <div className="rc-frame">
          <button
            className="rc-replay"
            type="button"
            title="Replay"
            aria-label="Replay review queue"
            onClick={restart}
          >
            <RotateCcw size={14} />
          </button>
          <section
            key={clock.run}
            className="rc-center"
            tabIndex={-1}
            ref={shell}
            aria-label="Review center"
            onPointerDownCapture={touch}
            onKeyDownCapture={touch}
            onKeyDown={keys}
            onClick={(e) => {
              if (!(e.target instanceof Element && e.target.closest("button,input,textarea,mark")))
                shell.current?.focus({ preventScroll: true });
            }}
          >
            <header className="rc-head">
              <BadgeCheck className="rc-badge" size={16} />
              <b>Review center</b>
              <span className="rc-progress">
                <span className="rc-track">
                  <i style={{ width: `${(100 * reviewed) / total}%` }} />
                </span>
                <span>
                  <strong key={reviewed}>{reviewed}</strong> of {total} reviewed
                </span>
              </span>
              {pending.length > 0 && (
                <span className="rc-oldest">
                  oldest{" "}
                  <em data-late={pending.some((i) => i.minutes >= 25) || undefined}>
                    {Math.max(...pending.map((i) => i.minutes))}m
                  </em>
                </span>
              )}
              {state.showUndo && last && (
                <div key={reviewed} className="rc-undo" data-reject={last.rejected || undefined}>
                  <span>
                    {last.rejected ? <X /> : <Check />}
                    {last.label}
                  </span>
                  <button onClick={() => send({ type: "undo" })} aria-keyshortcuts="Z">
                    <Undo2 />
                    Undo <kbd>Z</kbd>
                  </button>
                </div>
              )}
            </header>
            <div className="rc-workspace">
              <aside className="rc-sidebar">
                <div className="rc-filters" role="group" aria-label="Filter the queue">
                  {filters.map((f) => (
                    <button
                      key={f}
                      aria-pressed={state.filter === f}
                      onClick={() => send({ type: "filter", filter: f })}
                    >
                      {f}
                      <small>{pending.filter((i) => matches(i, f)).length}</small>
                    </button>
                  ))}
                </div>
                <ul className="rc-queue" ref={queue} aria-label="Queue">
                  {rows.map((i, n) => {
                    const leaving = i.id === state.leaving?.item.id;
                    const wait = i.minutes ? `${i.minutes}m` : "just in";
                    return (
                      <li
                        key={i.id}
                        data-arrival={i.id === "invoice" || undefined}
                        data-leaving={leaving || undefined}
                        style={{ animationDelay: leaving ? "160ms" : `${80 + n * 20}ms` }}
                      >
                        <button
                          type="button"
                          className="rc-row"
                          tabIndex={current?.id === i.id ? 0 : -1}
                          aria-current={current?.id === i.id || undefined}
                          aria-label={`${i.title}. ${i.type}, ${i.risk} risk, ${i.confidence}% confidence, ${wait}${state.skipped.includes(i.id) ? ", skipped" : ""}`}
                          onClick={() => send({ type: "select", id: i.id })}
                        >
                          <Avatar item={i} />
                          <span className="rc-row-content">
                            <span className="rc-row-top">
                              <b>{i.title}</b>
                              {leaving ? (
                                <i
                                  className="rc-stamp"
                                  data-reject={state.leaving?.rejected || undefined}
                                >
                                  {state.leaving?.rejected ? <X /> : <Check />}
                                </i>
                              ) : (
                                <small data-late={i.minutes >= 25 || undefined}>{i.minutes ? wait : "now"}</small>
                              )}
                            </span>
                            <span className="rc-row-type">
                              {i.type}
                              {state.skipped.includes(i.id) && " · skipped"}
                            </span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                  {!rows.length && (
                    <li className="rc-none">
                      {pending.length ? "Nothing matches this filter" : "Nothing waiting"}
                    </li>
                  )}
                </ul>
              </aside>
              <div className="rc-main">
                <div ref={stage} className="rc-stage">
                  {state.leaving && (
                    <Detail
                      key={`leaving-${state.leaving.item.id}`}
                      item={state.leaving.item}
                      mode={{ kind: "view" }}
                      flag={null}
                      send={dispatch}
                      entrance="away"
                      ghost
                    />
                  )}
                  {current ? (
                    <Detail
                      key={current.id}
                      item={current}
                      mode={state.mode}
                      flag={state.flag}
                      send={dispatch}
                      entrance={state.entrance}
                    />
                  ) : (
                    <div className="rc-empty">
                      <span className="rc-empty-icon">{pending.length ? <Inbox size={20} /> : <BadgeCheck size={20} />}</span>
                      <b>{pending.length ? "Nothing matches this filter" : "All caught up"}</b>
                      <span>
                        {pending.length
                          ? `${pending.length} more in the queue under All`
                          : `${reviewed} of ${total} reviewed · New requests will appear here`}
                      </span>
                    </div>
                  )}
                </div>
                <div className="rc-actions">
                  <div
                    key={state.mode.kind}
                    className="rc-buttons"
                    data-decision={
                      state.leaving ? (state.leaving.rejected ? "rejected" : "approved") : undefined
                    }
                    role="group"
                    aria-label={
                      state.mode.kind === "reject" ? "Rejection reason" : "Review actions"
                    }
                  >
                    {state.mode.kind === "view" ? (
                      <>
                        <KeyButton
                          primary
                          shortcut="A"
                          disabled={!current}
                          onClick={() => send({ type: "decide" })}
                        >
                          <Check />
                          Approve
                        </KeyButton>
                        <KeyButton
                          shortcut="E"
                          disabled={current?.proposal.kind !== "text"}
                          onClick={() => send({ type: "edit" })}
                        >
                          <SquarePen />
                          Edit
                        </KeyButton>
                        <KeyButton
                          danger
                          shortcut="R"
                          disabled={!current}
                          onClick={() => send({ type: "reject" })}
                        >
                          <X />
                          Reject
                        </KeyButton>
                        <KeyButton
                          shortcut="S"
                          disabled={visible.length < 2}
                          onClick={() => send({ type: "skip" })}
                        >
                          <ChevronRight />
                          Skip
                        </KeyButton>
                      </>
                    ) : state.mode.kind === "edit" ? (
                      <>
                        <KeyButton
                          primary
                          shortcut="Meta+Enter Control+Enter"
                          hint="⌘↵"
                          onClick={() => send({ type: "decide" })}
                        >
                          <Check />
                          Approve with edits
                        </KeyButton>
                        <KeyButton
                          shortcut="Escape"
                          hint="Esc"
                          onClick={() => send({ type: "cancel" })}
                        >
                          <X />
                          Cancel
                        </KeyButton>
                      </>
                    ) : (
                      <>
                        <b>Why?</b>
                        {reasons.map((r, i) => (
                          <button
                            className="rc-reason"
                            key={r}
                            aria-keyshortcuts={String(i + 1)}
                            onClick={() => send({ type: "decide", reason: r })}
                          >
                            <kbd>{i + 1}</kbd>
                            {r}
                          </button>
                        ))}
                        <button className="rc-dismiss" onClick={() => send({ type: "cancel" })}>
                          Esc
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <span className="sr-only" aria-live="polite">
              {state.announcement}
            </span>
          </section>
        </div>
      </div>
    </div>
  );
}

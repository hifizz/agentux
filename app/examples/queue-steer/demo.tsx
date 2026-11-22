"use client";

import { useEffect, useReducer, useState } from "react";
import { Check, CornerDownRight, ListEnd, LoaderCircle, Square } from "lucide-react";
import Stage from "@/components/examples/Stage";
import { cx } from "@/app/examples/_shared/ui/cx";
import { DEFAULT_DEMO_SELECTION, DEMO_MODELS, type ModelSelection } from "@/app/examples/_shared/models";
import { PromptComposer, type BusyMode, type QueuedMessage, type Strip } from "../prompt-composer/composer";

const PLAN = ["Read the queue strip", "Add an edit row", "Wire onEdit through the demos", "Run the lint"];
const FOLLOW = ["Read the request", "Make the change", "Check the result"];
const TICK = 1600;

type Entry = { id: number; kind: "prompt" | "step" | "steer" | "note"; text: string };
type State = { log: readonly Entry[]; pending: readonly string[]; queue: readonly QueuedMessage[]; n: number };
type Action =
  | { type: "tick" }
  | { type: "submit"; text: string; mode: BusyMode | null }
  | { type: "edit"; id: string; text: string }
  | { type: "steer"; id: string }
  | { type: "remove"; id: string }
  | { type: "stop" }
  | { type: "reset" };

const INITIAL: State = {
  log: [
    { id: 0, kind: "prompt", text: "Let people edit queued messages" },
    { id: 1, kind: "step", text: PLAN[0] },
  ],
  pending: PLAN.slice(1),
  queue: [
    { id: "q0", text: "Use a pencil icon for edit", mode: "queue" },
    { id: "q1", text: "Then update the docs page", mode: "queue" },
  ],
  n: 2,
};

function push(s: State, kind: Entry["kind"], text: string): State {
  return { ...s, log: [...s.log, { id: s.n, kind, text }], n: s.n + 1 };
}

function start(s: State, text: string): State {
  return { ...push(s, "prompt", text), pending: FOLLOW };
}

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case "tick": {
      if (!s.pending.length) return s;
      const [step, ...rest] = s.pending;
      let next = push({ ...s, pending: rest }, "step", step);
      const steers = next.queue.filter((m) => m.mode === "steer");
      if (steers.length) {
        for (const m of steers) next = push(next, "steer", m.text);
        return { ...next, queue: next.queue.filter((m) => m.mode !== "steer"), pending: [...steers.map((m) => `Adjust for: ${m.text}`), ...rest] };
      }
      if (rest.length) return next;
      next = push(next, "note", "Run finished");
      const [head, ...tail] = next.queue;
      return head ? start({ ...next, queue: tail }, head.text) : next;
    }
    case "submit": {
      if (!s.pending.length) return start(s, a.text);
      return { ...s, queue: [...s.queue, { id: `q${s.n}`, text: a.text, mode: a.mode ?? "queue" }], n: s.n + 1 };
    }
    case "edit":
      return { ...s, queue: s.queue.map((m) => (m.id === a.id ? { ...m, text: a.text } : m)) };
    case "steer":
      return { ...s, queue: s.queue.map((m) => (m.id === a.id ? { ...m, mode: "steer" } : m)) };
    case "remove":
      return { ...s, queue: s.queue.filter((m) => m.id !== a.id) };
    case "stop":
      return s.pending.length ? push({ ...s, pending: [] }, "note", "Stopped, the queue is kept") : s;
    case "reset":
      return INITIAL;
  }
}

function Row({ entry }: { entry: Entry }) {
  if (entry.kind === "prompt")
    return <li className="mt-3 ml-auto max-w-[80%] rounded-ch-card bg-ch-sunken px-3 py-1.5 text-ch-body text-ch-ink first:mt-0">{entry.text}</li>;
  if (entry.kind === "note") return <li className="py-1 text-ch-caption text-ch-ink-subtle">{entry.text}</li>;
  const steer = entry.kind === "steer";
  return (
    <li className={cx("flex items-center gap-2 py-1 text-ch-body", steer ? "text-ch-ink" : "text-ch-ink-muted")}>
      {steer ? <CornerDownRight aria-hidden className="size-3.5 shrink-0" /> : <Check aria-hidden className="size-3.5 shrink-0 text-ch-ink-subtle" />}
      {steer && <span className="shrink-0 text-ch-caption text-ch-ink-subtle">Steered</span>}
      <span className="truncate">{entry.text}</span>
    </li>
  );
}

export default function Demo() {
  const [state, dispatch] = useReducer(reducer, INITIAL);
  const [model, setModel] = useState<ModelSelection>(DEFAULT_DEMO_SELECTION);
  const busy = state.pending.length > 0;

  useEffect(() => {
    if (!busy) return;
    const id = setTimeout(() => dispatch({ type: "tick" }), TICK);
    return () => clearTimeout(id);
  }, [busy, state.log.length]);

  const steering = state.queue.filter((m) => m.mode === "steer").length;
  const strips: Strip[] = state.queue.length
    ? [
        {
          kind: "queue",
          messages: state.queue,
          onSteer: (id) => dispatch({ type: "steer", id }),
          onEdit: (id, text) => dispatch({ type: "edit", id, text }),
          onRemove: (id) => dispatch({ type: "remove", id }),
        },
      ]
    : [];
  const status = busy ? `Running · ${state.queue.length} queued${steering ? ` · ${steering} to steer` : ""}` : state.queue.length ? `Idle · ${state.queue.length} queued` : "Idle";

  return (
    <Stage status={status} onReplay={() => dispatch({ type: "reset" })} replayLabel="Reset">
      <ul aria-label="Run" aria-live="polite" className="flex flex-1 flex-col">
        {state.log.map((e) => (
          <Row key={e.id} entry={e} />
        ))}
        {busy && (
          <li className="flex items-center gap-2 py-1 text-ch-body text-ch-ink">
            <LoaderCircle aria-hidden className="size-3.5 shrink-0 motion-safe:animate-spin" />
            <span className="truncate">{state.pending[0]}</span>
          </li>
        )}
      </ul>
      <div className="flex items-center gap-3 px-1 text-ch-caption text-ch-ink-subtle">
        <span className="flex items-center gap-1"><ListEnd aria-hidden className="size-3" /> Queue waits for the run to end</span>
        <span className="flex items-center gap-1"><CornerDownRight aria-hidden className="size-3" /> Steer joins after the current step</span>
        <span className="flex items-center gap-1"><Square aria-hidden className="size-3" /> Stop keeps the queue</span>
      </div>
      <PromptComposer
        placeholder={busy ? "Queue or steer a follow-up" : "Ask the agent to build something"}
        onSubmit={(s) => dispatch({ type: "submit", text: s.text, mode: s.whenBusy })}
        busy={busy}
        busyPolicy="steerable"
        onStop={() => dispatch({ type: "stop" })}
        model={{ catalog: DEMO_MODELS, value: model, onChange: setModel }}
        strips={strips}
      />
    </Stage>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { RotateCcw } from "lucide-react";
import { AiStatus } from "./ai-status";
import { PromptComposer, type PermissionMode, type QueuedMessage, type Strip, type Submission } from "./composer";
import { CONTEXT, useDirectory, useHost, useRepo } from "./fixtures";
import { DEFAULT_DEMO_SELECTION, DEMO_MODELS, type ModelSelection } from "@/app/examples/_shared/models";

const THINK_MS = 1400;
const WORD_MS = 40;

const ANSWERS = [
  "Read the composer as a stack of parts. The card owns the textarea and the Enter rule, the pickers own their menus, and the root only keeps state and builds one submission.",
  "Send something while I am still writing and it lands in the queue strip above the card. Flip Steer on and the next message jumps into the current run instead.",
  "Every control is one object. Pass model, permission, attach, strips or tray and it appears. Leave it out and the composer stays quiet.",
];

const CHANGED = [
  { path: "app/examples/prompt-composer/demo.tsx", add: 42, del: 8 },
  { path: "lib/components.ts", add: 12, del: 2 },
];

type Phase = "thinking" | "writing" | "done" | "stopped";

type Message = {
  id: number;
  prompt: string;
  meta: string;
  answer: string;
  shown: number;
  phase: Phase;
};

const SPRING = { type: "spring", duration: 0.5, bounce: 0.15 } as const;

function describe(submission: Submission) {
  const model = DEMO_MODELS.find((m) => m.key === submission.model?.key)?.name ?? "Model";
  const files = submission.attachments.length ? ` · ${submission.attachments.length} file${submission.attachments.length > 1 ? "s" : ""}` : "";
  return `${model} · ${submission.permission ?? "ask"}${files}`;
}

export default function Demo() {
  const reduced = !!useReducedMotion();
  const [messages, setMessages] = useState<Message[]>([]);
  const [queue, setQueue] = useState<QueuedMessage[]>([]);
  const [model, setModel] = useState<ModelSelection>(DEFAULT_DEMO_SELECTION);
  const [permission, setPermission] = useState<PermissionMode>("edit");
  const [changes, setChanges] = useState(false);
  const turn = useRef(0);
  const scroller = useRef<HTMLDivElement>(null);
  const live = messages.at(-1);
  const busy = live?.phase === "thinking" || live?.phase === "writing";
  const directory = useDirectory();
  const repo = useRepo();
  const host = useHost(busy ? "running" : "ready");
  const spent = messages.reduce((n, m) => n + 600 + m.shown * 2, 0);
  const context = { ...CONTEXT, segments: CONTEXT.segments.map((s) => (s.id === "messages" ? { ...s, tokens: s.tokens + spent } : s)) };

  const start = (prompt: string, meta: string) => {
    const id = ++turn.current;
    setMessages((list) => [...list, { id, prompt, meta, answer: ANSWERS[(id - 1) % ANSWERS.length], shown: 0, phase: "thinking" }]);
  };

  const drain = () => {
    const [next, ...rest] = queue;
    if (!next) return;
    setQueue(rest);
    start(next.text, next.mode === "steer" ? "steered into the run" : "from the queue");
  };

  useEffect(() => {
    if (!live || !busy) return;
    const update = (patch: Partial<Message>) => setMessages((list) => list.map((m) => (m.id === live.id ? { ...m, ...patch } : m)));
    const words = live.answer.split(" ").length;
    const tick = () => {
      if (live.phase === "thinking") return update({ phase: "writing" });
      const shown = reduced ? words : live.shown + 1;
      if (shown < words) return update({ shown });
      update({ shown, phase: "done" });
      setChanges(true);
      drain();
    };
    const timer = setTimeout(tick, live.phase === "thinking" ? (reduced ? 200 : THINK_MS) : WORD_MS);
    return () => clearTimeout(timer);
  });

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: reduced ? "auto" : "smooth" });
  }, [messages, reduced]);

  const submit = (submission: Submission) => {
    if (submission.whenBusy) {
      setQueue((list) => [...list, { id: crypto.randomUUID(), text: submission.text, mode: submission.whenBusy ?? "queue" }]);
      return;
    }
    start(submission.text, describe(submission));
  };

  const stop = () => {
    setMessages((list) => list.map((m) => (m.id === live?.id ? { ...m, phase: "stopped" } : m)));
    drain();
  };

  const reset = () => {
    setMessages([]);
    setQueue([]);
    setChanges(false);
  };

  const strips: Strip[] = [
    { kind: "usage", percent: 72 },
    ...(changes ? [{ kind: "changes", files: CHANGED } as const] : []),
    ...(queue.length
      ? [
          {
            kind: "queue",
            messages: queue,
            onSteer: (id: string) => setQueue((list) => list.map((m) => (m.id === id ? { ...m, mode: "steer" } : m))),
            onRemove: (id: string) => setQueue((list) => list.filter((m) => m.id !== id)),
          } as const,
        ]
      : []),
  ];

  return (
    <div className="tf-chat flex h-full flex-col bg-ch-page text-ch-ink">
      <div className="flex items-center justify-between px-5 pt-4">
        <p className="text-sm font-medium text-ch-ink-muted">Agent session</p>
        <button
          type="button"
          onClick={reset}
          disabled={messages.length === 0}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-ch-ink-muted hover:bg-ch-ghost-hover hover:text-ch-ink disabled:pointer-events-none disabled:opacity-40"
        >
          <RotateCcw size={14} aria-hidden="true" /> New chat
        </button>
      </div>

      <div ref={scroller} aria-label="Conversation" className="no-scrollbar flex-1 overflow-y-auto px-5 py-4">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
            <p className="font-runde text-2xl font-semibold">What should the agent do?</p>
            <p className="max-w-sm text-sm text-ch-ink-muted">Pick a model, effort and permission, attach a file, then send. Send again while it writes to queue or steer.</p>
          </div>
        ) : (
          <ol className="mx-auto flex max-w-2xl flex-col gap-6">
            <AnimatePresence initial={false}>
              {messages.map((m) => (
                <motion.li key={m.id} initial={reduced ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={SPRING} className="flex flex-col gap-3">
                  <div className="ml-auto max-w-[85%] rounded-2xl bg-ch-tonal px-4 py-2.5 text-sm">
                    <p className="whitespace-pre-wrap">{m.prompt}</p>
                    <p className="mt-1 text-xs text-ch-ink-subtle">{m.meta}</p>
                  </div>
                  <AiStatus state={m.phase === "stopped" ? "error" : m.phase} label={m.phase === "stopped" ? "Stopped" : undefined} timer />
                  {m.shown > 0 && <p className="text-sm leading-relaxed text-ch-ink">{m.answer.split(" ").slice(0, m.shown).join(" ")}</p>}
                </motion.li>
              ))}
            </AnimatePresence>
          </ol>
        )}
      </div>

      <div className="mx-auto w-full max-w-2xl px-4 pb-4">
        <PromptComposer
          placeholder={busy ? "Queue a follow-up" : "Ask the agent to build something"}
          onSubmit={submit}
          busy={busy}
          busyPolicy="steerable"
          onStop={stop}
          attach={{}}
          model={{ catalog: DEMO_MODELS, value: model, onChange: setModel }}
          permission={{ value: permission, onChange: setPermission }}
          strips={strips}
          context={context}
          tray={{ directory, repo, host }}
        />
      </div>
    </div>
  );
}

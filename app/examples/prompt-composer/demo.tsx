"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { RotateCcw } from "lucide-react";
import { AiStatus } from "./ai-status";
import {
  PromptBox,
  type PromptBoxStatus,
  type PromptEffort,
} from "./prompt-box";

const PLACEHOLDERS = [
  "Ask anything",
  "Plan a weekend in Kyoto",
  "Explain springs like I'm five",
  "Draft a launch tweet",
];

const THINK_MS: Record<string, number> = {
  quick: 500,
  think: 1800,
  deep: 3400,
};

const ANSWERS: Record<string, string[]> = {
  quick: [
    "Quick answer, straight off the top. Hold send a little longer next time and I'll think it through first.",
    "Here's the short version. For anything tricky, hold the button until it turns amber.",
  ],
  think: [
    "I gave this a moment of thought before answering. Holding send told me it was worth more than a quick reply, so I weighed a couple of options first.",
    "Thought about it for a bit. Keep holding past amber to orange and I'll go even deeper next time.",
  ],
  deep: [
    "You held all the way to orange, so I took my time. I broke the question into parts, checked each one, and only then wrote this. Long holds are for the questions that deserve them.",
    "Deep mode. I worked through this step by step before replying, which is slower but more careful. Tap for speed, hold for depth.",
  ],
};

const WORD_MS = 45;

type Phase = "thinking" | "writing" | "done" | "stopped";

type Message = {
  id: number;
  prompt: string;
  effort: PromptEffort;
  answer: string;
  phase: Phase;
};

const SPRING = { type: "spring", duration: 0.5, bounce: 0.15 } as const;

function statusFor({ phase, effort }: Message) {
  if (phase === "thinking") {
    return {
      state: "thinking",
      label: effort.id === "deep" ? "Thinking deeply" : undefined,
    };
  }
  if (phase === "writing") return { state: "writing", label: undefined };
  if (phase === "stopped") return { state: "error", label: "Stopped" };
  return { state: "done", label: undefined };
}

export default function PromptBoxDemo() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState<PromptBoxStatus>("idle");
  const [draft, setDraft] = useState("");
  const timers = useRef<number[]>([]);
  const count = useRef(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const threadRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const transition = reduceMotion ? { duration: 0 } : SPRING;

  useEffect(() => () => timers.current.forEach(window.clearTimeout), []);

  useEffect(() => {
    const thread = threadRef.current;
    if (thread) thread.scrollTop = thread.scrollHeight;
  }, [messages]);

  const update = (id: number, patch: Partial<Message>) =>
    setMessages((list) =>
      list.map((m) => (m.id === id ? { ...m, ...patch } : m)),
    );

  const handleSubmit = (prompt: string, effort: PromptEffort) => {
    timers.current.forEach(window.clearTimeout);
    count.current += 1;
    const id = count.current;
    const pool = ANSWERS[effort.id] ?? ANSWERS.quick;
    const words = pool[id % pool.length].split(" ");
    const writeAt = THINK_MS[effort.id] ?? 1000;

    setMessages((list) => [...list, { id, prompt, effort, answer: "", phase: "thinking" }]);
    setStatus("streaming");
    timers.current = [
      ...words.map((_, i) =>
        window.setTimeout(
          () =>
            update(id, {
              phase: "writing",
              answer: words.slice(0, i + 1).join(" "),
            }),
          writeAt + i * WORD_MS,
        ),
      ),
      window.setTimeout(
        () => {
          update(id, { phase: "done" });
          setStatus("idle");
          timers.current = [];
        },
        writeAt + words.length * WORD_MS + 200,
      ),
    ];
  };

  const handleStop = () => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
    setMessages((list) =>
      list.map((m) =>
        m.phase === "thinking" || m.phase === "writing"
          ? { ...m, phase: "stopped" }
          : m,
      ),
    );
    setStatus("idle");
  };

  const handleReset = () => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
    setMessages([]);
    setDraft("");
    setStatus("idle");
    inputRef.current?.focus();
  };

  const empty = messages.length === 0;

  return (
    <div className="relative flex h-full flex-col items-center px-3 pt-4 pb-4 sm:px-6 sm:pb-7">
      <div className="flex min-h-9 w-full justify-end">
        {!empty && (
          <button type="button" onClick={handleReset} className="flex cursor-pointer items-center gap-2 rounded-full border border-foreground/10 px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground">
            <RotateCcw size={13} aria-hidden="true" /> New chat
          </button>
        )}
      </div>
      <div className="flex min-h-0 w-[560px] max-w-full flex-1 flex-col gap-3">
        {empty ? (
          <div className="flex flex-1 flex-col items-center justify-end gap-2 pb-4 text-center">
            <h2 className="font-runde text-xl font-bold tracking-tight sm:text-2xl">
              What are you working on?
            </h2>
            <p className="text-xs text-muted-foreground sm:text-sm">Hold Send to change the depth of the reply.</p>
          </div>
        ) : (
          <div
            ref={threadRef}
            aria-label="Conversation"
            className="-mx-2 min-h-0 flex-1 overflow-y-auto px-2 pt-4 pb-3"
          >
            <div className="flex min-h-full flex-col justify-end gap-7">
              {messages.map((message) => {
                const { state, label } = statusFor(message);
                return (
                  <motion.div
                    key={message.id}
                    initial={reduceMotion ? false : { opacity: 0, y: 12, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={transition}
                    className="flex flex-col gap-3"
                  >
                    <div className="flex flex-col items-end gap-1.5">
                      <p className="max-w-[85%] rounded-[20px] bg-black/[0.05] px-4 py-2.5 font-runde text-[15px] leading-6 whitespace-pre-wrap wrap-anywhere dark:bg-white/[0.08]">
                        {message.prompt}
                      </p>
                      <span className="flex items-center gap-1.5 pr-2 font-runde text-xs font-medium text-[#868593]">
                        <span
                          className="size-1.5 rounded-full bg-current"
                          style={{ color: message.effort.color }}
                        />
                        {message.effort.label}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <AiStatus state={state} label={label} />
                      <AnimatePresence initial={false}>
                        {message.answer && (
                          <motion.p
                            initial={reduceMotion ? false : { opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            transition={transition}
                            className="font-runde text-[15px] leading-6 text-foreground/90"
                          >
                            {message.answer}
                          </motion.p>
                        )}
                      </AnimatePresence>
                      <span className="sr-only" role="status">
                        {message.phase === "done" ? message.answer : ""}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        <motion.div layout={reduceMotion ? false : "position"} transition={transition}>
          <PromptBox
            className="w-full"
            placeholder={PLACEHOLDERS}
            value={draft}
            onValueChange={setDraft}
            inputRef={inputRef}
            inputProps={{ "aria-label": "Prompt", maxLength: 4000 }}
            status={status}
            onSubmit={handleSubmit}
            onStop={handleStop}
          />
        </motion.div>

        {empty && <div className="flex-1" />}
      </div>
    </div>
  );
}

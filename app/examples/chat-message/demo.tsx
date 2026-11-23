"use client";

import { useState } from "react";
import Stage from "@/components/examples/Stage";
import { useSteps, useStream } from "@/components/examples/use-script";
import { assistant, call, index, result, slot, usage } from "../_fixtures/pi";
import { ToolHost } from "../_fixtures/tool-host";
import { AssistantMessage } from "../_pi-ui/messages/assistant-message";
import { UserMessage } from "../_pi-ui/messages/user-message";

const PROMPT = "Why does the queue strip flicker when a reply finishes?";
const THOUGHT = "The strip unmounts when the queue is empty and mounts again when the next message is taken. I should check where the queue is drained before guessing.";
const ANSWER = `The queue is drained inside an effect, so the strip renders once with the old queue and once with the new one.

### What to change

1. Move the drain into the tick that ends the reply.
2. Keep the strip mounted while \`busy\` is true.

\`\`\`ts
function finish(id: number) {
  setMessages((list) => list.map((m) => (m.id === id ? { ...m, phase: "done" } : m)));
  drain();
}
\`\`\`

After that the strip only animates when a message is added or taken.`;

const READ = call("m-read", "read", { path: "app/examples/prompt-composer/demo.tsx", offset: 64, limit: 6 });
const PLAN = call("m-plan", "update_plan", { plan: [
  { step: "Trace the queue updates", status: "in_progress" },
  { step: "Explain the extra render", status: "pending" },
] });
const GREP = call("m-grep", "bash", { command: 'rg -n "setQueue" app/examples/prompt-composer' });
const READ_OUT = `  useEffect(() => {
    if (busy || queue.length === 0) return;
    const [next, ...rest] = queue;
    setQueue(rest);
    send(next.text);
  }, [busy, queue]);`;
const GREP_OUT = `demo.tsx:67:    setQueue(rest);
demo.tsx:93:    setQueue((list) => [...list, { id: nextId(), text }]);`;
const TOOL_DELAYS = [900, 800];

function Turn({ stopped }: { stopped: boolean }) {
  const thought = useStream(THOUGHT, !stopped);
  const tools = useSteps(TOOL_DELAYS, thought.done && !stopped);
  const answer = useStream(ANSWER, tools >= 2 && !stopped);
  const done = answer.done;
  const cancelled = (id: string, name: string) => result(id, name, "Cancelled", { isError: true });

  const results = [
    ...(thought.done ? [result(PLAN.id, PLAN.name, "Plan updated")] : []),
    ...(tools >= 1 ? [result(READ.id, "read", READ_OUT)] : stopped && thought.done ? [cancelled(READ.id, "read")] : []),
    ...(tools >= 2 ? [result(GREP.id, "bash", GREP_OUT)] : stopped && thought.done ? [cancelled(GREP.id, "bash")] : []),
  ];
  const slots = stopped ? [] : [...(tools < 1 ? [slot(READ.id, "read", "running")] : []), ...(tools < 2 ? [slot(GREP.id, "bash", tools < 1 ? "pending" : "running")] : [])];

  const message = assistant(
    [{ type: "thinking", thinking: thought.text }, ...(thought.done ? [PLAN, READ, GREP] : []), ...(tools >= 2 ? [{ type: "text" as const, text: answer.text }] : [])],
    { stopReason: stopped ? "aborted" : "stop", durationMs: 8400, usage: usage(3120) },
  );

  return (
    <ToolHost>
      <UserMessage message={{ role: "user", content: PROMPT, timestamp: 0 }} />
      <AssistantMessage message={message} index={index(results, slots)} streaming={!done && !stopped} />
    </ToolHost>
  );
}

export default function Demo() {
  const [run, setRun] = useState(0);
  const [stopped, setStopped] = useState(false);
  return (
    <Stage
      status={stopped ? "Stopped before finishing" : "One turn: reasoning, tool calls, answer, footer"}
      actions={[{ label: "Stop", onClick: () => setStopped(true) }]}
      onReplay={() => {
        setStopped(false);
        setRun((n) => n + 1);
      }}
    >
      <Turn key={run} stopped={stopped} />
    </Stage>
  );
}

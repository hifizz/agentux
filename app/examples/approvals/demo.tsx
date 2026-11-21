"use client";

import { useState } from "react";
import Stage from "@/components/examples/Stage";
import type { PiAnswer, PiInteraction, PiInteractionRequest } from "../_shared/pi/wire";
import { InteractionStack } from "../_pi-ui/interactions";

const item = (callId: string, conversationId: number, request: PiInteractionRequest): PiInteraction => ({
  id: `${conversationId}:${callId}`,
  conversationId,
  callId,
  taskId: 1,
  createdAt: 0,
  request,
  state: { status: "pending" },
});

const PENDING: PiInteraction[] = [
  item("bash", 1, { kind: "approval", tool: "bash", arguments: { command: "git push origin feat/composer" } }),
  item("edit", 1, {
    kind: "approval",
    tool: "edit",
    arguments: { path: "app/examples/prompt-composer/demo.tsx", edits: [{ oldText: '  busyPolicy="queue"', newText: '  busyPolicy="steerable"' }] },
  }),
  item("write", 2, { kind: "approval", tool: "write", arguments: { path: "notes/release.md", content: "# 0.2.0\n\n- Composer keeps its height while a menu is open\n- Queue strip no longer flickers" } }),
  item("pick", 1, { kind: "question", question: "Which branch should the pull request target?", options: ["main", "release/0.2"] }),
  item("free", 2, { kind: "question", question: "What should the release note say about the queue fix?", options: [] }),
];

const whoOf = (conversationId: number) => (conversationId === 2 ? "Release notes agent" : undefined);
const subject = (i: PiInteraction) => (i.request.kind === "approval" ? i.request.tool : "question");
const outcome = (answer: PiAnswer) => (answer.kind === "question" ? `Answered "${answer.text}"` : answer.always ? "Always allowed" : answer.allow ? "Allowed" : "Denied");

function Cards({ onStatus }: { onStatus: (text: string) => void }) {
  const [items, setItems] = useState(PENDING);
  const respond = async (id: string, answer: PiAnswer) => {
    await new Promise((done) => window.setTimeout(done, 350));
    const target = items.find((i) => i.id === id);
    setItems((list) => list.filter((i) => i.id !== id));
    if (target) onStatus(`${outcome(answer)}: ${subject(target)}`);
  };
  if (items.length === 0) return <p className="text-center text-ch-body text-ch-ink-subtle">Nothing is waiting for you.</p>;
  return <InteractionStack interactions={items} whoOf={whoOf} respond={respond} />;
}

export default function Demo() {
  const [run, setRun] = useState(0);
  const [status, setStatus] = useState("Five requests are waiting");
  return (
    <Stage
      status={status}
      replayLabel="Reset"
      onReplay={() => {
        setStatus("Five requests are waiting");
        setRun((n) => n + 1);
      }}
    >
      <Cards key={run} onStatus={setStatus} />
    </Stage>
  );
}

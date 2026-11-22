"use client";

import { useState } from "react";
import Stage from "@/components/examples/Stage";
import { PromptInput, SendButton, TopTray, type QueuedMessage, type Strip, type StripKind } from "../prompt-composer/composer";
import { CHANGED, QUEUED } from "../prompt-composer/fixtures";

const KINDS: readonly StripKind[] = ["usage", "queue", "goal", "changes"];
const LABEL: Record<StripKind, string> = { usage: "Usage", queue: "Queue", goal: "Goal", changes: "Changes" };

export default function Demo() {
  const [kind, setKind] = useState<StripKind | null>("queue");
  const [queue, setQueue] = useState<readonly QueuedMessage[]>(QUEUED);
  const [dismissed, setDismissed] = useState(false);
  const [text, setText] = useState("");
  const strip: Strip | undefined =
    kind === "usage"
      ? { kind, percent: 82 }
      : kind === "queue" && queue.length
        ? { kind, messages: queue, onRemove: (id) => setQueue((q) => q.filter((m) => m.id !== id)), onSteer: (id) => setQueue((q) => q.map((m) => (m.id === id ? { ...m, mode: "steer" } : m))) }
        : kind === "goal"
          ? { kind, text: "Split the composer into Base UI parts", status: "active", onClear: () => setKind(null) }
          : kind === "changes"
            ? { kind, files: CHANGED }
            : undefined;
  return (
    <Stage
      align="center"
      status={strip ? `${LABEL[strip.kind]} strip` : "No strip, the tray folds away"}
      actions={KINDS.map((k) => ({ label: LABEL[k], pressed: kind === k, onClick: () => { setKind(kind === k ? null : k); setDismissed(false); } }))}
      onReplay={() => { setQueue(QUEUED); setKind("queue"); setDismissed(false); }}
      replayLabel="Reset"
    >
      <div className="@container flex flex-col">
        <TopTray strip={strip} collapsed={strip?.kind === "usage" && dismissed} onDismissUsage={() => setDismissed(true)} />
        <div className={strip ? "-mt-4" : undefined}>
          <PromptInput value={text} onChange={setText} placeholder="Ask a follow-up" end={<SendButton canSend={!!text.trim()} onSend={() => setText("")} />} />
        </div>
      </div>
    </Stage>
  );
}

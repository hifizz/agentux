"use client";

import { useState } from "react";
import Stage from "@/components/examples/Stage";
import { useStream } from "@/components/examples/use-script";
import "../_pi-ui/ai-message-bubble.css";
import { ThinkingBlock } from "../_pi-ui/blocks/thinking-block";

const LIVE = `The user wants the composer to keep its height while the model picker opens.

- The picker is portalled, so it cannot push the card.
- The strip above the card animates height, which is the likely cause.

I will measure the strip first, then decide whether to pin the card.`;
const PAST = "Checked the three call sites. Only the Projects page passes `density`, so the default is safe to change.";

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-ch-caption text-ch-ink-subtle">{children}</p>;
}

function Blocks() {
  const live = useStream(LIVE, true, 3, 30);
  return (
    <>
      <div className="flex flex-col gap-1.5">
        <Label>{live.done ? "Finished: shows the duration and folds after one second" : "Streaming: open, with a shimmer on the row"}</Label>
        <div className="ai-message-bubble flex flex-col">
          <ThinkingBlock block={{ type: "thinking", thinking: live.text }} streaming={!live.done} />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>From history: closed until clicked</Label>
        <div className="ai-message-bubble flex flex-col">
          <ThinkingBlock block={{ type: "thinking", thinking: PAST }} streaming={false} />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>Redacted by the provider</Label>
        <div className="ai-message-bubble flex flex-col">
          <ThinkingBlock block={{ type: "thinking", thinking: "", redacted: true }} streaming={false} />
        </div>
      </div>
    </>
  );
}

export default function Demo() {
  const [run, setRun] = useState(0);
  return (
    <Stage status="Three states of one reasoning block" onReplay={() => setRun((n) => n + 1)}>
      <Blocks key={run} />
    </Stage>
  );
}

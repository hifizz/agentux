"use client";

import { useEffect, useState } from "react";
import Stage from "@/components/examples/Stage";
import { Message } from "../_message/message";
import { ShadowScroll } from "../_message/shadow-scroll";

const LINES = [
  "Reading the composer state machine.",
  "The queue drains inside an effect.",
  "Moving the drain into the tick that ends a reply.",
  "Running the unit tests for the queue strip.",
  "All 42 tests pass.",
  "Checking the steer path with a busy run.",
  "Steer messages land after the current step.",
  "Updating the docs for the busy policy.",
  "Running lint and typecheck.",
  "Both are clean. Writing the summary.",
];

export default function Demo() {
  const [count, setCount] = useState(3);
  const [run, setRun] = useState(0);
  useEffect(() => {
    if (count >= LINES.length * 2) return;
    const t = window.setTimeout(() => setCount((c) => c + 1), 900);
    return () => window.clearTimeout(t);
  }, [count, run]);
  const items = Array.from({ length: count }, (_, i) => `${i + 1}. ${LINES[i % LINES.length]}`);
  return (
    <Stage
      status="Scroll up to stop following. Jump to latest brings it back."
      onReplay={() => {
        setCount(3);
        setRun((r) => r + 1);
      }}
    >
      <div className="mx-auto grid h-full w-full max-w-4xl gap-6 px-6 py-8 md:grid-cols-2">
        <section className="flex min-h-0 flex-col gap-2">
          <h3 className="text-ch-caption text-ch-ink-subtle">Follows new content</h3>
          <ShadowScroll follow className="h-80 rounded-ch-card border border-ch-line-soft" contentClassName="flex flex-col gap-3 p-4">
            {items.map((line) => (
              <Message key={line} role="assistant">
                <p className="text-ch-body text-ch-ink-muted">{line}</p>
              </Message>
            ))}
          </ShadowScroll>
        </section>
        <section className="flex min-h-0 flex-col gap-2">
          <h3 className="text-ch-caption text-ch-ink-subtle">Static, fades only where more content hides</h3>
          <ShadowScroll className="h-80 rounded-ch-card border border-ch-line-soft" contentClassName="flex flex-col gap-2 p-4">
            {LINES.concat(LINES).map((line, i) => (
              <p key={i} className="text-ch-body text-ch-ink-muted">
                {line}
              </p>
            ))}
          </ShadowScroll>
        </section>
      </div>
    </Stage>
  );
}

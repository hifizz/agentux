"use client";

import { useState } from "react";
import Stage from "@/components/examples/Stage";
import { useBurstStream } from "../_message/fixtures";
import { Markdown } from "../_message/markdown";
import { useSmoothStream } from "../_message/use-smooth-stream";

const TEXT = `Tokens rarely arrive at an even pace. The network hands over a burst of forty characters, then nothing for half a second, then three more.

**Smoothing** keeps a small buffer and drains it on every animation frame:

1. When the buffer is small it writes at a steady floor rate.
2. When a burst lands it speeds up so the backlog clears in about half a second.
3. When the stream ends it keeps going until the text has caught up.

The words on the right never stall and never jump, while the left column shows the raw chunks as they arrive.`;

function Column({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="flex min-w-0 flex-col gap-3">
      <h3 className="text-ch-caption text-ch-ink-subtle">{label}</h3>
      <div className="min-h-64">{children}</div>
    </section>
  );
}

function Compare() {
  const raw = useBurstStream(TEXT);
  const smooth = useSmoothStream(raw.text);
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Column label={`Raw chunks · ${raw.text.length} chars`}>
        <Markdown streaming={!raw.done}>{raw.text}</Markdown>
      </Column>
      <Column label={`Smoothed · ${smooth.text.length} chars`}>
        <Markdown streaming={!raw.done || !smooth.caughtUp}>{smooth.text}</Markdown>
      </Column>
    </div>
  );
}

export default function Demo() {
  const [run, setRun] = useState(0);
  return (
    <Stage status="Same bursty stream, rendered raw and smoothed" onReplay={() => setRun((r) => r + 1)}>
      <div className="mx-auto w-full max-w-4xl px-6 py-8">
        <Compare key={run} />
      </div>
    </Stage>
  );
}

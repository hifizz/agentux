"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import Stage from "@/components/examples/Stage";
import { useStream } from "@/components/examples/use-script";
import { Thinking } from "../_message/thinking";

const LIVE = `The user wants the composer to keep its height while the picker opens.

- The picker is portalled, so it cannot push the card.
- The strip above the card animates \`height\`, which is the likely cause.

I will measure the strip first, then decide whether to pin the card.`;

function Variant({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-1.5">
      <h3 className="text-ch-caption text-ch-ink-subtle">{label}</h3>
      {children}
    </section>
  );
}

function Live() {
  const s = useStream(LIVE, true, 3, 30);
  return <Thinking streaming={!s.done}>{s.text}</Thinking>;
}

export default function Demo() {
  const [run, setRun] = useState(0);
  return (
    <Stage status="Streams open, then folds after one second" onReplay={() => setRun((r) => r + 1)}>
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-6 py-8">
        <Variant label="Live">
          <Live key={run} />
        </Variant>
        <Variant label="From history, with a known duration">
          <Thinking streaming={false} seconds={14}>
            {"Checked the three call sites. Only the Projects page passes `density`, so the default is safe to change."}
          </Thinking>
        </Variant>
        <Variant label="Custom labels and icon, kept open">
          <Thinking streaming={false} autoClose={false} defaultOpen icon={<Sparkles />} labels={{ done: () => "Planned 3 steps" }}>
            {"1. Read the strip.\n2. Measure the card.\n3. Pin the height while a popup is open."}
          </Thinking>
        </Variant>
        <Variant label="Redacted by the provider">
          <Thinking streaming={false} redacted />
        </Variant>
      </div>
    </Stage>
  );
}

"use client";

import { useEffect, useState } from "react";
import { formatTokens, useTally } from "./engine/tally";
import { RollText } from "@/app/examples/_shared/ui/roll";
import { ThinkDots } from "@/app/examples/_shared/ui/think-dots";

export function Thinking() {
  const tally = useTally();
  const [seconds, setSeconds] = useState(() => tally.current.seconds);
  const [tokens, setTokens] = useState(() => tally.current.tokens);

  useEffect(() => {
    const s = window.setInterval(() => {
      tally.current.seconds += 1;
      setSeconds(tally.current.seconds);
    }, 1000);
    const t = window.setInterval(() => {
      tally.current.tokens += 60 + Math.round(Math.random() * 80);
      setTokens(tally.current.tokens);
    }, 3200);
    return () => {
      window.clearInterval(s);
      window.clearInterval(t);
    };
  }, [tally]);

  return (
    <div className="flex h-7 items-center gap-2" role="status" aria-live="polite">
      <ThinkDots className="grid size-4 place-items-center" />
      <span className="text-ch-caption text-ch-ink-muted">Thinking</span>
      <span className="flex items-center gap-1 text-ch-caption text-ch-ink-subtle tabular-nums">
        <span>
          {Math.floor(seconds / 60)}m {seconds % 60}s
        </span>
        <span aria-hidden className="size-0.5 rounded-full bg-ch-ink-subtle" />
        <RollText value={formatTokens(tokens)} />
        {" tokens"}
      </span>
    </div>
  );
}

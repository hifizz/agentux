"use client";

import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { ChevronRight, Lightbulb } from "lucide-react";
import type { ThinkingContent } from "@earendil-works/pi-ai";
import { cx } from "@/app/examples/_shared/ui/cx";
import { BubbleCollapse } from "./bubble-collapse";

const PiMarkdown = lazy(() => import("../markdown"));

const AUTO_CLOSE_MS = 1000;

export function ThinkingBlock({ block, streaming }: { block: ThinkingContent; streaming: boolean }) {
  const [open, setOpen] = useState(streaming);
  const [seconds, setSeconds] = useState<number>();
  const startedAt = useRef<number | null>(null);

  useEffect(() => {
    if (streaming) {
      startedAt.current = Date.now();
      return;
    }
    if (startedAt.current === null) return;
    setSeconds(Math.max(1, Math.round((Date.now() - startedAt.current) / 1000)));
    startedAt.current = null;
    const timer = setTimeout(() => setOpen(false), AUTO_CLOSE_MS);
    return () => clearTimeout(timer);
  }, [streaming]);

  if (block.redacted) return <p className="bubble-caption">Reasoning hidden by the provider</p>;
  return (
    <div className="flex flex-col">
      <button type="button" aria-expanded={open} onClick={() => setOpen((o) => !o)} className="bubble-row ch-color-ease ch-focus">
        <Lightbulb aria-hidden className="bubble-row-icon" />
        <span className={cx("bubble-row-text", streaming && "ch-anim-shimmer")}>
          <span className="bubble-row-verb">
            {streaming ? "Thinking" : seconds === undefined ? "Thought" : `Thought for ${seconds} ${seconds === 1 ? "second" : "seconds"}`}
          </span>
        </span>
        <ChevronRight aria-hidden className="bubble-row-chevron" />
      </button>
      <BubbleCollapse open={open} className="bubble-thinking">
        <Suspense fallback={<p className="bubble-plain">{block.thinking}</p>}>
          <PiMarkdown text={block.thinking} streaming={streaming} />
        </Suspense>
      </BubbleCollapse>
    </div>
  );
}

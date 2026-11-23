"use client";

import { useState } from "react";
import Stage from "@/components/examples/Stage";
import { ContextBreakdown, ContextUsage, TokenCount, usedTokens, type ContextSegment } from "../prompt-composer/composer";
import { CONTEXT } from "../prompt-composer/fixtures";

export default function Demo() {
  const [segments, setSegments] = useState<readonly ContextSegment[]>(CONTEXT.segments);
  const grow = (id: string, by: number) => setSegments((list) => list.map((s) => (s.id === id ? { ...s, tokens: s.tokens + by } : s)));
  const used = usedTokens(segments);
  const context = { ...CONTEXT, segments };
  return (
    <Stage
      align="center"
      status={`${Math.round((used / CONTEXT.window) * 100)}% of the window used`}
      actions={[
        { label: "Add a turn", onClick: () => grow("messages", 14_000) },
        { label: "Attach a file", onClick: () => grow("files", 22_000) },
        { label: "Compact", onClick: () => setSegments((list) => list.map((s) => (s.id === "messages" ? { ...s, tokens: 6_000 } : s))) },
      ]}
      onReplay={() => setSegments(CONTEXT.segments)}
      replayLabel="Reset"
    >
      <div className="flex flex-wrap items-center justify-center gap-4">
        <TokenCount used={used} window={CONTEXT.window} />
        <span className="flex items-center gap-1 text-ch-caption text-ch-ink-subtle">
          Hover or focus <ContextUsage {...context} />
        </span>
        <TokenCount used={164_000} window={200_000} />
        <TokenCount used={193_000} window={200_000} />
      </div>
      <div className="mx-auto w-full max-w-sm rounded-ch-card border border-ch-line bg-ch-surface shadow-ch-bar">
        <ContextBreakdown {...context} />
      </div>
    </Stage>
  );
}

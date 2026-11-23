"use client";

import { Check, FileSearch } from "lucide-react";
import { useState } from "react";
import Stage from "@/components/examples/Stage";
import { ShimmerText } from "../_shared/ui/shimmer-text";

export default function Demo() {
  const [working, setWorking] = useState(true);
  const Icon = working ? FileSearch : Check;

  return (
    <Stage
      actions={[
        { label: "Working", pressed: working, onClick: () => setWorking(true) },
        { label: "Complete", pressed: !working, onClick: () => setWorking(false) },
      ]}
    >
      <div className="mx-auto flex max-w-full items-center gap-3 rounded-ch-card border border-ch-line-soft bg-ch-surface px-5 py-4 shadow-ch-card">
        <Icon aria-hidden className="size-5 shrink-0 text-ch-ink-muted" />
        <div className="min-w-0">
          <p role="status" className="font-runde text-lg font-semibold">
            <ShimmerText active={working}>{working ? "Reviewing changes" : "Review complete"}</ShimmerText>
          </p>
          <p className="ch-mono mt-0.5 truncate text-ch-caption text-ch-ink-muted">prompt-composer.tsx</p>
        </div>
      </div>
    </Stage>
  );
}

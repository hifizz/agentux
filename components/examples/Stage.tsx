"use client";

import { RotateCcw } from "lucide-react";

export type StageAction = { label: string; onClick: () => void; pressed?: boolean };

export default function Stage({
  status,
  onReplay,
  replayLabel = "Replay",
  actions = [],
  align = "top",
  children,
}: {
  status?: string;
  onReplay?: () => void;
  replayLabel?: string;
  actions?: StageAction[];
  align?: "top" | "center";
  children: React.ReactNode;
}) {
  const button = "inline-flex h-7 items-center gap-1.5 rounded-full border border-ch-line px-2.5 text-xs font-medium text-ch-ink-muted transition-colors hover:border-ch-line-hover hover:text-ch-ink aria-pressed:border-transparent aria-pressed:bg-ch-ink aria-pressed:text-ch-surface";
  return (
    <div className="tf-chat flex h-full flex-col bg-card text-ch-ink">
      <div className="flex min-h-12 flex-wrap items-center gap-2 border-b border-ch-line-soft px-4 py-2">
        <p role="status" className="mr-auto min-w-0 truncate text-xs text-ch-ink-subtle">
          {status}
        </p>
        {actions.map((action) => (
          <button key={action.label} type="button" aria-pressed={action.pressed} onClick={action.onClick} className={button}>
            {action.label}
          </button>
        ))}
        {onReplay && (
          <button type="button" onClick={onReplay} className={button}>
            <RotateCcw size={12} aria-hidden="true" /> {replayLabel}
          </button>
        )}
      </div>
      <div className="relative min-h-0 flex-1 overflow-y-auto">
        <div className={`mx-auto flex min-h-full w-full max-w-2xl flex-col gap-4 px-4 py-6 ${align === "center" ? "justify-center" : ""}`}>{children}</div>
      </div>
    </div>
  );
}

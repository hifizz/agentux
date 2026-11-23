"use client";

import { RotateCcw } from "lucide-react";

export type StageAction = {
  label: string;
  onClick: () => void;
  pressed?: boolean;
};

export default function Stage({
  status,
  onReplay,
  replayLabel = "Replay",
  actions = [],
  align = "center",
  wide = false,
  children,
}: {
  status?: string;
  onReplay?: () => void;
  replayLabel?: string;
  actions?: StageAction[];
  align?: "top" | "center";
  wide?: boolean;
  children: React.ReactNode;
}) {
  const button =
    "inline-flex h-7 shrink-0 cursor-pointer items-center gap-1.5 rounded-[10px] px-2.5 text-xs font-medium text-ch-ink-muted hover:bg-popover hover:text-ch-ink aria-pressed:bg-popover aria-pressed:text-ch-ink";
  return (
    <div className="tf-chat flex h-full min-w-0 flex-col gap-3 pt-12 text-ch-ink">
      <div className="no-scrollbar relative min-h-0 flex-1 overflow-auto">
        <div
          className={`mx-auto flex min-h-full w-full ${wide ? "max-w-6xl" : "max-w-2xl"} flex-col gap-4 px-1 py-3 sm:px-4 ${align === "center" ? "justify-center" : ""}`}
        >
          {children}
        </div>
      </div>
      <div className="mx-auto mb-1 flex max-w-full shrink-0 flex-col items-center gap-2 sm:mb-3">
        <p
          role="status"
          className="px-2 text-center text-xs text-ch-ink-subtle"
        >
          {status}
        </p>
        {(actions.length > 0 || onReplay) && (
          <div className="flex max-w-full flex-wrap items-center justify-center gap-1 rounded-2xl border border-black/[0.06] bg-muted p-1.5 shadow-sm dark:border-transparent dark:border-apple">
            {actions.map((action) => (
              <button
                key={action.label}
                type="button"
                aria-pressed={action.pressed}
                onClick={action.onClick}
                className={button}
              >
                {action.label}
              </button>
            ))}
            {onReplay && (
              <button type="button" onClick={onReplay} className={button}>
                <RotateCcw size={12} aria-hidden="true" /> {replayLabel}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

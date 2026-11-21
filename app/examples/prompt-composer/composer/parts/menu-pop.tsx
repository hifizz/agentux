"use client";

import { useCallback, useState } from "react";
import { cx } from "../../shared/ui/cx";
import { useDismiss } from "../../shared/ui/use-dismiss";

type TriggerState = { open: boolean; toggle: () => void };

export type MenuPopProps = {
  label: string;
  trigger: (state: TriggerState) => React.ReactNode;
  children: (close: () => void) => React.ReactNode;
  align?: "start" | "end";
  width?: string;
};

export function MenuPop({ label, trigger, children, align = "start", width = "w-[220px]" }: MenuPopProps) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const wrap = useDismiss<HTMLDivElement>(open, close);
  return (
    <div ref={wrap} className="relative">
      {trigger({ open, toggle: () => setOpen((o) => !o) })}
      {open && (
        <div
          role="dialog"
          aria-label={label}
          className={cx(
            "ch-anim-pop-in absolute bottom-full z-30 mb-1.5 max-w-[calc(100vw-24px)] rounded-ch-card border border-ch-line bg-ch-surface shadow-ch-pop",
            align === "start" ? "left-0" : "right-0",
            width,
          )}
        >
          {children(close)}
        </div>
      )}
    </div>
  );
}

export const CHIP_TRIGGER =
  "ch-color-ease ch-focus flex h-6 min-w-0 cursor-pointer items-center gap-1 rounded-ch-control px-1.5 text-ch-body text-ch-ink outline-none hover:bg-ch-ghost-hover";

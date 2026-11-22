"use client";

import { ChevronRight } from "lucide-react";
import { cx } from "@/app/examples/_shared/ui/cx";

export type DisclosureRowProps = {
  icon?: React.ReactNode;
  label: React.ReactNode;
  detail?: React.ReactNode;
  end?: React.ReactNode;
  open?: boolean;
  shimmer?: boolean;
  onToggle?: () => void;
  className?: string;
};

export function DisclosureRow({ icon, label, detail, end, open, shimmer, onToggle, className }: DisclosureRowProps) {
  const body = (
    <>
      {icon && <span className="grid size-4 shrink-0 place-items-center text-ch-ink-subtle [&_svg]:size-3.5">{icon}</span>}
      <span className={cx("flex min-w-0 flex-1 items-baseline gap-1.5 text-ch-body", shimmer && "ch-anim-shimmer")}>
        <span className="shrink-0 text-ch-ink-muted">{label}</span>
        {detail && <span className="min-w-0 truncate text-ch-ink-subtle">{detail}</span>}
      </span>
      {end}
      {onToggle && (
        <ChevronRight
          aria-hidden
          className={cx("size-3.5 shrink-0 text-ch-ink-subtle opacity-0 transition-[rotate,opacity] duration-200 group-hover/row:opacity-100", open && "rotate-90 opacity-100")}
        />
      )}
    </>
  );
  const base = "group/row flex h-7 w-full min-w-0 items-center gap-2 rounded-ch-badge px-1.5 -mx-1.5 text-left";
  if (!onToggle) return <div className={cx(base, className)}>{body}</div>;
  return (
    <button type="button" aria-expanded={open} onClick={onToggle} className={cx(base, "ch-focus ch-color-ease cursor-pointer hover:bg-ch-ghost-hover", className)}>
      {body}
    </button>
  );
}

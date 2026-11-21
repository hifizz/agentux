import { cx } from "./cx";

export type TagTone = "design" | "frontend" | "backend" | "workflow" | "success";

const TONE: Record<TagTone, string> = {
  design: "border-ch-design-line bg-ch-design-surface text-ch-design-ink",
  frontend: "border-ch-frontend-line bg-ch-frontend-surface text-ch-frontend-ink",
  backend: "border-ch-backend-line bg-ch-backend-surface text-ch-backend-ink",
  workflow: "border-ch-neutral-line bg-ch-neutral-surface text-ch-neutral-ink",
  success: "border-ch-success-line bg-ch-success-surface text-ch-success-ink",
};

export function Tag({ tone = "workflow", className, children }: { tone?: TagTone; className?: string; children: React.ReactNode }) {
  return (
    <span className={cx("inline-flex h-5 shrink-0 items-center rounded-ch-badge border px-1.5 text-ch-caption whitespace-nowrap", TONE[tone], className)}>
      {children}
    </span>
  );
}

export function Glyph({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <span
      aria-hidden
      className={cx("grid size-4 shrink-0 place-items-center rounded-ch-badge border border-ch-line bg-ch-surface text-ch-ink-muted shadow-ch-chip", className)}
    >
      {children}
    </span>
  );
}

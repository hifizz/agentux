import { cx } from "@/app/examples/_shared/ui/cx";

export type StripRowProps = {
  icon: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
};

export function StripRow({ icon, actions, className, children }: StripRowProps) {
  return (
    <div className={cx("flex min-h-14 items-start gap-2 rounded-t-ch-card bg-ch-sunken px-3 pt-2 pb-6", className)}>
      <span className="mt-1 grid size-3.5 shrink-0 place-items-center text-ch-ink-subtle">{icon}</span>
      <div className="min-w-0 flex-1 text-ch-body leading-6 text-ch-ink">{children}</div>
      {actions && <div className="flex shrink-0 items-center gap-1">{actions}</div>}
    </div>
  );
}

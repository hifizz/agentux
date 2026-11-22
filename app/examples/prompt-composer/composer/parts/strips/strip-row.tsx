import { cx } from "@/app/examples/_shared/ui/cx";

export type StripRowProps = {
  icon: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
};

export function StripRow({ icon, actions, className, children }: StripRowProps) {
  return (
    <div className={cx("flex items-start gap-2 rounded-t-ch-card bg-ch-sunken px-3 pt-1 pb-5", className)}>
      <span className="mt-[3px] grid size-3.5 shrink-0 place-items-center text-ch-ink-subtle">{icon}</span>
      <div className="min-w-0 flex-1 text-ch-body leading-5 text-ch-ink">{children}</div>
      {actions && <div className="flex h-5 shrink-0 items-center gap-0.5">{actions}</div>}
    </div>
  );
}

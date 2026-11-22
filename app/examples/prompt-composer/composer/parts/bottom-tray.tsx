import { cx } from "@/app/examples/_shared/ui/cx";

export type BottomTrayProps = { start?: React.ReactNode; end?: React.ReactNode; className?: string };

export function BottomTray({ start, end, className }: BottomTrayProps) {
  if (!start && !end) return null;
  return (
    <div className={cx("@container -mt-4 flex items-center justify-between gap-2 rounded-b-ch-card bg-ch-sunken px-1.5 pt-5 pb-1 [&_button]:h-5 [&_button]:text-ch-caption [&_button_svg]:size-3", className)}>
      <div className="flex min-w-0 items-center gap-0.5">{start}</div>
      <div className="flex min-w-0 items-center gap-0.5">{end}</div>
    </div>
  );
}

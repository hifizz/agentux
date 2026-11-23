import type { ComponentProps, ReactNode } from "react";
import { cx } from "./cx";

export type ShimmerTextProps = ComponentProps<"span"> & {
  children: ReactNode;
  active?: boolean;
};

export function ShimmerText({ active = true, className, children, ...props }: ShimmerTextProps) {
  return (
    <span {...props} className={cx("text-ch-ink-muted", active && "ch-anim-shimmer", className)}>
      {children}
    </span>
  );
}

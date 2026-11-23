import type { ComponentProps } from "react";
import { cn } from "./cn";
import type { SpanStatus } from "./span-bar";
import "./trace-kit.css";

export type StatusPillProps = ComponentProps<"span"> & { status?: SpanStatus; pulse?: boolean };

export function StatusPill({ status, pulse, className, children, ...rest }: StatusPillProps) {
  return (
    <span {...rest} className={cn("tk-pill", className)} data-status={status}>
      {pulse && <span className="tk-pulse" />}
      {children}
    </span>
  );
}

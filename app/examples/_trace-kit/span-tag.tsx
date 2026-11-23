import type { ComponentProps } from "react";
import { percent, type TagSide } from "./axis";
import { cn } from "./cn";
import "./trace-kit.css";

export type SpanTagProps = ComponentProps<"span"> & { start: number; duration: number; range: number; side?: TagSide; gap?: number; kind?: string };

export function SpanTag({ start, duration, range, side, gap = 2, kind, className, style, children, ...rest }: SpanTagProps) {
  const end = percent(start + duration, range);
  const position =
    side === "inside" ? { right: `calc(100% - ${end}% + ${gap}px)` } : side === "before" ? { right: `calc(100% - ${percent(start, range)}% + ${gap}px)` } : { left: `calc(${end}% + ${gap}px)` };
  return (
    <span {...rest} className={cn("tk-tag", className)} data-side={side} data-kind={kind} style={{ ...position, ...style }}>
      {children}
    </span>
  );
}

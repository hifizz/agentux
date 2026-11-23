import type { ComponentProps } from "react";
import { percent } from "./axis";
import { cn } from "./cn";
import "./trace-kit.css";

export type SpanStatus = "running" | "done" | "failed";

type Geometry = { start: number; duration: number; range: number; minWidth?: number };

export type SpanBarProps = Omit<ComponentProps<"span">, "children"> & Geometry & { kind?: string; status?: SpanStatus; wait?: number };

export function SpanBar({ start, duration, range, minWidth = 3, kind, status, wait, className, style, ...rest }: SpanBarProps) {
  return (
    <span
      {...rest}
      className={cn("tk-bar", className)}
      data-kind={kind}
      data-status={status}
      style={{ left: `${percent(start, range)}%`, width: `max(${minWidth}px, ${percent(duration, range)}%)`, ...style }}
    >
      {wait && duration > 0 ? <i className="tk-wait" style={{ width: `${Math.min(100, (wait / duration) * 100)}%` }} /> : null}
    </span>
  );
}

export type SpanMarkProps = Omit<ComponentProps<"span">, "children"> & Geometry & { kind?: string };

export function SpanMark({ start, duration, range, minWidth = 2, kind, className, style, ...rest }: SpanMarkProps) {
  return (
    <span
      {...rest}
      className={cn("tk-span-mark", className)}
      data-kind={kind}
      style={{ left: `${percent(start, range)}%`, width: `max(${minWidth}px, ${percent(duration, range)}%)`, ...style }}
    />
  );
}

export type SpanBracketProps = Omit<ComponentProps<"span">, "children"> & Geometry;

export function SpanBracket({ start, duration, range, className, style, ...rest }: SpanBracketProps) {
  return <span {...rest} className={cn("tk-bracket", className)} style={{ left: `${percent(start, range)}%`, width: `${percent(duration, range)}%`, ...style }} />;
}

export type SpanDotProps = Omit<ComponentProps<"span">, "children"> & { start: number; range: number; kind?: string };

export function SpanDot({ start, range, kind, className, style, ...rest }: SpanDotProps) {
  return <span {...rest} className={cn("tk-dot", className)} data-kind={kind} style={{ left: `${percent(start, range)}%`, ...style }} />;
}

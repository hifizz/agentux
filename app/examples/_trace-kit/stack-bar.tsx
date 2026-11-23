import { cn } from "./cn";
import "./trace-kit.css";

export type StackSegment = { value: number; color: string };

export type StackBarProps = { segments: StackSegment[]; size?: "sm" | "md"; label?: string; className?: string };

export function StackBar({ segments, size = "sm", label, className }: StackBarProps) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);
  return (
    <span className={cn("tk-stack", className)} data-size={size} role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      {total > 0 && segments.filter((segment) => segment.value > 0).map((segment, i) => <i key={i} style={{ width: `${(segment.value / total) * 100}%`, background: segment.color }} />)}
    </span>
  );
}

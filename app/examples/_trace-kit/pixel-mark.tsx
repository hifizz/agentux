import type { CSSProperties } from "react";
import "./trace-kit.css";

export type PixelMarkProps = { pattern: string; color: string; busy?: boolean };

export function PixelMark({ pattern, color, busy }: PixelMarkProps) {
  return (
    <span className="tk-mark" aria-hidden="true" data-busy={busy ? "" : undefined} style={{ "--tk-mark-color": color } as CSSProperties}>
      {Array.from(pattern).map((on, i) => (
        <i key={i} data-on={on === "1" ? "" : undefined} style={{ animationDelay: `${((i % 3) + Math.floor(i / 3)) * 120}ms` }} />
      ))}
    </span>
  );
}

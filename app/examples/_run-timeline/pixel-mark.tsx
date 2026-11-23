import type { CSSProperties } from "react";

export function PixelMark({ pattern, color, busy }: { pattern: string; color: string; busy?: boolean }) {
  return (
    <span className="rt-mark" aria-hidden="true" data-busy={busy ? "" : undefined} style={{ "--rt-mark": color } as CSSProperties}>
      {Array.from(pattern).map((on, i) => (
        <i key={i} data-on={on === "1" ? "" : undefined} style={{ animationDelay: `${((i % 3) + Math.floor(i / 3)) * 120}ms` }} />
      ))}
    </span>
  );
}

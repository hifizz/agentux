import type { ReactNode } from "react";
import { cn } from "./cn";
import "./trace-kit.css";

export type Stat = { label: string; value: string; tone?: "bad"; caption?: string; muted?: boolean; footer?: ReactNode };

export function StatStrip({ items, className }: { items: Stat[]; className?: string }) {
  return (
    <dl className={cn("tk-stats", className)}>
      {items.map((item) => (
        <div key={item.label} className="tk-stat" data-tone={item.tone} data-muted={item.muted ? "" : undefined}>
          <dt>{item.label}</dt>
          <dd>
            {item.value}
            {item.caption && <span className="tk-stat-cap">{item.caption}</span>}
          </dd>
          {item.footer}
        </div>
      ))}
    </dl>
  );
}

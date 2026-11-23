import { cn } from "./cn";
import "./trace-kit.css";

export type Stat = { label: string; value: string; tone?: "bad" };

export function StatStrip({ items, className }: { items: Stat[]; className?: string }) {
  return (
    <dl className={cn("tk-stats", className)}>
      {items.map((item) => (
        <div key={item.label} className="tk-stat" data-tone={item.tone}>
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

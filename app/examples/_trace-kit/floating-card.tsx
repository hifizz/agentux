import type { ComponentProps, CSSProperties, ReactNode } from "react";
import { TriangleAlert, X } from "lucide-react";
import { cn } from "./cn";
import "./trace-kit.css";

export type CardPosition = { left: number; top?: number; bottom?: number; side: "above" | "below" };

export type FloatingCardProps = Omit<ComponentProps<"div">, "style"> & { position: CardPosition; closing?: boolean };

export function FloatingCard({ position, closing, className, onClick, ...rest }: FloatingCardProps) {
  return (
    <div
      {...rest}
      className={cn("tk-card", className)}
      role="dialog"
      data-side={position.side}
      data-closing={closing ? "" : undefined}
      style={{ left: position.left, top: position.top, bottom: position.bottom } as CSSProperties}
      onClick={(event) => {
        event.stopPropagation();
        onClick?.(event);
      }}
    />
  );
}

export const CardHead = ({ children }: { children: ReactNode }) => <div className="tk-card-head">{children}</div>;

export function CardWho({ title, sub }: { title: ReactNode; sub: ReactNode }) {
  return (
    <span className="tk-card-who">
      <span className="tk-card-name" dir="auto">{title}</span>
      <span className="tk-card-sub">{sub}</span>
    </span>
  );
}

export function CloseButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" className="tk-close" aria-label={label} onClick={onClick}>
      <X size={14} aria-hidden="true" />
    </button>
  );
}

export function FactGrid({ items }: { items: [label: string, value: string, hint?: string][] }) {
  return (
    <dl className="tk-facts">
      {items.map(([label, value, hint]) => (
        <div key={label} title={hint}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function ErrorNote({ children }: { children: ReactNode }) {
  return (
    <div className="tk-note">
      <TriangleAlert size={12} aria-hidden="true" />
      <span className="tk-note-text">{children}</span>
    </div>
  );
}

export function LabeledText({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="tk-field">
      <span>{label}</span>
      <p dir="auto">{children}</p>
    </div>
  );
}

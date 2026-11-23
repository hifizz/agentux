import type { ComponentProps, CSSProperties, ReactNode } from "react";
import { cn } from "./cn";
import "./trace-kit.css";

export type KindShape = "square" | "circle" | "diamond" | "outline";

export type KindBadge = "running" | "failed" | "propagated";

export type KindIconProps = Omit<ComponentProps<"span">, "children"> & {
  tone: string;
  shape?: KindShape;
  size?: number;
  hue?: string;
  badge?: KindBadge;
  children: ReactNode;
};

const tint = (hue: string): CSSProperties =>
  ({
    "--k-bg": `color-mix(in srgb, ${hue} 13%, transparent)`,
    "--k-edge": `color-mix(in srgb, ${hue} 34%, transparent)`,
    "--k-ink": `color-mix(in srgb, ${hue} 82%, var(--tk-strong))`,
    "--k-mark": `color-mix(in srgb, ${hue} 78%, transparent)`,
  }) as CSSProperties;

export function KindIcon({ tone, shape = "square", size = 20, hue, badge, className, style, children, ...rest }: KindIconProps) {
  return (
    <span
      {...rest}
      className={cn("tk-kind", className)}
      data-kind={tone}
      data-shape={shape}
      style={{ "--tk-kind-size": `${size}px`, ...(hue ? tint(hue) : null), ...style } as CSSProperties}
    >
      {children}
      {badge && <i className="tk-kind-badge" data-badge={badge} />}
    </span>
  );
}

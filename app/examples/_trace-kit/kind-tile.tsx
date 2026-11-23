import type { ComponentProps } from "react";
import { cn } from "./cn";
import "./trace-kit.css";

export function KindTile({ className, ...rest }: ComponentProps<"span">) {
  return <span {...rest} className={cn("tk-tile", className)} />;
}

"use client";

import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";
import { cn } from "@/lib/utils";

export const TooltipProvider = TooltipPrimitive.Provider;

export function Tooltip({ label, side = "top", children, className }: { label: React.ReactNode; side?: TooltipPrimitive.Positioner.Props["side"]; children: React.ReactElement; className?: string }) {
  return (
    <TooltipPrimitive.Root>
      <TooltipPrimitive.Trigger render={children} />
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Positioner side={side} sideOffset={6} className="isolate z-[110]">
          <TooltipPrimitive.Popup
            className={cn(
              "origin-(--transform-origin) rounded-ch-control bg-ch-ink px-2 py-1 text-ch-caption whitespace-nowrap text-ch-page shadow-ch-pop transition-[opacity,scale] duration-100 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0 data-instant:transition-none motion-reduce:transition-none",
              className,
            )}
          >
            {label}
          </TooltipPrimitive.Popup>
        </TooltipPrimitive.Positioner>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
}

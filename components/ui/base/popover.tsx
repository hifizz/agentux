"use client";

import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import { cn } from "@/lib/utils";
import { POPUP } from "./styles";

export const Popover = PopoverPrimitive.Root;
export const PopoverTrigger = PopoverPrimitive.Trigger;
export const PopoverTitle = PopoverPrimitive.Title;
export const PopoverDescription = PopoverPrimitive.Description;
export const PopoverClose = PopoverPrimitive.Close;

type ContentProps = PopoverPrimitive.Popup.Props & Pick<PopoverPrimitive.Positioner.Props, "align" | "alignOffset" | "side" | "sideOffset" | "anchor">;

export function PopoverContent({ className, align = "start", alignOffset = 0, side = "top", sideOffset = 6, anchor, ...props }: ContentProps) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Positioner align={align} alignOffset={alignOffset} side={side} sideOffset={sideOffset} anchor={anchor} className="isolate z-[100]">
        <PopoverPrimitive.Popup data-slot="popover-content" className={cn(POPUP, "max-w-[calc(100vw-24px)]", className)} {...props} />
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  );
}

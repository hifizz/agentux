"use client";

import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox";
import { Check, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { ITEM, POPUP } from "./styles";

export const Combobox = ComboboxPrimitive.Root;
export const ComboboxTrigger = ComboboxPrimitive.Trigger;
export const ComboboxValue = ComboboxPrimitive.Value;
export const ComboboxCollection = ComboboxPrimitive.Collection;
export const ComboboxGroup = ComboboxPrimitive.Group;

type ContentProps = ComboboxPrimitive.Popup.Props & Pick<ComboboxPrimitive.Positioner.Props, "align" | "alignOffset" | "side" | "sideOffset" | "anchor">;

export function ComboboxContent({ className, align = "start", alignOffset = 0, side = "top", sideOffset = 6, anchor, ...props }: ContentProps) {
  return (
    <ComboboxPrimitive.Portal>
      <ComboboxPrimitive.Positioner align={align} alignOffset={alignOffset} side={side} sideOffset={sideOffset} anchor={anchor} className="isolate z-[100]">
        <ComboboxPrimitive.Popup data-slot="combobox-content" className={cn(POPUP, "flex max-h-(--available-height) max-w-[calc(100vw-24px)] flex-col overflow-hidden", className)} {...props} />
      </ComboboxPrimitive.Positioner>
    </ComboboxPrimitive.Portal>
  );
}

export function ComboboxSearch({ className, ...props }: ComboboxPrimitive.Input.Props) {
  return (
    <label className="flex h-8 shrink-0 items-center gap-1.5 border-b border-ch-line-soft px-2.5">
      <Search aria-hidden className="size-3 shrink-0 text-ch-ink-subtle" />
      <ComboboxPrimitive.Input className={cn("min-w-0 flex-1 bg-transparent text-ch-caption text-ch-ink outline-none placeholder:text-ch-ink-subtle", className)} {...props} />
    </label>
  );
}

export function ComboboxList({ className, ...props }: ComboboxPrimitive.List.Props) {
  return <ComboboxPrimitive.List className={cn("max-h-60 scroll-py-1 overflow-y-auto overscroll-contain p-1 data-empty:p-0", className)} {...props} />;
}

export function ComboboxItem({ className, children, indicator = true, ...props }: ComboboxPrimitive.Item.Props & { indicator?: boolean }) {
  return (
    <ComboboxPrimitive.Item className={cn(ITEM, className)} {...props}>
      {children}
      {indicator && (
        <span className="ml-auto flex size-3.5 shrink-0 items-center">
          <ComboboxPrimitive.ItemIndicator>
            <Check className="size-3.5" />
          </ComboboxPrimitive.ItemIndicator>
        </span>
      )}
    </ComboboxPrimitive.Item>
  );
}

export function ComboboxLabel({ className, ...props }: ComboboxPrimitive.GroupLabel.Props) {
  return <ComboboxPrimitive.GroupLabel className={cn("px-2 pt-1.5 pb-0.5 text-ch-caption text-ch-ink-subtle", className)} {...props} />;
}

export function ComboboxEmpty({ className, ...props }: ComboboxPrimitive.Empty.Props) {
  return <ComboboxPrimitive.Empty className={cn("px-2 py-4 text-center text-ch-caption text-ch-ink-subtle empty:hidden", className)} {...props} />;
}

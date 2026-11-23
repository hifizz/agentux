"use client";

import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { ITEM, POPUP } from "./styles";

export const Menu = MenuPrimitive.Root;
export const MenuTrigger = MenuPrimitive.Trigger;
export const MenuGroup = MenuPrimitive.Group;
export const MenuRadioGroup = MenuPrimitive.RadioGroup;

type ContentProps = MenuPrimitive.Popup.Props & Pick<MenuPrimitive.Positioner.Props, "align" | "alignOffset" | "side" | "sideOffset">;

export function MenuContent({ className, align = "start", alignOffset = 0, side = "top", sideOffset = 6, ...props }: ContentProps) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner align={align} alignOffset={alignOffset} side={side} sideOffset={sideOffset} className="isolate z-[100] outline-none">
        <MenuPrimitive.Popup data-slot="menu-content" className={cn(POPUP, "max-h-(--available-height) min-w-40 overflow-y-auto p-1", className)} {...props} />
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  );
}

export function MenuLabel({ className, ...props }: MenuPrimitive.GroupLabel.Props) {
  return <MenuPrimitive.GroupLabel className={cn("px-2 pt-1 pb-0.5 text-ch-caption text-ch-ink-subtle", className)} {...props} />;
}

export function MenuItem({ className, ...props }: MenuPrimitive.Item.Props) {
  return <MenuPrimitive.Item className={cn(ITEM, className)} {...props} />;
}

export function MenuRadioItem({ className, children, ...props }: MenuPrimitive.RadioItem.Props) {
  return (
    <MenuPrimitive.RadioItem className={cn(ITEM, "data-checked:text-ch-ink", className)} {...props}>
      <span className="flex min-w-0 flex-1 items-start gap-2">{children}</span>
      <MenuPrimitive.RadioItemIndicator keepMounted className="flex size-3.5 shrink-0 items-center self-start pt-0.5 data-unchecked:invisible">
        <Check className="size-3.5" />
      </MenuPrimitive.RadioItemIndicator>
    </MenuPrimitive.RadioItem>
  );
}

export function MenuSeparator({ className, ...props }: MenuPrimitive.Separator.Props) {
  return <MenuPrimitive.Separator className={cn("-mx-1 my-1 h-px bg-ch-line-soft", className)} {...props} />;
}

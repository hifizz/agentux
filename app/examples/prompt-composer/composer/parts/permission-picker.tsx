"use client";

import { ChevronDown } from "lucide-react";
import { CHIP, Menu, MenuContent, MenuGroup, MenuLabel, MenuRadioGroup, MenuRadioItem, MenuTrigger } from "@/components/ui/base";
import { cx } from "@/app/examples/_shared/ui/cx";
import { ALL_PERMISSION_MODES, PERMISSION_MODES } from "../tables";
import type { PermissionControl, PermissionMode } from "../types";
import { ShieldIcon } from "./icons";

export type PermissionPickerProps = PermissionControl & { disabled?: boolean };

export function PermissionPicker({ value, onChange, modes = ALL_PERMISSION_MODES, disabled }: PermissionPickerProps) {
  const current = PERMISSION_MODES[value];
  return (
    <Menu>
      <MenuTrigger disabled={disabled} aria-label={`Permissions: ${current.label}`} className={cx(CHIP, current.risky && "text-ch-diff-del-ink hover:text-ch-diff-del-ink data-popup-open:text-ch-diff-del-ink")}>
        <ShieldIcon className="size-3.5 shrink-0" />
        <span className="hidden @min-[400px]:inline">{current.label}</span>
        <ChevronDown aria-hidden className="hidden size-3.5 shrink-0 @min-[400px]:block" />
      </MenuTrigger>
      <MenuContent className="w-[272px]">
        <MenuGroup>
          <MenuLabel>Permissions</MenuLabel>
          <MenuRadioGroup value={value} onValueChange={(next: PermissionMode) => onChange(next)}>
            {modes.map((m) => {
              const info = PERMISSION_MODES[m];
              return (
                <MenuRadioItem key={m} value={m} closeOnClick>
                  <span className="flex min-w-0 flex-col">
                    <span className={info.risky ? "text-ch-diff-del-ink" : "text-ch-ink"}>{info.label}</span>
                    <span className="text-ch-caption text-ch-ink-muted">{info.hint}</span>
                  </span>
                </MenuRadioItem>
              );
            })}
          </MenuRadioGroup>
        </MenuGroup>
      </MenuContent>
    </Menu>
  );
}

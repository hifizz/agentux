"use client";

import { ChevronDownIcon } from "@/app/examples/_shared/ui/icons";
import { MenuItem } from "@/app/examples/_shared/ui/menu";
import type { EffortLevel, ModelCard } from "@/app/examples/_shared/models";
import { EFFORT_LABEL } from "../tables";
import { CHIP_TRIGGER, MenuPop } from "./menu-pop";

export type EffortPickerProps = {
  model: ModelCard;
  value: EffortLevel;
  onChange: (next: EffortLevel) => void;
};

export function EffortPicker({ model, value, onChange }: EffortPickerProps) {
  if (model.effort.levels.length < 2) return null;
  const shown = EFFORT_LABEL[value];
  const options: readonly EffortLevel[] = model.effort.levels.includes("off") ? model.effort.levels : ["off", ...model.effort.levels];
  return (
    <MenuPop
      label="Reasoning effort"
      align="end"
      width="w-[168px]"
      trigger={({ open, toggle }) => (
        <button type="button" aria-label={`Effort: ${shown}`} aria-haspopup="dialog" aria-expanded={open} onClick={toggle} className={`${CHIP_TRIGGER} text-ch-ink-muted`}>
          <span className="truncate">{shown}</span>
          <ChevronDownIcon aria-hidden className="size-3.5 shrink-0" />
        </button>
      )}
    >
      {(close) => (
        <ul role="listbox" aria-label="Reasoning effort" className="flex flex-col p-1">
          <li role="presentation" className="px-2 pt-1 pb-0.5 text-ch-caption text-ch-ink-subtle">
            Higher effort uses more tokens
          </li>
          {options.map((level) => (
            <MenuItem
              key={level}
              selected={level === value}
              onSelect={() => {
                onChange(level);
                close();
              }}
            >
              {EFFORT_LABEL[level]}
            </MenuItem>
          ))}
        </ul>
      )}
    </MenuPop>
  );
}

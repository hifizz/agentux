"use client";

import { ChevronDown } from "lucide-react";
import { CHIP, Menu, MenuContent, MenuGroup, MenuLabel, MenuRadioGroup, MenuRadioItem, MenuTrigger } from "@/components/ui/base";
import { cx } from "@/app/examples/_shared/ui/cx";
import type { EffortLevel, ModelCard } from "@/app/examples/_shared/models";
import { EFFORT_LABEL } from "../tables";

export type EffortPickerProps = {
  model: ModelCard;
  value: EffortLevel;
  onChange: (next: EffortLevel) => void;
  disabled?: boolean;
};

export function effortOptions(model: ModelCard): readonly EffortLevel[] {
  return model.effort.levels.includes("off") ? model.effort.levels : ["off", ...model.effort.levels];
}

export function EffortMeter({ level, of }: { level: number; of: number }) {
  return (
    <span aria-hidden className="flex h-3 items-end gap-px">
      {Array.from({ length: of }, (_, i) => (
        <span key={i} className={cx("w-[3px] rounded-[1px] transition-colors", i < level ? "bg-current" : "bg-ch-line")} style={{ height: `${40 + (60 * (i + 1)) / of}%` }} />
      ))}
    </span>
  );
}

export function EffortPicker({ model, value, onChange, disabled }: EffortPickerProps) {
  if (model.effort.levels.length < 2) return null;
  const options = effortOptions(model);
  const steps = options.length - 1;
  return (
    <Menu>
      <MenuTrigger disabled={disabled} aria-label={`Effort: ${EFFORT_LABEL[value]}`} className={CHIP}>
        <EffortMeter level={options.indexOf(value)} of={steps} />
        <span className="hidden truncate @min-[400px]:inline">{EFFORT_LABEL[value]}</span>
        <ChevronDown aria-hidden className="size-3.5 shrink-0" />
      </MenuTrigger>
      <MenuContent align="end" className="w-[196px]">
        <MenuGroup>
          <MenuLabel>Higher effort uses more tokens</MenuLabel>
          <MenuRadioGroup value={value} onValueChange={(next: EffortLevel) => onChange(next)}>
            {options.map((level, i) => (
              <MenuRadioItem key={level} value={level} closeOnClick>
                <span className="flex w-4 justify-center pt-0.5">
                  <EffortMeter level={i} of={steps} />
                </span>
                <span>{EFFORT_LABEL[level]}</span>
              </MenuRadioItem>
            ))}
          </MenuRadioGroup>
        </MenuGroup>
      </MenuContent>
    </Menu>
  );
}

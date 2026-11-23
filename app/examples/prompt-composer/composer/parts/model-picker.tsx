"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { CHIP, Combobox, ComboboxContent, ComboboxEmpty, ComboboxItem, ComboboxList, ComboboxSearch, ComboboxTrigger } from "@/components/ui/base";
import { cx } from "@/app/examples/_shared/ui/cx";
import { findModel, selectModel, type ModelCard } from "@/app/examples/_shared/models";
import type { ModelControl } from "../types";
import { CostBar, ModelDetail } from "./model-detail";
import { VendorMark } from "./vendor-mark";

export type ModelPickerProps = ModelControl & { disabled?: boolean };

export function ModelPicker({ catalog, value, onChange, disabled }: ModelPickerProps) {
  const [highlighted, setHighlighted] = useState<ModelCard>();
  const current = findModel(catalog, value.key) ?? catalog[0];
  if (!current) return null;
  if (catalog.length < 2) {
    return (
      <span className="flex h-6 min-w-0 items-center gap-1 pr-1.5 text-ch-body text-ch-ink-muted">
        <VendorMark vendor={current.vendor} />
        <span className="ch-mono truncate text-ch-caption">{current.name}</span>
      </span>
    );
  }
  return (
    <Combobox
      autoHighlight
      items={catalog}
      value={current}
      onValueChange={(card: ModelCard | null) => card && onChange(selectModel(card, value.effort))}
      itemToStringLabel={(m: ModelCard) => m.name}
      isItemEqualToValue={(a: ModelCard, b: ModelCard) => a.key === b.key}
      onItemHighlighted={(m: ModelCard | undefined) => m && setHighlighted(m)}
      onOpenChange={(open) => !open && setHighlighted(undefined)}
    >
      <ComboboxTrigger disabled={disabled} aria-label={`Model: ${current.name}`} className={cx(CHIP, "pl-0.5")}>
        <VendorMark vendor={current.vendor} />
        <span className="truncate">{current.name}</span>
        <ChevronDown aria-hidden className="size-3.5 shrink-0" />
      </ComboboxTrigger>
      <ComboboxContent align="end" className="w-[300px]">
        <ComboboxSearch placeholder="Search models" aria-label="Search models" />
        <ComboboxEmpty>No models match</ComboboxEmpty>
        <ComboboxList>
          {(m: ModelCard) => (
            <ComboboxItem key={m.key} value={m} className="h-7 gap-1 py-0 pl-0.5">
              <VendorMark vendor={m.vendor} />
              <span className="min-w-0 flex-1 truncate">{m.name}</span>
              <CostBar model={m} catalog={catalog} />
            </ComboboxItem>
          )}
        </ComboboxList>
        <ModelDetail model={highlighted ?? current} catalog={catalog} />
      </ComboboxContent>
    </Combobox>
  );
}

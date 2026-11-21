"use client";

import { useState } from "react";
import { CheckIcon, ChevronDownIcon, SearchIcon } from "@/app/examples/_shared/ui/icons";
import { cx } from "@/app/examples/_shared/ui/cx";
import { findModel, selectModel, type ModelCard } from "@/app/examples/_shared/models";
import type { ModelControl } from "../types";
import { CHIP_TRIGGER, MenuPop } from "./menu-pop";
import { CostBar, ModelDetail } from "./model-detail";
import { VendorMark } from "./vendor-mark";

export type ModelPickerProps = ModelControl;

export function ModelPicker({ catalog, value, onChange }: ModelPickerProps) {
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
    <MenuPop
      label="Model"
      align="end"
      width="w-[300px]"
      trigger={({ open, toggle }) => (
        <button type="button" aria-label={`Model: ${current.name}`} aria-haspopup="dialog" aria-expanded={open} onClick={toggle} className={cx(CHIP_TRIGGER, "pl-0.5")}>
          <VendorMark vendor={current.vendor} />
          <span className="truncate">{current.name}</span>
          <ChevronDownIcon aria-hidden className="size-3.5 shrink-0" />
        </button>
      )}
    >
      {(close) => (
        <ModelList
          catalog={catalog}
          current={current}
          onPick={(card) => {
            onChange(selectModel(card, value.effort));
            close();
          }}
        />
      )}
    </MenuPop>
  );
}

function ModelList({ catalog, current, onPick }: { catalog: readonly ModelCard[]; current: ModelCard; onPick: (card: ModelCard) => void }) {
  const [query, setQuery] = useState("");
  const [hovered, setHovered] = useState<ModelCard>();
  const q = query.trim().toLowerCase();
  const shown = q ? catalog.filter((m) => m.name.toLowerCase().includes(q) || m.id.toLowerCase().includes(q)) : catalog;
  const focus = hovered && shown.includes(hovered) ? hovered : shown.includes(current) ? current : shown[0];

  return (
    <div className="flex flex-col">
      <label className="flex h-9 items-center gap-2 border-b border-ch-line-soft px-3">
        <SearchIcon className="size-3.5 shrink-0 text-ch-ink-subtle" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search models"
          aria-label="Search models"
          className="min-w-0 flex-1 bg-transparent text-ch-body text-ch-ink outline-none placeholder:text-ch-ink-subtle"
        />
      </label>
      <ul role="listbox" aria-label="Model" className="flex max-h-60 flex-col overflow-y-auto p-1">
        {shown.length === 0 && <li className="px-2 py-2 text-ch-body text-ch-ink-subtle">No models match</li>}
        {shown.map((m) => {
          const selected = m.key === current.key;
          return (
            <li key={m.key} role="option" aria-selected={selected} onPointerEnter={() => setHovered(m)}>
              <button
                type="button"
                onClick={() => onPick(m)}
                onFocus={() => setHovered(m)}
                className={cx(
                  "ch-color-ease ch-focus-inset flex h-7 w-full cursor-pointer items-center gap-1 rounded-ch-control pr-2 pl-0.5 text-left text-ch-body outline-none hover:bg-ch-ghost-hover hover:text-ch-ink active:bg-ch-ghost-press",
                  selected ? "text-ch-ink" : "text-ch-ink-muted",
                )}
              >
                <VendorMark vendor={m.vendor} />
                <span className="min-w-0 flex-1 truncate">{m.name}</span>
                <CostBar model={m} catalog={catalog} />
                <CheckIcon className={cx("size-3.5 shrink-0", !selected && "invisible")} />
              </button>
            </li>
          );
        })}
      </ul>
      {focus && <ModelDetail model={focus} catalog={catalog} />}
    </div>
  );
}

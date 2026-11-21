"use client";

import { CheckIcon, ChevronDownIcon } from "@/app/examples/_shared/ui/icons";
import { cx } from "@/app/examples/_shared/ui/cx";
import { ALL_PERMISSION_MODES, PERMISSION_MODES } from "../tables";
import type { PermissionControl } from "../types";
import { CHIP_TRIGGER, MenuPop } from "./menu-pop";
import { ShieldIcon } from "./icons";

export type PermissionPickerProps = PermissionControl;

export function PermissionPicker({ value, onChange, modes = ALL_PERMISSION_MODES }: PermissionPickerProps) {
  const current = PERMISSION_MODES[value];
  return (
    <MenuPop
      label="Permissions"
      width="w-[272px]"
      trigger={({ open, toggle }) => (
        <button
          type="button"
          aria-label={`Permissions: ${current.label}`}
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={toggle}
          className={cx(CHIP_TRIGGER, current.risky && "text-ch-diff-del-ink")}
        >
          <ShieldIcon className="size-3.5 shrink-0" />
          <span className="hidden @min-[400px]:inline">{current.label}</span>
          <ChevronDownIcon aria-hidden className="hidden size-3.5 shrink-0 @min-[400px]:block" />
        </button>
      )}
    >
      {(close) => (
        <ul role="listbox" aria-label="Permissions" className="flex flex-col p-1">
          {modes.map((m) => {
            const info = PERMISSION_MODES[m];
            const selected = m === value;
            return (
              <li key={m} role="option" aria-selected={selected}>
                <button
                  type="button"
                  autoFocus={selected}
                  onClick={() => {
                    onChange(m);
                    close();
                  }}
                  className="ch-color-ease ch-focus-inset flex w-full cursor-pointer items-start gap-2 rounded-ch-control px-2 py-1.5 text-left outline-none hover:bg-ch-ghost-hover active:bg-ch-ghost-press"
                >
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className={cx("text-ch-body", info.risky ? "text-ch-diff-del-ink" : "text-ch-ink")}>{info.label}</span>
                    <span className="text-ch-caption text-ch-ink-muted">{info.hint}</span>
                  </span>
                  <CheckIcon className={cx("mt-0.5 size-3.5 shrink-0", !selected && "invisible")} />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </MenuPop>
  );
}

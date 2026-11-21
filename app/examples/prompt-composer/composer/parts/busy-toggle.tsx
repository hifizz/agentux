import { cx } from "@/app/examples/_shared/ui/cx";
import { Tooltip } from "@/app/examples/_shared/ui/tooltip";
import type { BusyMode } from "../types";

export type BusyToggleProps = {
  mode: BusyMode;
  onChange: (mode: BusyMode) => void;
};

export function BusyToggle({ mode, onChange }: BusyToggleProps) {
  const steer = mode === "steer";
  return (
    <Tooltip label="Steer: placed after the current tool round instead of waiting for the answer">
      <button
        type="button"
        aria-pressed={steer}
        onClick={() => onChange(steer ? "queue" : "steer")}
        className={cx(
          "ch-focus h-6 cursor-pointer rounded-ch-control border px-2 text-ch-caption outline-none",
          steer ? "border-ch-link text-ch-link" : "border-ch-line text-ch-ink-muted hover:border-ch-line-hover",
        )}
      >
        Steer
      </button>
    </Tooltip>
  );
}

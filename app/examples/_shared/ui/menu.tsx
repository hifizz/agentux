import { CheckIcon } from "./icons";
import { cx } from "./cx";

export function MenuItem({ selected, onSelect, children }: { selected: boolean; onSelect: () => void; children: React.ReactNode }) {
  return (
    <li role="option" aria-selected={selected}>
      <button
        type="button"
        onClick={onSelect}
        className={cx(
          "ch-color-ease ch-focus-inset flex h-7 w-full cursor-pointer items-center gap-2 rounded-ch-control px-2 text-left text-ch-body outline-none hover:bg-ch-ghost-hover hover:text-ch-ink active:bg-ch-ghost-press",
          selected ? "text-ch-ink" : "text-ch-ink-muted",
        )}
      >
        <span className="min-w-0 flex-1 truncate">{children}</span>
        <CheckIcon className={cx("size-3.5 shrink-0", !selected && "invisible")} />
      </button>
    </li>
  );
}

export function MenuAction({ icon, disabled, onSelect, children }: { icon: React.ReactNode; disabled?: boolean; onSelect: () => void; children: React.ReactNode }) {
  return (
    <li role="none">
      <button
        type="button"
        role="menuitem"
        disabled={disabled}
        onClick={onSelect}
        className="ch-color-ease ch-focus-inset flex h-7 w-full cursor-pointer items-center gap-2 rounded-ch-control px-2 text-left text-ch-body text-ch-ink outline-none enabled:hover:bg-ch-ghost-hover enabled:active:bg-ch-ghost-press disabled:cursor-not-allowed disabled:text-ch-ink-subtle"
      >
        <span className="grid size-3.5 shrink-0 place-items-center text-ch-ink-muted">{icon}</span>
        <span className="min-w-0 flex-1 truncate">{children}</span>
      </button>
    </li>
  );
}

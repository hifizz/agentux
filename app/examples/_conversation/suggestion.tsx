import { FileIcon, FileSearchIcon, RefreshIcon } from "@/app/examples/_shared/ui/icons";
import type { Suggestion } from "./script/types";
import { AppMarkTip } from "@/app/examples/_shared/ui/app-mark";
import { cx } from "@/app/examples/_shared/ui/cx";

const ICON = { file: FileIcon, "file-search": FileSearchIcon, refresh: RefreshIcon } as const;

export function SuggestionRow({ suggestion, onPress }: { suggestion: Suggestion; onPress: () => void }) {
  const Icon = ICON[suggestion.icon];
  return (
    <li className="flex">
      <button
        type="button"
        onClick={onPress}
        className={cx(
          "ch-color-ease ch-focus-inset -mx-2 -my-1.5 flex h-7 cursor-pointer items-center gap-2 rounded-ch-control px-2 text-ch-body text-ch-ink outline-none",
          "hover:bg-ch-ghost-hover active:bg-ch-ghost-press",
        )}
      >
        <Icon className="size-4 shrink-0 text-ch-ink-muted" />
        <span className="flex items-center gap-1">
          {suggestion.parts.map((part, i) =>
            typeof part === "string" ? (
              <span key={i}>{part}</span>
            ) : (
              <span key={i} className="flex">
                {part.tools.map((tool, k) => (
                  <AppMarkTip key={tool.mark} mark={tool.mark} label={tool.label} lapped={k > 0} />
                ))}
              </span>
            ),
          )}
        </span>
      </button>
    </li>
  );
}

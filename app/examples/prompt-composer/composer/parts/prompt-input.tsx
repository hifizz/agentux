"use client";

import { cx } from "@/app/examples/_shared/ui/cx";
import { focusInput } from "./focus-input";

export type PromptInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  onEnter?: () => void;
  inputRef?: React.Ref<HTMLTextAreaElement>;
  autoFocus?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  density?: "regular" | "compact";
  header?: React.ReactNode;
  start?: React.ReactNode;
  end?: React.ReactNode;
  className?: string;
};

export function PromptInput({ value, onChange, placeholder, onEnter, inputRef, autoFocus, disabled, invalid, density = "regular", header, start, end, className }: PromptInputProps) {
  const compact = density === "compact";
  return (
    <div
      onMouseDown={focusInput}
      data-disabled={disabled || undefined}
      data-invalid={invalid || undefined}
      className={cx(
        "@container relative z-10 flex cursor-text flex-col rounded-ch-card border border-ch-line bg-ch-surface shadow-ch-bar transition-[border-color,box-shadow,opacity] not-focus-within:hover:border-ch-line-hover focus-within:border-ch-ink-subtle focus-within:shadow-[0_0_0_3px_var(--ch-ghost-hover),var(--ch-shadow-bar)] data-disabled:cursor-not-allowed data-disabled:opacity-60 data-invalid:border-ch-diff-del-ink",
        compact ? "gap-3 p-2.5" : "gap-6 p-3",
        className,
      )}
    >
      {header}
      <textarea
        ref={inputRef}
        autoFocus={autoFocus}
        aria-label="Message"
        aria-invalid={invalid || undefined}
        value={value}
        rows={1}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
            e.preventDefault();
            onEnter?.();
          }
        }}
        className={cx("w-full resize-none bg-transparent text-ch-body text-ch-ink [field-sizing:content] outline-none placeholder:text-ch-ink-subtle disabled:cursor-not-allowed", compact ? "max-h-32" : "max-h-40")}
      />
      {(start || end) && (
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-1.5">{start}</div>
          <div className="flex min-w-0 items-center gap-1.5">{end}</div>
        </div>
      )}
    </div>
  );
}

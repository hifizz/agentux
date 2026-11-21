"use client";

import { cx } from "@/app/examples/_shared/ui/cx";
import { focusInput } from "./focus-input";

export type ComposerCardProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  onEnter: () => void;
  inputRef?: React.Ref<HTMLTextAreaElement>;
  autoFocus?: boolean;
  disabled?: boolean;
  density?: "regular" | "compact";
  above?: React.ReactNode;
  toolbar: React.ReactNode;
};

export function ComposerCard({ value, onChange, placeholder, onEnter, inputRef, autoFocus, disabled, density = "regular", above, toolbar }: ComposerCardProps) {
  const compact = density === "compact";
  return (
    <div
      onMouseDown={focusInput}
      className={cx(
        "relative z-10 flex cursor-text flex-col rounded-ch-card border border-ch-line bg-ch-surface shadow-ch-bar transition-[border-color,box-shadow] not-focus-within:hover:border-ch-line-hover focus-within:border-ch-accent focus-within:shadow-[0_0_0_1px_var(--ch-accent),var(--ch-shadow-bar)]",
        compact ? "gap-3 p-2.5" : "gap-6 p-3",
      )}
    >
      {above}
      <textarea
        ref={inputRef}
        autoFocus={autoFocus}
        aria-label="Message"
        value={value}
        rows={1}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
            e.preventDefault();
            onEnter();
          }
        }}
        className={cx("w-full resize-none bg-transparent text-ch-body text-ch-ink [field-sizing:content] outline-none placeholder:text-ch-ink-subtle", compact ? "max-h-32" : "max-h-40")}
      />
      <div className="flex items-center justify-between gap-2">{toolbar}</div>
    </div>
  );
}

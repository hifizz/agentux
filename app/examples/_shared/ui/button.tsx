import { cx } from "./cx";

export type ButtonVariant = "ghost" | "chip" | "secondary" | "solid" | "tonal" | "primary" | "icon" | "iconRaised";
export type ButtonSize = "sm" | "md";

const VARIANT: Record<ButtonVariant, string> = {
  primary: "h-6 rounded-ch-control bg-ch-accent pr-2 pl-[5px] text-ch-on-accent enabled:hover:bg-ch-accent-hover enabled:active:bg-ch-accent-press",
  secondary:
    "h-6 rounded-ch-control border border-ch-line bg-ch-surface pr-2 pl-[5px] text-ch-ink shadow-ch-chip enabled:hover:bg-ch-secondary-hover enabled:active:bg-ch-secondary-press",
  ghost: "h-6 rounded-ch-control px-1.5 text-ch-ink enabled:hover:bg-ch-ghost-hover enabled:active:bg-ch-ghost-press",
  chip:
    "h-6 rounded-ch-control border border-ch-line bg-ch-surface pr-[5px] pl-1 text-ch-ink shadow-ch-chip [--press-squash:1] enabled:hover:bg-ch-secondary-hover enabled:active:bg-ch-surface enabled:active:hover:bg-ch-secondary-hover",
  solid: "h-6 rounded-ch-control bg-ch-solid pr-2 pl-[5px] text-ch-page enabled:hover:bg-ch-solid-hover enabled:active:bg-ch-solid-press",
  tonal:
    "h-6 rounded-ch-control border border-ch-tonal bg-ch-tonal pr-2 pl-1 text-ch-ink enabled:hover:border-ch-tonal-hover enabled:hover:bg-ch-tonal-hover enabled:active:border-ch-tonal-press enabled:active:bg-ch-tonal-press",
  icon: "size-6 rounded-ch-badge text-ch-ink-muted [--press-squash:0.92] enabled:hover:bg-ch-ghost-hover enabled:hover:text-ch-ink enabled:active:bg-ch-ghost-press",
  iconRaised:
    "size-6 rounded-ch-control border border-ch-line bg-ch-surface text-ch-ink shadow-ch-chip [--press-squash:0.92] enabled:hover:bg-ch-secondary-hover enabled:active:bg-ch-secondary-press",
};
const SIZE: Record<ButtonSize, string> = { sm: "", md: "h-8 rounded-ch-field px-2.5" };

type Props = React.ComponentProps<"button"> & { variant?: ButtonVariant; size?: ButtonSize };

export function Button({ variant = "secondary", size = "sm", className, type = "button", ...props }: Props) {
  return (
    <button
      type={type}
      {...props}
      className={cx(
        "ch-press ch-focus inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 text-ch-body outline-none disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none",
        VARIANT[variant],
        SIZE[size],
        className,
      )}
    />
  );
}

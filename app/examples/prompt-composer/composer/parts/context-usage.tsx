"use client";

import { motion, useReducedMotion } from "motion/react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/base";
import { cx } from "@/app/examples/_shared/ui/cx";
import { EASE_MORPH } from "@/app/examples/_shared/ui/motion";
import { formatTokens } from "../tables";
import type { ContextControl, ContextSegment } from "../types";

const SWATCH = ["bg-ch-ink", "bg-ch-ink-muted", "bg-ch-ink-subtle", "bg-ch-line-hover", "bg-ch-line"];

export function usedTokens(segments: readonly ContextSegment[]) {
  return segments.reduce((n, s) => n + s.tokens, 0);
}

function level(ratio: number) {
  return ratio >= 0.95 ? "text-ch-diff-del-ink" : ratio >= 0.8 ? "text-ch-frontend-ink" : "text-ch-ink-muted";
}

export type TokenCountProps = { used: number; window: number; showLabel?: boolean; className?: string };

export function TokenCount({ used, window, showLabel = true, className }: TokenCountProps) {
  const reduced = useReducedMotion();
  const ratio = window > 0 ? Math.min(used / window, 1) : 0;
  const c = 2 * Math.PI * 6;
  return (
    <span className={cx("flex h-6 items-center gap-1.5 text-ch-caption tabular-nums", level(ratio), className)}>
      <svg viewBox="0 0 16 16" className="size-3.5 -rotate-90" aria-hidden>
        <circle cx="8" cy="8" r="6" fill="none" strokeWidth="2" className="stroke-ch-line" />
        <motion.circle
          cx="8"
          cy="8"
          r="6"
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
          stroke="currentColor"
          strokeDasharray={c}
          initial={false}
          animate={{ strokeDashoffset: c * (1 - ratio) }}
          transition={reduced ? { duration: 0 } : { duration: 0.4, ease: EASE_MORPH }}
        />
      </svg>
      {showLabel && (
        <span>
          {formatTokens(used)}
          <span className="text-ch-ink-subtle"> / {formatTokens(window)}</span>
        </span>
      )}
    </span>
  );
}

export type ContextBreakdownProps = ContextControl;

export function ContextBreakdown({ window, segments, reserved = 0 }: ContextBreakdownProps) {
  const reduced = useReducedMotion();
  const used = usedTokens(segments);
  const free = Math.max(window - used - reserved, 0);
  const pct = (n: number) => (window > 0 ? (n / window) * 100 : 0);
  return (
    <div className="flex flex-col gap-3 p-3">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-ch-body text-ch-ink">Context window</span>
        <span className="text-ch-caption text-ch-ink-muted tabular-nums">
          {formatTokens(used)} / {formatTokens(window)} · {Math.round(pct(used))}%
        </span>
      </div>
      <div className="flex h-2 overflow-hidden rounded-full bg-ch-sunken" role="img" aria-label={`${Math.round(pct(used))}% of the context window used`}>
        {segments.map((s, i) => (
          <motion.span
            key={s.id}
            className={cx("h-full border-r border-ch-surface last:border-r-0", SWATCH[i % SWATCH.length])}
            initial={false}
            animate={{ width: `${pct(s.tokens)}%` }}
            transition={reduced ? { duration: 0 } : { duration: 0.4, ease: EASE_MORPH }}
          />
        ))}
        {reserved > 0 && <span className="h-full bg-[repeating-linear-gradient(135deg,var(--ch-line)_0_2px,transparent_2px_4px)]" style={{ width: `${pct(reserved)}%` }} />}
      </div>
      <ul className="flex flex-col gap-1">
        {segments.map((s, i) => (
          <li key={s.id} className="flex items-center gap-2 text-ch-caption">
            <span aria-hidden className={cx("size-2 shrink-0 rounded-[2px]", SWATCH[i % SWATCH.length])} />
            <span className="min-w-0 flex-1 truncate text-ch-ink-muted">{s.label}</span>
            <span className="text-ch-ink tabular-nums">{formatTokens(s.tokens)}</span>
            <span className="w-9 text-right text-ch-ink-subtle tabular-nums">{pct(s.tokens).toFixed(1)}%</span>
          </li>
        ))}
        {reserved > 0 && (
          <li className="flex items-center gap-2 text-ch-caption">
            <span aria-hidden className="size-2 shrink-0 rounded-[2px] bg-[repeating-linear-gradient(135deg,var(--ch-line-hover)_0_1px,transparent_1px_3px)]" />
            <span className="min-w-0 flex-1 truncate text-ch-ink-muted">Reserved for output</span>
            <span className="text-ch-ink tabular-nums">{formatTokens(reserved)}</span>
            <span className="w-9 text-right text-ch-ink-subtle tabular-nums">{pct(reserved).toFixed(1)}%</span>
          </li>
        )}
        <li className="flex items-center gap-2 border-t border-ch-line-soft pt-1.5 text-ch-caption">
          <span aria-hidden className="size-2 shrink-0 rounded-[2px] border border-ch-line" />
          <span className="min-w-0 flex-1 text-ch-ink-muted">Free space</span>
          <span className="text-ch-ink tabular-nums">{formatTokens(free)}</span>
          <span className="w-9 text-right text-ch-ink-subtle tabular-nums">{pct(free).toFixed(1)}%</span>
        </li>
      </ul>
      {pct(used) >= 80 && <p className="text-ch-caption text-ch-ink-muted">Older turns will be summarised when the window fills up.</p>}
    </div>
  );
}

export type ContextUsageProps = ContextControl & { disabled?: boolean };

export function ContextUsage({ disabled, ...context }: ContextUsageProps) {
  const used = usedTokens(context.segments);
  return (
    <Popover>
      <PopoverTrigger
        openOnHover
        delay={150}
        disabled={disabled}
        aria-label={`Context: ${formatTokens(used)} of ${formatTokens(context.window)} tokens`}
        className="ch-color-ease flex h-6 cursor-pointer items-center rounded-ch-control px-1 outline-none hover:bg-ch-ghost-hover focus-visible:ring-2 focus-visible:ring-ch-focus data-popup-open:bg-ch-ghost-hover"
      >
        <TokenCount used={used} window={context.window} showLabel={false} />
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[280px]">
        <ContextBreakdown {...context} />
      </PopoverContent>
    </Popover>
  );
}

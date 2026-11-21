"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "motion/react";
import { cx } from "./cx";

type RollCtx = { direction: number; animate: boolean; reduced: boolean };

const SPRING = { type: "spring", bounce: 0, visualDuration: 0.18 } as const;

const VARIANTS: Variants = {
  enter: ({ direction, reduced }: RollCtx) => (reduced ? { opacity: 0 } : { y: direction > 0 ? "100%" : "-100%", opacity: 0 }),
  center: { y: "0%", opacity: 1 },
  exit: ({ direction, animate, reduced }: RollCtx) =>
    animate
      ? reduced
        ? { opacity: 0, transition: SPRING }
        : { y: direction > 0 ? "-100%" : "100%", opacity: 0, transition: SPRING }
      : { opacity: 0, transition: { duration: 0 } },
};

export function Roll({
  value,
  direction,
  animate = true,
  wrap = false,
  className,
}: {
  value: string | number;
  direction: number;
  animate?: boolean;
  wrap?: boolean;
  className?: string;
}) {
  const custom: RollCtx = { direction, animate, reduced: useReducedMotion() ?? false };
  return (
    <span className={cx("grid overflow-hidden", className)}>
      <AnimatePresence initial={false} custom={custom}>
        <motion.span
          key={value}
          data-value={value}
          custom={custom}
          variants={VARIANTS}
          initial={animate ? "enter" : false}
          animate="center"
          exit="exit"
          transition={animate ? SPRING : { duration: 0 }}
          className={cx("col-start-1 row-start-1", wrap ? "w-full min-w-0" : "w-max")}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export function RollText({ value }: { value: string }) {
  return (
    <span className="flex">
      {[...value].map((ch, i) => (
        <Roll key={i} value={ch === " " ? "\u00A0" : ch} direction={1} className="h-[15px] leading-[15px]" />
      ))}
    </span>
  );
}

export function useRollDirection(value: number) {
  const [tally, setTally] = useState({ value, direction: 1 });
  if (tally.value !== value) setTally({ value, direction: value > tally.value ? 1 : -1 });
  return tally.direction;
}

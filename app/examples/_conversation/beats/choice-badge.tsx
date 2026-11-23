"use client";

import { motion, useReducedMotion } from "motion/react";
import { EASE_MORPH } from "@/app/examples/_shared/ui/motion";

const POP = { type: "spring", bounce: 0.32, visualDuration: 0.22 } as const;
const TICK = { type: "spring", bounce: 0.32, visualDuration: 0.18, delay: 0.05 } as const;

export function ChoiceBadge({ chosen = false, children }: { chosen?: boolean; children: React.ReactNode }) {
  const reduced = useReducedMotion();
  const off = { duration: 0 };
  return (
    <span aria-hidden className="relative grid size-5 shrink-0 place-items-center overflow-hidden rounded-ch-badge bg-ch-tonal text-ch-caption text-ch-ink-muted tabular-nums">
      <motion.span
        className="absolute inset-0 rounded-ch-badge bg-ch-accent"
        initial={false}
        animate={{ scale: chosen ? 1 : 0 }}
        transition={reduced ? off : chosen ? POP : { duration: 0.16, ease: EASE_MORPH }}
      />
      <motion.span
        className="relative"
        initial={false}
        animate={chosen ? { opacity: 0, scale: 0.6 } : { opacity: 1, scale: 1 }}
        transition={reduced ? off : { duration: 0.14, ease: EASE_MORPH }}
      >
        {children}
      </motion.span>
      <motion.svg
        className="absolute size-3.5 text-ch-on-accent"
        viewBox="0 0 14 14"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={false}
        animate={{ scale: chosen ? 1 : 0, opacity: chosen ? 1 : 0 }}
        transition={
          reduced
            ? off
            : chosen
              ? { scale: TICK, opacity: { duration: 0.06, delay: 0.05 } }
              : { scale: { duration: 0.12, ease: EASE_MORPH }, opacity: { duration: 0.08 } }
        }
      >
        <path d="M3 7.5L5.8 10.3L11 4.7" />
      </motion.svg>
    </span>
  );
}

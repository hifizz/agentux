"use client";

import { motion, useReducedMotion } from "motion/react";
import { BLUR_IN, EASE_MORPH } from "./motion";

export function Reveal({ className, children }: { className?: string; children: React.ReactNode }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? { opacity: 0 } : BLUR_IN.from}
      animate={BLUR_IN.to}
      transition={reduced ? { duration: 0 } : { duration: 0.32, ease: EASE_MORPH }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({ className, delay = 0, children }: { className?: string; delay?: number; children: React.ReactNode }) {
  const reduced = useReducedMotion();
  return (
    <motion.li
      className={className}
      initial={reduced ? { opacity: 0 } : { ...BLUR_IN.from, y: 6 }}
      animate={{ ...BLUR_IN.to, y: 0 }}
      transition={reduced ? { duration: 0 } : { duration: 0.28, ease: EASE_MORPH, delay }}
    >
      {children}
    </motion.li>
  );
}

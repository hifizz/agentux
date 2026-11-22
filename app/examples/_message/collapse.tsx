"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { EASE_OUT_STRONG } from "@/app/examples/_shared/ui/motion";

export function Collapse({ open, className, children }: { open: boolean; className?: string; children: React.ReactNode }) {
  const reduced = useReducedMotion();
  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          key="collapse"
          className="overflow-hidden"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={reduced ? { duration: 0 } : { duration: 0.22, ease: EASE_OUT_STRONG }}
        >
          <div className={className}>{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

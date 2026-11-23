"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cx } from "@/app/examples/_shared/ui/cx";
import { EASE_OUT_STRONG } from "@/app/examples/_shared/ui/motion";

export function BubbleCollapse({ open, className, children }: { open: boolean; className?: string; children: React.ReactNode }) {
  const reduced = useReducedMotion();
  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          key="detail"
          className="overflow-hidden"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={reduced ? { duration: 0 } : { duration: 0.22, ease: EASE_OUT_STRONG }}
        >
          <div className={cx("bubble-detail", className)}>{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

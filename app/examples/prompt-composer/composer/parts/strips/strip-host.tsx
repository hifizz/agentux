"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { EASE_MORPH } from "../../../shared/ui/motion";
import type { Strip } from "../../types";
import { ChangesStripView } from "./changes-strip";
import { GoalStripView } from "./goal-strip";
import { QueueStripView } from "./queue-strip";
import { UsageStripView } from "./usage-strip";

const PEEK = 16;

export type StripHostProps = {
  strip: Strip | undefined;
  collapsed: boolean;
  onDismissUsage: () => void;
};

export function StripHost({ strip, collapsed, onDismissUsage }: StripHostProps) {
  const reduced = useReducedMotion();
  const [settled, setSettled] = useState(true);
  const move = reduced ? { duration: 0 } : { duration: 0.24, ease: EASE_MORPH };
  return (
    <AnimatePresence initial={false}>
      {strip && (
        <motion.div
          key={strip.kind}
          className="shrink-0"
          style={{ overflow: settled && !collapsed ? "visible" : "hidden" }}
          initial={{ height: 0 }}
          animate={{ height: collapsed ? PEEK : "auto" }}
          exit={{ height: 0 }}
          transition={move}
          onAnimationStart={() => setSettled(false)}
          onAnimationComplete={() => setSettled(true)}
          inert={collapsed || undefined}
        >
          <motion.div initial={false} animate={{ opacity: collapsed ? 0 : 1 }} transition={move}>
            {strip.kind === "usage" && <UsageStripView strip={strip} onDismiss={onDismissUsage} />}
            {strip.kind === "queue" && <QueueStripView strip={strip} />}
            {strip.kind === "goal" && <GoalStripView strip={strip} />}
            {strip.kind === "changes" && <ChangesStripView strip={strip} />}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

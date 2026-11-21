"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

export function useSteps(delays: readonly number[], active = true) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (!active || step >= delays.length) return;
    const id = window.setTimeout(() => setStep((s) => s + 1), delays[step]);
    return () => window.clearTimeout(id);
  }, [active, step, delays]);
  return step;
}

export function useStream(text: string, active = true, chars = 4, ms = 28) {
  const reduced = useReducedMotion();
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active || reduced) return;
    const id = window.setInterval(() => setCount((n) => Math.min(text.length, n + chars)), ms);
    return () => window.clearInterval(id);
  }, [active, reduced, text, chars, ms]);
  const shown = reduced && active ? text.length : count;
  return { text: text.slice(0, shown), done: shown >= text.length };
}

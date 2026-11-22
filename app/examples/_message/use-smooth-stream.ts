"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

export type SmoothStreamOptions = { minRate?: number; lag?: number };

export function useSmoothStream(target: string, { minRate = 60, lag = 0.6 }: SmoothStreamOptions = {}) {
  const reduced = useReducedMotion();
  const [count, setCount] = useState(0);
  const pos = useRef(0);
  const size = target.length;

  useEffect(() => {
    if (reduced) return;
    pos.current = Math.min(pos.current, size);
    let last = performance.now();
    let raf = requestAnimationFrame(function tick(now) {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const backlog = size - pos.current;
      if (backlog <= 0) return;
      // speed scales with the backlog so bursts drain in about `lag` seconds
      pos.current = Math.min(size, pos.current + Math.max(minRate, backlog / lag) * dt);
      setCount(Math.floor(pos.current));
      raf = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(raf);
  }, [size, reduced, minRate, lag]);

  const shown = reduced ? size : Math.min(count, size);
  return { text: target.slice(0, shown), caughtUp: shown >= size };
}

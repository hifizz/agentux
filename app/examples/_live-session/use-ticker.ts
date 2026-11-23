"use client";

import { useEffect, useRef, useState } from "react";

export function useElapsed(base: number, live: boolean) {
  const [extra, setExtra] = useState(0);
  useEffect(() => {
    if (!live) return;
    const id = window.setInterval(() => setExtra((n) => n + 1), 1000);
    return () => window.clearInterval(id);
  }, [live]);
  return base + (live ? extra : 0);
}

export function useTween(target: number, duration = 700) {
  const [value, setValue] = useState(target);
  const current = useRef(target);
  useEffect(() => {
    const from = current.current;
    if (from === target) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      current.current = target;
      const frame = requestAnimationFrame(() => setValue(target));
      return () => cancelAnimationFrame(frame);
    }
    const start = performance.now();
    let frame = requestAnimationFrame(function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      current.current = from + (target - from) * eased;
      setValue(current.current);
      if (t < 1) frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);
  return { value, moving: Math.abs(value - target) > 0.5 };
}

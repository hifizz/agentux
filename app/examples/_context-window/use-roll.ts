"use client";

import { useEffect, useRef, useState } from "react";

export function useRoll(to: number) {
  const [shown, setShown] = useState(to);
  const current = useRef(to);

  useEffect(() => {
    const from = current.current;
    if (from === to) return;
    const quiet = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = performance.now();
    let frame = 0;
    const step = (now: number) => {
      const k = quiet ? 1 : Math.min(1, Math.max(0, (now - start) / 620));
      current.current = from + (to - from) * (1 - Math.pow(1 - k, 4));
      setShown(current.current);
      if (k < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [to]);

  return shown;
}

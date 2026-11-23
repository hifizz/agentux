"use client";

import { useCallback, useEffect, useState } from "react";

type Options = { total: number; speed?: number; hold?: number; frameMs?: number };

export function useTraceClock({ total, speed = 6, hold = 3500, frameMs = 90 }: Options) {
  const [now, setNow] = useState(0);
  const [run, setRun] = useState(0);

  useEffect(() => {
    let frame = 0;
    let last = performance.now();
    let clock = 0;
    let held = 0;
    let shown = 0;
    const tick = (time: number) => {
      const delta = Math.min(time - last, 1000);
      last = time;
      if (clock >= total) {
        held += delta;
        if (held >= hold) {
          clock = 0;
          held = 0;
        }
      } else {
        clock = Math.min(total, clock + delta * speed);
      }
      if (Math.abs(clock - shown) >= frameMs * speed * 0.5 || clock === 0 || clock === total) {
        shown = clock;
        setNow(clock);
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [total, speed, hold, frameMs, run]);

  const replay = useCallback(() => setRun((n) => n + 1), []);
  return { now, replay };
}

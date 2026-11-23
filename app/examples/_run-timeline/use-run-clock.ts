"use client";

import { useCallback, useEffect, useState } from "react";

type Options = { end: number; hold?: number; tickMs?: number };

export function useRunClock({ end, hold = 7, tickMs = 500 }: Options) {
  const [now, setNow] = useState(0);
  const [run, setRun] = useState(0);

  useEffect(() => {
    const started = performance.now();
    const id = window.setInterval(() => {
      const seconds = (performance.now() - started) / 1000;
      if (seconds >= end + hold) return setRun((n) => n + 1);
      setNow(Math.min(end, Math.round((seconds * 1000) / tickMs) * (tickMs / 1000)));
    }, tickMs);
    return () => window.clearInterval(id);
  }, [end, hold, tickMs, run]);

  const replay = useCallback(() => {
    setNow(0);
    setRun((n) => n + 1);
  }, []);

  return { now, replay };
}

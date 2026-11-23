"use client";

import { useCallback, useEffect, useState } from "react";
import { REQUESTS } from "./script";

const LIVE_MS = 1600;
const COUNTED_MS = 1800;

export function useContextScript() {
  const [step, setStep] = useState(0);
  const [run, setRun] = useState(0);

  useEffect(() => {
    if (step >= REQUESTS.length * 2 - 1) return;
    const id = window.setTimeout(() => setStep((n) => n + 1), step % 2 === 0 ? LIVE_MS : COUNTED_MS);
    return () => window.clearTimeout(id);
  }, [step, run]);

  const replay = useCallback(() => {
    setStep(0);
    setRun((n) => n + 1);
  }, []);

  const index = Math.floor(step / 2);
  return { index, live: step % 2 === 0, replay };
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useCopy(text: string | (() => string), resetMs = 1500) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const copy = useCallback(() => {
    navigator.clipboard?.writeText(typeof text === "function" ? text() : text).catch(() => {});
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), resetMs);
  }, [text, resetMs]);
  return [copied, copy] as const;
}

"use client";

import { useEffect, useState } from "react";

const seeded = (seed: number) => () => {
  seed = (seed * 16807) % 2147483647;
  return seed / 2147483647;
};

export function useBurstStream(text: string, active = true, seed = 7) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    const rand = seeded(seed);
    let timer = 0;
    let n = 0;
    const push = () => {
      n = Math.min(text.length, n + 2 + Math.floor(rand() * 48));
      setCount(n);
      if (n < text.length) timer = window.setTimeout(push, 60 + rand() * 420);
    };
    timer = window.setTimeout(push, 200);
    return () => window.clearTimeout(timer);
  }, [text, active, seed]);
  return { text: text.slice(0, count), done: count >= text.length };
}

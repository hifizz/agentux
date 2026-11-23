"use client";

import { useEffect, useState, type RefObject } from "react";

const scrollParent = (element: HTMLElement | null) => {
  for (let parent = element?.parentElement; parent; parent = parent.parentElement) {
    const overflow = getComputedStyle(parent).overflowY;
    if (overflow === "auto" || overflow === "scroll") return parent;
  }
  return null;
};

export function useNarrow(ref: RefObject<HTMLElement | null>, below: number) {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => setNarrow(entry.contentRect.width < below));
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, below]);
  return narrow;
}

export function useScrollerHeight(ref: RefObject<HTMLElement | null>) {
  const [height, setHeight] = useState<number | null>(null);
  useEffect(() => {
    const parent = scrollParent(ref.current);
    const observer = new ResizeObserver(() => setHeight(parent ? parent.clientHeight : window.innerHeight));
    observer.observe(parent ?? document.documentElement);
    return () => observer.disconnect();
  }, [ref]);
  return height;
}

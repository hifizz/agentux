"use client";

import { createContext, useContext, useEffect, useMemo, useRef } from "react";
import { cx } from "./cx";

const HoldContext = createContext<null | (() => () => void)>(null);

const DURATION = 220;
const EASING = "cubic-bezier(0.5, 0, 0.1, 1)";

export function AutoHeight({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const parentHold = useContext(HoldContext);
  const holds = useRef(0);
  const onIdle = useRef<(() => void) | null>(null);

  const hold = useMemo(
    () => () => {
      holds.current += 1;
      const releaseParent = parentHold?.();
      let released = false;
      return () => {
        if (released) return;
        released = true;
        holds.current -= 1;
        if (holds.current === 0) onIdle.current?.();
        releaseParent?.();
      };
    },
    [parentHold],
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let last: number | null = null;
    let anim: Animation | null = null;
    let release: (() => void) | null = null;

    onIdle.current = () => {
      if (!anim) last = el.getBoundingClientRect().height;
    };

    const measure = (next: number) => {
      if (last === null || Math.abs(next - last) < 0.5 || reduced.matches) {
        last = next;
        return;
      }
      const from = anim ? el.getBoundingClientRect().height : last;
      anim?.cancel();
      last = next;
      const a = el.animate([{ height: `${from}px` }, { height: `${next}px` }], { duration: DURATION, easing: EASING, fill: "none" });
      anim = a;
      release ??= parentHold?.() ?? null;
      a.onfinish = () => {
        if (anim !== a) return;
        anim = null;
        measure(el.getBoundingClientRect().height);
        if (!anim) {
          release?.();
          release = null;
        }
      };
    };

    const ro = new ResizeObserver(() => {
      if (anim || holds.current > 0) return;
      measure(el.getBoundingClientRect().height);
    });
    ro.observe(el);
    return () => {
      ro.disconnect();
      anim?.cancel();
      release?.();
      onIdle.current = null;
    };
  }, [parentHold]);

  return (
    <HoldContext.Provider value={hold}>
      <div ref={ref} className={cx("flex flex-col", className)}>
        {children}
      </div>
    </HoldContext.Provider>
  );
}

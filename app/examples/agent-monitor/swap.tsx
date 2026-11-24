import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useLayoutEffect, useRef, type ReactNode } from "react";

export function Swap({ value, roll = false, children }: { value: string; roll?: boolean; children: ReactNode }) {
  const reduce = useReducedMotion();
  const box = useRef<HTMLSpanElement>(null);
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const layers = el.querySelectorAll<HTMLElement>(".am-layer");
    for (const layer of layers) layer.inert = layer.dataset.value !== value;
    const active = Array.from(layers).find(layer => !layer.inert);
    if (roll || !active) return;
    const measure = () => { el.style.width = active.offsetWidth+"px"; };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(active);
    return () => observer.disconnect();
  },[value, roll]);
  const offset = roll ? { y: "70%" } : { scale: 0.88 };
  return <span ref={box} className={roll ? "am-swap am-roll" : "am-swap am-fit"}><AnimatePresence initial={false} mode="popLayout">
    <motion.span key={value} data-value={value} className="am-layer" initial={{ opacity: 0, filter: "blur(2px)", ...offset }}
      animate={{ opacity: 1, filter: "blur(0px)", y: 0, scale: 1 }}
      exit={{ opacity: 0, filter: "blur(2px)", ...(roll ? { y: "-70%" } : { scale: 0.88 }), pointerEvents: "none" }}
      transition={{ duration: reduce ? 0 : 0.38, ease: [0.32, 0.72, 0.24, 1] }}>{children}</motion.span>
  </AnimatePresence></span>;
}

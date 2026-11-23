"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cx } from "@/app/examples/_shared/ui/cx";
import "./message.css";

export type ShadowScrollProps = {
  children: React.ReactNode;
  follow?: boolean;
  fade?: number;
  jumpLabel?: string;
  className?: string;
  contentClassName?: string;
};

const EDGE = 4;

export function ShadowScroll({ children, follow = false, fade = 32, jumpLabel = "Jump to latest", className, contentClassName }: ShadowScrollProps) {
  const reduced = useReducedMotion();
  const scroller = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const pinned = useRef(follow);
  const lastTop = useRef(0);
  const [edges, setEdges] = useState({ top: false, bottom: false });
  const [away, setAway] = useState(false);

  const measure = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    const top = el.scrollTop > EDGE;
    const bottom = el.scrollHeight - el.clientHeight - el.scrollTop > EDGE;
    setEdges((e) => (e.top === top && e.bottom === bottom ? e : { top, bottom }));
    if (!bottom) pinned.current = follow;
    setAway(follow && !pinned.current);
  }, [follow]);

  const onScroll = () => {
    const el = scroller.current;
    if (!el) return;
    if (el.scrollTop < lastTop.current - 1) pinned.current = false;
    lastTop.current = el.scrollTop;
    measure();
  };

  useEffect(() => {
    const el = scroller.current;
    const inner = content.current;
    if (!el || !inner) return;
    const observer = new ResizeObserver(() => {
      if (follow && pinned.current) el.scrollTop = el.scrollHeight;
      lastTop.current = el.scrollTop;
      measure();
    });
    observer.observe(inner);
    observer.observe(el);
    return () => observer.disconnect();
  }, [follow, measure]);

  const jump = () => {
    const el = scroller.current;
    if (!el) return;
    pinned.current = true;
    el.scrollTo({ top: el.scrollHeight, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <div className={cx("relative flex min-h-0 flex-col", className)}>
      <div
        ref={scroller}
        onScroll={onScroll}
        tabIndex={0}
        className="tf-scroll-mask ch-focus-inset min-h-0 flex-1 overflow-y-auto overscroll-contain outline-none"
        style={{ "--tf-fade-top": edges.top ? `${fade}px` : "0px", "--tf-fade-bottom": edges.bottom ? `${fade}px` : "0px" } as React.CSSProperties}
      >
        <div ref={content} className={contentClassName}>
          {children}
        </div>
      </div>
      <AnimatePresence>
        {away && (
          <motion.button
            type="button"
            onClick={jump}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: reduced ? 0 : 0.16 }}
            className="ch-focus ch-press absolute bottom-3 left-1/2 flex h-7 -translate-x-1/2 cursor-pointer items-center gap-1.5 rounded-full border border-ch-line bg-ch-surface pr-3 pl-2.5 text-ch-caption text-ch-ink shadow-ch-chip"
          >
            <ArrowDown className="size-3.5" />
            {jumpLabel}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cx } from "./cx";

type Anchor = { x: number; y: number; root: Element };

export function Tooltip({ label, disabled, children }: { label: string; disabled?: boolean; children: React.ReactNode }) {
  const host = useRef<HTMLSpanElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const [anchor, setAnchor] = useState<Anchor | null>(null);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const hide = () => {
    window.clearTimeout(timer.current);
    setAnchor(null);
  };
  const show = () => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      const el = host.current?.firstElementChild;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setAnchor({ x: r.left + r.width / 2, y: r.top, root: host.current?.closest(".ab-root") ?? document.body });
    }, 300);
  };

  return (
    <span
      ref={host}
      className="contents"
      onPointerEnter={(e) => !disabled && e.pointerType !== "touch" && show()}
      onPointerLeave={hide}
      onPointerDown={hide}
      onBlur={hide}
    >
      {children}
      {anchor &&
        createPortal(
          <span
            role="tooltip"
            style={{ left: anchor.x, top: anchor.y - 6 }}
            className={cx("ch-anim-pop-in pointer-events-none fixed z-[100001] -translate-x-1/2 -translate-y-full rounded-ch-control bg-ch-ink px-2 py-1 text-ch-body whitespace-nowrap text-ch-page shadow-ch-pop")}
          >
            {label}
          </span>,
          anchor.root,
        )}
    </span>
  );
}

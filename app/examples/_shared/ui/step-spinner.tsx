"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export function StepSpinner({ done }: { done: boolean }) {
  const svg = useRef<SVGSVGElement>(null);
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    const el = svg.current;
    if (!done || !el || settled) return;
    const part = (name: string) => el.querySelector(`[data-part="${name}"]`);
    const tl = gsap.timeline({ onComplete: () => setSettled(true) });
    tl.to([part("track"), part("arc")], { opacity: 0, scale: 0.5, transformOrigin: "50% 50%", duration: 0.22, ease: "power2.in" });
    tl.fromTo(part("tick"), { strokeDashoffset: 100, opacity: 1 }, { strokeDashoffset: 0, duration: 0.3, ease: "power2.out" }, 0.12);
    return () => {
      tl.kill();
    };
  }, [done, settled]);

  return (
    <span aria-hidden className="grid size-4 shrink-0 place-items-center">
      <svg ref={svg} width="14" height="14" viewBox="0 0 14 14" className="text-ch-step-mark">
        {!settled && (
          <g className={done ? undefined : "ch-anim-spin origin-center"}>
            <circle data-part="track" cx="7" cy="7" r="5.25" fill="none" stroke="currentColor" strokeWidth="1" opacity={0.25} />
            <path data-part="arc" d="M12.25 7C12.25 4.1005 9.8995 1.75 7 1.75" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
          </g>
        )}
        <path
          data-part="tick"
          d="M11 4.5L5.5 9.5L3 7.227"
          pathLength={100}
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={100}
          strokeDashoffset={settled ? 0 : 100}
          opacity={done ? 1 : 0}
        />
      </svg>
    </span>
  );
}

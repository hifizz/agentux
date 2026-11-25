"use client";

import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  FIRST_WAVE,
  MORPH,
  REST,
  RING,
  STAGGER,
  TRAVEL,
  beamD,
  beamGeo,
  clamp,
  easeInOutSine,
  easeOutQuint,
  fill,
  lerpGeo,
  segLen,
  type BeamGeo,
} from "./beam-model";
import { IB_LABELS, type BeamCenter, type BeamTool, type IbLabels } from "./types";
import "./integration-beam.css";

export type IntegrationBeamProps = {
  left?: BeamTool[];
  right?: BeamTool[];
  center?: BeamCenter;
  label?: string;
  labels?: Partial<IbLabels>;
  className?: string;
};

type Engine = {
  beams: (BeamGeo | null)[];
  targets: (BeamGeo | null)[];
  lens: number[];
  morphFrom: (BeamGeo | null)[] | null;
  morphStart: number;
  pulseStart: (number | null)[];
  queue: { beam: number; at: number }[];
  nextCycle: number;
  syncFrom: number;
  syncTo: number;
  visible: boolean;
  syncOn: boolean;
  raf: number;
};

function DefaultMark() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="18.5" cy="24" r="10.5" fill="none" stroke="currentColor" strokeWidth="5" opacity="0.55" />
      <circle cx="29.5" cy="24" r="10.5" fill="none" stroke="currentColor" strokeWidth="5" />
    </svg>
  );
}

const keyIn = (j: number) => `l${j}`;
const keyOut = (j: number) => `r${j}`;

export function IntegrationBeam({ left = [], right = [], center = { name: "Merge" }, label, labels, className }: IntegrationBeamProps) {
  const L = useMemo(() => ({ ...IB_LABELS, ...labels }), [labels]);
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const inCount = left.length;
  const outCount = right.length;
  const beamCount = inCount + outCount;

  const rootRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const hubRef = useRef<HTMLDivElement>(null);
  const hubRingRef = useRef<HTMLSpanElement>(null);
  const chipRef = useRef<HTMLSpanElement>(null);
  const chipInnerRef = useRef<HTMLSpanElement>(null);
  const tileEls = useRef<Record<string, HTMLElement | null>>({});
  const ringEls = useRef<Record<string, HTMLElement | null>>({});
  const lineEls = useRef<(SVGPathElement | null)[]>([]);
  const glowEls = useRef<(SVGPathElement | null)[]>([]);
  const coreEls = useRef<(SVGPathElement | null)[]>([]);
  const gradEls = useRef<(SVGLinearGradientElement | null)[]>([]);
  const pulseEls = useRef<(SVGGElement | null)[]>([]);

  const [paused, setPaused] = useState<Set<string>>(() => new Set());
  const [hoverKey, setHoverKey] = useState<string | null>(null);
  const [focusKey, setFocusKey] = useState<string | null>(null);
  const [flashKey, setFlashKey] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [sr, setSr] = useState("");
  const flashTimer = useRef(0);

  const engRef = useRef<Engine | null>(null);

  const pausedRef = useRef(paused);
  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  const reducedRef = useRef(false);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || !beamCount) return undefined;
    if (!engRef.current) {
      engRef.current = {
        beams: [],
        targets: [],
        lens: [],
        morphFrom: null,
        morphStart: 0,
        pulseStart: [],
        queue: [],
        nextCycle: 0,
        syncFrom: 0,
        syncTo: 0,
        visible: true,
        syncOn: false,
        raf: 0,
      };
    }
    const eng = engRef.current;
    const pulseList = pulseEls.current;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedRef.current = mq.matches;
    const onMotionChange = () => {
      reducedRef.current = mq.matches;
      if (!mq.matches) {
        eng.nextCycle = performance.now() + FIRST_WAVE;
        kick();
      }
    };
    mq.addEventListener("change", onMotionChange);

    eng.pulseStart = Array.from({ length: beamCount }, () => null);
    eng.queue = [];
    eng.syncOn = false;
    eng.visible = true;
    eng.nextCycle = performance.now() + FIRST_WAVE;

    const applyBeam = (i: number) => {
      const g = eng.beams[i];
      const line = lineEls.current[i];
      if (!g || !line) return;
      const d = beamD(g);
      line.setAttribute("d", d);
      const glow = glowEls.current[i];
      const core = coreEls.current[i];
      if (glow) glow.setAttribute("d", d);
      if (core) core.setAttribute("d", d);
      eng.lens[i] = line.getTotalLength();
    };

    const measure = (snap: boolean) => {
      const svg = svgRef.current;
      const hub = hubRef.current;
      if (!svg || !hub) return;
      const rr = root.getBoundingClientRect();
      if (!rr.width) return;
      svg.setAttribute("viewBox", `0 0 ${rr.width} ${rr.height}`);
      const hr = hub.getBoundingClientRect();
      const hc = { x: hr.left + hr.width / 2 - rr.left, y: hr.top + hr.height / 2 - rr.top };
      const targets: (BeamGeo | null)[] = [];
      let ok = true;
      for (let j = 0; j < inCount; j++) {
        const el = tileEls.current[keyIn(j)];
        if (!el) {
          ok = false;
          break;
        }
        const tr = el.getBoundingClientRect();
        const tc = { x: tr.left + tr.width / 2 - rr.left, y: tr.top + tr.height / 2 - rr.top };
        targets[j] = beamGeo(tc, hc);
      }
      for (let j = 0; j < outCount && ok; j++) {
        const el = tileEls.current[keyOut(j)];
        if (!el) {
          ok = false;
          break;
        }
        const tr = el.getBoundingClientRect();
        const tc = { x: tr.left + tr.width / 2 - rr.left, y: tr.top + tr.height / 2 - rr.top };
        targets[inCount + j] = beamGeo(hc, tc);
      }
      if (!ok) return;
      eng.targets = targets;
      const first = !eng.beams.some(Boolean);
      if (first || snap || reducedRef.current) {
        eng.beams = targets.slice();
        eng.morphFrom = null;
        for (let i = 0; i < beamCount; i++) applyBeam(i);
      } else {
        eng.morphFrom = eng.beams.map((b, i) => b ?? targets[i]);
        eng.morphStart = performance.now();
        kick();
      }
    };

    const hide = (i: number) => {
      eng.pulseStart[i] = null;
      const g = pulseEls.current[i];
      if (g) g.style.opacity = "0";
    };

    const ring = (el: HTMLElement | null | undefined) => {
      el?.animate(
        [
          { opacity: 0, transform: "scale(0.96)" },
          { opacity: 1, transform: "scale(1)", offset: 0.3 },
          { opacity: 0, transform: "scale(1.14)" },
        ],
        { duration: RING, easing: "ease-out" },
      );
    };

    const paint = (i: number, x: number) => {
      const line = lineEls.current[i];
      const glow = glowEls.current[i];
      const core = coreEls.current[i];
      const grad = gradEls.current[i];
      if (!line || !glow || !core || !grad) return;
      const len = eng.lens[i];
      if (!len) return;
      const seg = segLen(len);
      const head = easeInOutSine(x) * (len + seg);
      const off = seg - head;
      const dash = `${seg} ${len + seg}`;
      for (const p of [glow, core]) {
        p.style.strokeDasharray = dash;
        p.style.strokeDashoffset = String(off);
      }
      const p1 = line.getPointAtLength(clamp(head - seg, 0, len));
      const p2 = line.getPointAtLength(clamp(head, 0, len));
      grad.setAttribute("x1", String(p1.x));
      grad.setAttribute("y1", String(p1.y));
      grad.setAttribute("x2", String(p2.x + (p2.x === p1.x && p2.y === p1.y ? 0.01 : 0)));
      grad.setAttribute("y2", String(p2.y));
      const g = pulseEls.current[i];
      if (g) g.style.opacity = "1";
    };

    // one wave per cycle: in-pulses staggered from the cycle start, out-pulses as the first in-pulse lands
    const planCycle = (now: number) => {
      const off = pausedRef.current;
      const ins: number[] = [];
      const outs: number[] = [];
      for (let j = 0; j < inCount; j++) if (!off.has(keyIn(j))) ins.push(j);
      for (let j = 0; j < outCount; j++) if (!off.has(keyOut(j))) outs.push(inCount + j);
      if (!ins.length && !outs.length) {
        eng.nextCycle = now + REST;
        return;
      }
      const tOut = ins.length ? now + TRAVEL : now;
      eng.queue = [
        ...ins.map((beam, k) => ({ beam, at: now + k * STAGGER })),
        ...outs.map((beam, k) => ({ beam, at: tOut + k * STAGGER })),
      ];
      const end = Math.max(...eng.queue.map((q) => q.at)) + TRAVEL;
      eng.syncFrom = ins.length ? tOut : now;
      eng.syncTo = end;
      eng.nextCycle = end + REST;
    };

    const frame = (t: number) => {
      eng.raf = 0;
      if (eng.morphFrom) {
        const x = clamp((t - eng.morphStart) / MORPH, 0, 1);
        const e = easeOutQuint(x);
        for (let i = 0; i < beamCount; i++) {
          const target = eng.targets[i];
          if (!target) continue;
          const from = eng.morphFrom[i] ?? target;
          eng.beams[i] = lerpGeo(from, target, e);
          applyBeam(i);
        }
        if (x >= 1) eng.morphFrom = null;
      }

      const live = eng.visible && !reducedRef.current;
      if (live) {
        if (t >= eng.nextCycle) planCycle(t);
        eng.queue = eng.queue.filter((q) => {
          if (q.at > t) return true;
          const key = q.beam < inCount ? keyIn(q.beam) : keyOut(q.beam - inCount);
          if (!pausedRef.current.has(key) && eng.pulseStart[q.beam] === null) eng.pulseStart[q.beam] = q.at;
          return false;
        });
        for (let i = 0; i < beamCount; i++) {
          const startAt = eng.pulseStart[i];
          if (startAt === null) continue;
          const key = i < inCount ? keyIn(i) : keyOut(i - inCount);
          // paused mid-flight: the pulse fades out where it is
          if (pausedRef.current.has(key)) {
            hide(i);
            continue;
          }
          const x = (t - startAt) / TRAVEL;
          if (x >= 1) {
            hide(i);
            ring(i < inCount ? hubRingRef.current : ringEls.current[keyOut(i - inCount)]);
          } else {
            paint(i, x);
          }
        }
        const sync = t >= eng.syncFrom && t < eng.syncTo;
        if (sync !== eng.syncOn) {
          eng.syncOn = sync;
          setSyncing(sync);
        }
      }

      if (eng.morphFrom || live) eng.raf = requestAnimationFrame(frame);
    };

    const kick = () => {
      if (!eng.raf) eng.raf = requestAnimationFrame(frame);
    };

    measure(true);
    const ro = new ResizeObserver(() => measure(false));
    ro.observe(root);
    // runs only while the scene is on screen; scroll back in and the cycle restarts fresh
    const io = new IntersectionObserver(([entry]) => {
      eng.visible = entry.isIntersecting;
      if (eng.visible) {
        eng.nextCycle = performance.now() + FIRST_WAVE;
        kick();
      } else {
        eng.queue = [];
        for (let i = 0; i < beamCount; i++) hide(i);
        eng.syncTo = 0;
        if (eng.syncOn) {
          eng.syncOn = false;
          setSyncing(false);
        }
      }
    });
    io.observe(root);
    kick();

    return () => {
      cancelAnimationFrame(eng.raf);
      eng.raf = 0;
      ro.disconnect();
      io.disconnect();
      mq.removeEventListener("change", onMotionChange);
      for (const g of pulseList) {
        if (g) g.style.opacity = "";
      }
    };
  }, [beamCount, inCount, outCount]);

  const total = beamCount;
  const connectedCount = total - paused.size;
  const chipText = syncing ? L.syncing : fill(L.count, { n: connectedCount });

  useLayoutEffect(() => {
    const chip = chipRef.current;
    const inner = chipInnerRef.current;
    if (chip && inner) chip.style.width = `${inner.offsetWidth}px`;
  }, [chipText]);

  useEffect(() => () => window.clearTimeout(flashTimer.current), []);

  const toggle = (key: string, name: string) => {
    const next = new Set(paused);
    const isPaused = !next.has(key);
    if (isPaused) next.add(key);
    else next.delete(key);
    setPaused(next);
    const n = total - next.size;
    setSr(fill(isPaused ? L.announcePaused : L.announceConnected, { name, n, m: total }));
    window.clearTimeout(flashTimer.current);
    setFlashKey(key);
    flashTimer.current = window.setTimeout(() => setFlashKey(null), 1400);
  };

  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  const beamFocusKey = focusKey ?? hoverKey;

  const renderTool = (tool: BeamTool, key: string) => {
    const isPaused = paused.has(key);
    const tip = hoverKey === key || focusKey === key || flashKey === key;
    return (
      <button
        key={key}
        type="button"
        className="ib__tool"
        ref={(el) => {
          tileEls.current[key] = el;
        }}
        aria-pressed={!isPaused}
        aria-label={`${tool.name}, ${isPaused ? L.paused : L.connected}`}
        data-off={isPaused || undefined}
        data-tip={tip || undefined}
        onClick={() => toggle(key, tool.name)}
        onMouseEnter={() => setHoverKey(key)}
        onMouseLeave={() => setHoverKey((cur) => (cur === key ? null : cur))}
        onFocus={(e) => {
          if (e.currentTarget.matches(":focus-visible")) setFocusKey(key);
        }}
        onBlur={() => setFocusKey((cur) => (cur === key ? null : cur))}
      >
        <span
          className="ib__ring"
          ref={(el) => {
            ringEls.current[key] = el;
          }}
        />
        <span className="ib__logo" aria-hidden="true">
          {tool.logo}
        </span>
        <span className="ib__tip" aria-hidden="true">
          {tool.name}
          {isPaused && <span className="ib__tip-state"> · {cap(L.paused)}</span>}
        </span>
      </button>
    );
  };

  const beamKeyAt = (i: number) => (i < inCount ? keyIn(i) : keyOut(i - inCount));
  const sceneLabel = label ?? fill(L.sceneLabel, { center: center.name, tools: [...left, ...right].map((t) => t.name).join(", ") });

  const centerMark: ReactNode = center.logo ?? <DefaultMark />;

  return (
    <div className={`ib${className ? ` ${className}` : ""}`} role="group" aria-label={sceneLabel} ref={rootRef} data-focus={beamFocusKey ? "true" : undefined}>
      <svg className="ib__beams" aria-hidden="true" ref={svgRef}>
        <defs>
          <filter id={`ib-${uid}-blur`} filterUnits="userSpaceOnUse" x="-100" y="-100" width="10000" height="10000">
            <feGaussianBlur stdDeviation="3" />
          </filter>
          {Array.from({ length: beamCount }, (_, i) => (
            <linearGradient
              key={i}
              id={`ib-${uid}-g${i}`}
              gradientUnits="userSpaceOnUse"
              ref={(el) => {
                gradEls.current[i] = el;
              }}
            >
              <stop offset="0" className="ib__stop-tail" />
              <stop offset="0.6" className="ib__stop-mid" />
              <stop offset="1" className="ib__stop-head" />
            </linearGradient>
          ))}
        </defs>
        {Array.from({ length: beamCount }, (_, i) => {
          const key = beamKeyAt(i);
          return (
            <path
              key={i}
              className="ib__line"
              ref={(el) => {
                lineEls.current[i] = el;
              }}
              data-off={paused.has(key) || undefined}
              data-focus={beamFocusKey === key || undefined}
            />
          );
        })}
        {Array.from({ length: beamCount }, (_, i) => {
          const key = beamKeyAt(i);
          return (
            <g
              key={i}
              className="ib__pulse"
              ref={(el) => {
                pulseEls.current[i] = el;
              }}
              data-focus={beamFocusKey === key || undefined}
            >
              <path
                className="ib__glow"
                stroke={`url(#ib-${uid}-g${i})`}
                filter={`url(#ib-${uid}-blur)`}
                ref={(el) => {
                  glowEls.current[i] = el;
                }}
              />
              <path
                className="ib__core"
                stroke={`url(#ib-${uid}-g${i})`}
                ref={(el) => {
                  coreEls.current[i] = el;
                }}
              />
            </g>
          );
        })}
      </svg>
      <div className="ib__scene">
        <div className="ib__group ib__group--in">{left.map((tool, j) => renderTool(tool, keyIn(j)))}</div>
        <div className="ib__center" ref={hubRef} data-syncing={syncing || undefined}>
          <span className="ib__ring ib__ring--center" ref={hubRingRef} />
          <span className="ib__mark" aria-hidden="true">
            {centerMark}
          </span>
          <span className="ib__chip" ref={chipRef}>
            <span className="ib__chip-inner" ref={chipInnerRef}>
              <span className="ib__dot" data-idle={connectedCount === 0 || undefined} />
              <span className="ib__status" key={chipText}>
                {chipText}
              </span>
            </span>
          </span>
        </div>
        <div className="ib__group ib__group--out">{right.map((tool, j) => renderTool(tool, keyOut(j)))}</div>
      </div>
      <span className="ib__sr" aria-live="polite">
        {sr}
      </span>
    </div>
  );
}

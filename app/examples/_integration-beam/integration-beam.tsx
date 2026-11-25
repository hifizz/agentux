"use client";

import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  FIRE_WINDOW,
  FIRST_WAVE,
  FLASH,
  MORPH,
  PERIOD,
  PULSE_LEN,
  STAGGER,
  TRAVEL,
  beamD,
  beamGeo,
  clamp,
  easeInOutSine,
  easeOutCubic,
  fill,
  flashOpacity,
  lerpGeo,
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

type Pulse = { active: boolean; start: number };

type Engine = {
  beams: (BeamGeo | null)[];
  targets: (BeamGeo | null)[];
  lens: number[];
  morphFrom: (BeamGeo | null)[] | null;
  morphStart: number;
  pulses: Pulse[];
  waveStart: number;
  flashes: Map<HTMLElement, number>;
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
        pulses: [],
        waveStart: 0,
        flashes: new Map(),
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
    };
    mq.addEventListener("change", onMotionChange);

    eng.pulses = Array.from({ length: beamCount }, () => ({ active: false, start: 0 }));
    eng.flashes = new Map();
    eng.syncOn = false;
    eng.visible = true;
    eng.waveStart = performance.now() + FIRST_WAVE;

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
      }
    };

    const fire = (i: number, at: number) => {
      eng.pulses[i] = { active: true, start: at };
      const g = pulseEls.current[i];
      if (g) g.style.opacity = "1";
    };

    const endPulse = (i: number) => {
      eng.pulses[i] = { active: false, start: 0 };
      const g = pulseEls.current[i];
      if (g) g.style.opacity = "0";
    };

    const renderPulse = (i: number, x: number) => {
      const line = lineEls.current[i];
      const glow = glowEls.current[i];
      const core = coreEls.current[i];
      const grad = gradEls.current[i];
      if (!line || !glow || !core || !grad) return;
      const len = eng.lens[i];
      if (!len) return;
      const off = PULSE_LEN - easeInOutSine(x) * (len + PULSE_LEN);
      const dash = `${PULSE_LEN} ${len + PULSE_LEN}`;
      for (const p of [glow, core]) {
        p.style.strokeDasharray = dash;
        p.style.strokeDashoffset = String(off);
      }
      const tail = clamp(-off, 0, len);
      const head = clamp(-off + PULSE_LEN, 0, len);
      const p1 = line.getPointAtLength(tail);
      const p2 = line.getPointAtLength(head);
      grad.setAttribute("x1", String(p1.x));
      grad.setAttribute("y1", String(p1.y));
      grad.setAttribute("x2", String(p2.x));
      grad.setAttribute("y2", String(p2.y));
    };

    const flashEl = (el: HTMLElement | null | undefined) => {
      if (!el) return;
      eng.flashes.set(el, performance.now());
    };

    const frame = (t: number) => {
      if (eng.morphFrom) {
        const x = clamp((t - eng.morphStart) / MORPH, 0, 1);
        const e = easeOutCubic(x);
        for (let i = 0; i < beamCount; i++) {
          const target = eng.targets[i];
          if (!target) continue;
          const from = eng.morphFrom[i] ?? target;
          eng.beams[i] = lerpGeo(from, target, e);
          applyBeam(i);
        }
        if (x >= 1) eng.morphFrom = null;
      }

      while (eng.waveStart + PERIOD <= t) eng.waveStart += PERIOD;

      const off = pausedRef.current;
      const inLive: number[] = [];
      const outLive: number[] = [];
      for (let j = 0; j < inCount; j++) if (!off.has(keyIn(j))) inLive.push(j);
      for (let j = 0; j < outCount; j++) if (!off.has(keyOut(j))) outLive.push(inCount + j);

      const live = eng.visible && !reducedRef.current;
      if (live) {
        inLive.forEach((bi, order) => {
          const fireAt = eng.waveStart + order * STAGGER;
          if (!eng.pulses[bi].active && t >= fireAt && t - fireAt < FIRE_WINDOW) fire(bi, fireAt);
        });
        if (inLive.length) {
          outLive.forEach((bi, order) => {
            const fireAt = eng.waveStart + TRAVEL + order * STAGGER;
            if (!eng.pulses[bi].active && t >= fireAt && t - fireAt < FIRE_WINDOW) fire(bi, fireAt);
          });
        }
      }

      for (let i = 0; i < beamCount; i++) {
        const p = eng.pulses[i];
        if (!p.active) continue;
        const key = i < inCount ? keyIn(i) : keyOut(i - inCount);
        if (off.has(key)) {
          endPulse(i);
          continue;
        }
        const x = (t - p.start) / TRAVEL;
        if (x >= 1) {
          endPulse(i);
          flashEl(i < inCount ? hubRingRef.current : ringEls.current[keyOut(i - inCount)]);
        } else {
          renderPulse(i, x);
        }
      }

      eng.flashes.forEach((start, el) => {
        const e = t - start;
        if (e >= FLASH) {
          el.style.opacity = "";
          eng.flashes.delete(el);
        } else {
          el.style.opacity = flashOpacity(e).toFixed(3);
        }
      });

      const sync =
        live &&
        inLive.length > 0 &&
        outLive.some((bi, order) => {
          const fireAt = eng.waveStart + TRAVEL + order * STAGGER;
          return t >= fireAt && t < fireAt + TRAVEL;
        });
      if (sync !== eng.syncOn) {
        eng.syncOn = sync;
        setSyncing(sync);
      }

      eng.raf = requestAnimationFrame(frame);
    };

    measure(true);
    const ro = new ResizeObserver(() => measure(false));
    ro.observe(root);
    const io = new IntersectionObserver(([entry]) => {
      eng.visible = entry.isIntersecting;
    });
    io.observe(root);
    eng.raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(eng.raf);
      ro.disconnect();
      io.disconnect();
      mq.removeEventListener("change", onMotionChange);
      for (const g of pulseList) {
        if (g) g.style.opacity = "";
      }
      eng.flashes.forEach((_, el) => {
        el.style.opacity = "";
      });
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

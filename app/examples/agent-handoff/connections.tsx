import { useEffect, useRef, useState, type CSSProperties } from "react";

function elbow(from: number, to: number, returning: boolean) {
  const sign = returning ? -1 : 1, y = returning ? 224 : 152;
  return `M${from},${y} v${26 * sign} q0,${10 * sign} 10,${10 * sign} H${to - 10} q10,0 10,${10 * sign} v${26 * sign}`;
}

export function Connections({ lights }: { lights: number[] }) {
  const ref = useRef<SVGSVGElement>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return <svg className="ah-wires" ref={ref} aria-hidden="true">
    {width > 620 && lights.map((pulse, lane) => {
      const start = width * (lane * 2 + 1) / 6, center = width * (lane + 1) / 3, end = start + width / 3;
      const curves = [elbow(start, center - 14, false), elbow(center + 14, end, true)];
      return <g key={lane}>
        {curves.map((d, i) => <g key={d}><path className="ah-wire" d={d} />
          <g className="ah-pulse" key={pulse} style={{ animationDelay: i ? "850ms" : "0ms" }}>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(n => <path key={n} d={d} pathLength="100" strokeDasharray="2 160" style={{ "--offset": -n * 1.6, "--alpha": (n + 1) / 10 } as CSSProperties} />)}
          </g></g>)}
        {[[start,152],[center-14,224],[center+14,224],[end,152]].map(([cx,cy]) => <circle key={cx} cx={cx} cy={cy} r="3.25" />)}
      </g>;
    })}
  </svg>;
}

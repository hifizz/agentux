import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import type { Agent, Pass } from "./model";

type Edge = { parent: string; child: string; path: string; x: number; y: number; length: number; overhead: boolean };
export type Hop = { edge: Edge; reverse: boolean; delay: number; duration: number };

export function useRoutes(spec: readonly Agent[]) {
  const ref = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState<Edge[]>([]);
  useLayoutEffect(() => {
    const tree = ref.current;
    if (!tree) return;
    const [lead] = spec;
    const columns = spec.filter(a => a.parent === lead.id).length;
    const slots = Array.from(tree.querySelectorAll<HTMLElement>("[data-slot]"));
    function measure() {
      if (!tree) return;
      const origin = tree.getBoundingClientRect();
      const wide = origin.width >= columns * 236 + (columns - 1) * 8;
      tree.dataset.wide = String(wide);
      const boxes = new Map(slots.map(n => [n.dataset.slot, n.getBoundingClientRect()]));
      setEdges(spec.flatMap(a => {
        if (!a.parent) return [];
        const parent = boxes.get(a.parent), child = boxes.get(a.id);
        if (!parent || !child) return [];
        const overhead = wide && a.parent === lead.id;
        const x = parent.left - origin.left + (overhead ? parent.width / 2 : 21), y = parent.bottom - origin.top;
        const endX = child.left - origin.left + (overhead ? child.width / 2 : 0), endY = child.top - origin.top + (overhead ? 0 : 21);
        const dx = endX - x, dy = endY - y, bend = Math.min(overhead ? 8 : 5.5, Math.abs(dx) / 2, Math.abs(dy) / 2);
        const turn = Math.sign(dx) * bend, mid = (y + endY) / 2;
        const path = !dx ? `M${x} ${y}V${endY}` : overhead ? `M${x} ${y}V${mid-bend}q0 ${bend} ${turn} ${bend}H${endX-turn}q${turn} 0 ${turn} ${bend}V${endY}` : `M${x} ${y}V${endY-bend}q0 ${bend} ${turn} ${bend}H${endX}`;
        return [{ parent: a.parent, child: a.id, overhead, path, x, y, length: Math.abs(dx) + Math.abs(dy) - bend * (overhead ? .754 : .377) }];
      }));
    }
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(tree);
    slots.forEach(n => observer.observe(n));
    return () => observer.disconnect();
  }, [spec]);
  return { ref, edges };
}

export function itinerary(edges: Edge[], pass?: Pass): Hop[] {
  if (!pass) return [];
  function ancestors(id: string) {
    const path = [id];
    let edge = edges.find(e => e.child === id);
    while (edge) {
      id = edge.parent;
      path.push(id);
      edge = edges.find(e => e.child === id);
    }
    return path;
  }
  const from = ancestors(pass.from), to = ancestors(pass.to), common = from.find(id => to.includes(id));
  if (!common) return [];
  const route = [...from.slice(0, from.indexOf(common) + 1), ...to.slice(0, to.indexOf(common)).reverse()];
  let delay = 0;
  return route.slice(1).map((id, i) => {
    const prev = route[i];
    const edge = edges.find(e => e.parent === id && e.child === prev || e.child === id && e.parent === prev)!;
    const duration = Math.min(728, Math.max(380, edge.length * 3.25));
    const hop = { edge, reverse: edge.parent === id, duration, delay };
    delay += duration;
    return hop;
  });
}

export function Wires({ edges, hops, pass, tones, agents }: { edges: Edge[]; hops: Hop[]; pass?: Pass; tones: Map<string, string>; agents: Agent[] }) {
  const pins = new Map(edges.map(e => [e.parent, e]));
  return <svg className="cc-wires" aria-hidden="true">
    {edges.map(e => <path className="cc-link" key={e.child} d={e.path} pathLength="1" data-rest={agents.find(a => a.id === e.child)?.status !== "active"} style={{ color: tones.get(e.parent) }} />)}
    {hops.map(({ edge, reverse, delay, duration }) => <g key={`${pass?.at}-${edge.child}`} className="cc-travel" style={{ color: tones.get(edge.parent) }}>
      {Array.from({ length: 8 }, (_, i) => {
        const dash = 44 - i * 5.5, start = 44 - i * 2.75, end = -edge.length - i * 2.75;
        return <path key={i} d={edge.path} strokeDasharray={`${dash} ${edge.length + 88}`} style={{ "--cc-from": reverse ? end : start, "--cc-to": reverse ? start : end, animationDelay: `${delay}ms`, animationDuration: `${duration}ms` } as CSSProperties} />;
      })}
    </g>)}
    {[...pins.values()].map(e => <circle key={e.parent} cx={e.x} cy={e.y} r="3" style={{ color: tones.get(e.parent) }} />)}
  </svg>;
}

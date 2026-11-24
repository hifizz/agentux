import { useEffect, useState, type CSSProperties, type RefObject } from "react";
import type { Step } from "./run";

type Point = { x: number; y: number };
type Link = { id: string; from: Point; to: Point; d: string; length: number };

function connect(id: string, from: Point, to: Point, horizontal = false): Link {
  const dx = to.x - from.x, dy = to.y - from.y;
  const bend = horizontal ? 0 : Math.min(10, Math.abs(dx) / 2, Math.abs(dy) / 2);
  const mid = from.y + dy / 2, turn = Math.sign(dx) * bend;
  const start = `M${from.x} ${from.y}`;
  const d = horizontal || !bend ? `${start}L${to.x} ${to.y}` : `${start}V${mid - bend}q0 ${bend} ${turn} ${bend}H${to.x - turn}q${turn} 0 ${turn} ${bend}V${to.y}`;
  return { id, from, to, d, length: Math.abs(dx) + Math.abs(dy) - .754 * bend };
}

export function Connections({ board, active }: { board: RefObject<HTMLDivElement | null>; active?: Step["target"] }) {
  const [links, setLinks] = useState<Link[]>([]);
  useEffect(() => {
    const root = board.current;
    if (!root) return;
    const elements = Array.from(root.querySelectorAll<HTMLElement>("[data-port]"));
    const observer = new ResizeObserver(() => {
      const bounds = root.getBoundingClientRect();
      if (bounds.width <= 720) { setLinks([]); return; }
      const boxes = elements.map(el => {
        const b = el.getBoundingClientRect();
        const left = b.left - bounds.left, top = b.top - bounds.top;
        return { id: el.dataset.port, left, top, right: left + b.width, bottom: top + b.height, cx: left + b.width / 2, cy: top + b.height / 2, width: b.width };
      });
      const agent = boxes.find(b => b.id === "agent");
      if (!agent) return;
      setLinks(boxes.flatMap(b => {
        if (!b.id || b.id === "agent") return [];
        if (b.id === "request") return [connect(b.id, { x: b.right, y: b.cy }, { x: agent.left, y: agent.cy }, true)];
        if (b.id === "files") return [connect(b.id, { x: agent.right, y: agent.cy }, { x: b.left, y: b.cy }, true)];
        const x = Math.max(agent.left + agent.width / 4, Math.min(agent.right - agent.width / 4, b.cx));
        return [connect(b.id, { x, y: agent.bottom }, { x: b.cx, y: b.top })];
      }));
    });
    [root, ...elements].forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [board]);
  const lit = links.find(link => link.id === active);
  return <svg className="wb-links" aria-hidden="true">
    {links.map(link => <path key={link.id} className="wb-line" d={link.d} data-lit={link === lit} />)}
    {lit && <g key={lit.id} className="wb-pulse">{Array.from({ length: 8 }, (_, i) => {
      const tail = Math.min(72, lit.length * .7), dash = tail * (i + 1) / 8;
      return <path key={i} d={lit.d} strokeDasharray={`${dash} ${lit.length + 2 * tail}`} style={{ "--wb-start": dash, "--wb-end": dash - lit.length - tail, animationDuration: `${Math.max(700, lit.length * 4)}ms` } as CSSProperties} />;
    })}</g>}
    {links.map(link => <g key={link.id} data-lit={link === lit}><circle cx={link.from.x} cy={link.from.y} r="3.25" /><circle cx={link.to.x} cy={link.to.y} r="3.25" /></g>)}
  </svg>;
}

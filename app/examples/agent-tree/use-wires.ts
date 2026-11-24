import { useLayoutEffect, useRef } from "react";

type Box = { x: number; y: number; w: number; h: number };
const easing = "cubic-bezier(.32,.72,.24,1)";
const svgNS = "http://www.w3.org/2000/svg";

function elbow(x: number, y: number, endX: number, endY: number, overhead: boolean) {
  const sign = Math.sign(endX - x);
  const bend = Math.min(overhead ? 8 : 5.5, Math.abs(endX - x) / 2, Math.abs(endY - y) / 2);
  if (!overhead) return `M${x} ${y}V${endY - bend}q0 ${bend} ${sign * bend} ${bend}H${endX}`;
  const mid = (endY + y) / 2;
  return `M${x} ${y}V${mid - bend}q0 ${bend} ${sign * bend} ${bend}H${endX - sign * bend}q${sign * bend} 0 ${sign * bend} ${bend}V${endY}`;
}

export function useWires() {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const tree = ref.current;
    if (!tree) return;
    const wires = tree.querySelector(".at-wires")!;
    const pins = tree.querySelector(".at-pins")!;
    const paths = new Map<string, SVGPathElement>();
    const dots = new Map<string, SVGCircleElement>();
    const previous = new Map<string, Box>();
    const layouts = new Map<string, Box>();
    const animations = new Map<string, Animation>();
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let until = 0;
    const slots = () => Array.from(tree.querySelectorAll<HTMLElement>(".at-slot"));
    const box = (node: HTMLElement, origin: DOMRect): Box => {
      const r = node.getBoundingClientRect();
      return { x: r.left - origin.left, y: r.top - origin.top, w: r.width, h: r.height };
    };
    function draw() {
      if (!tree) return;
      const origin = tree.getBoundingClientRect();
      const nodes = slots();
      const ids = new Set<string>();
      const parents = new Set<string>();
      const cards = new Map<string, Box>();
      for (const slot of nodes) {
        previous.set(slot.dataset.id!, box(slot, origin));
        cards.set(slot.dataset.id!, box(slot.querySelector<HTMLElement>(".at-card")!, origin));
      }
      for (const slot of nodes) {
        const { id, parent, depth } = slot.dataset;
        if (!id || !parent) continue;
        const child = cards.get(id), source = cards.get(parent);
        if (!source || !child) continue;
        ids.add(id);
        parents.add(parent);
        const overhead = depth === "1" && tree.dataset.wide === "true";
        const x = source.x + (overhead ? source.w / 2 : 21);
        const y = source.y + source.h;
        let path = paths.get(id);
        if (!path) {
          path = document.createElementNS(svgNS, "path");
          path.setAttribute("pathLength", "1");
          wires.append(path);
          paths.set(id, path);
        }
        path.setAttribute("d", elbow(x, y, child.x + (overhead ? child.w / 2 : 0), child.y + (overhead ? 0 : 20), overhead));
        path.toggleAttribute("data-muted", slot.firstElementChild?.getAttribute("data-status") === "stopped");
        path.toggleAttribute("data-leave", !!slot.closest("[data-exiting]"));
        path.style.animationDelay = slot.style.getPropertyValue(slot.closest("[data-exiting]") ? "--at-exit-delay" : "--at-stagger");
        let dot = dots.get(parent);
        if (!dot) {
          dot = document.createElementNS(svgNS, "circle");
          dot.setAttribute("r", "3.25");
          pins.append(dot);
          dots.set(parent, dot);
        }
        dot.setAttribute("cx", String(x));
        dot.setAttribute("cy", String(y));
      }
      for (const [id, path] of paths) if (!ids.has(id)) { path.remove(); paths.delete(id); }
      for (const [id, dot] of dots) if (!parents.has(id)) { dot.remove(); dots.delete(id); }
      if (performance.now() < until) frame = requestAnimationFrame(draw);
    }
    function update() {
      if (!tree) return;
      const nodes = slots();
      const origin = tree.getBoundingClientRect();
      const leaving = nodes.filter(n => n.closest("[data-exiting]"));
      leaving.reverse().forEach((n, i) => n.style.setProperty("--at-exit-delay", `${Math.min(i, 7) * 45}ms`));
      nodes.filter(n => n.dataset.parent && !layouts.has(n.dataset.id!)).forEach((n, i) => n.style.setProperty("--at-stagger", `${i * 60}ms`));
      const mounted = new Set(nodes.map(n => n.dataset.id));
      for (const id of layouts.keys()) if (!mounted.has(id)) {
        layouts.delete(id); previous.delete(id); animations.delete(id);
      }
      for (const node of nodes) {
        const id = node.dataset.id!;
        const r = box(node, origin);
        const shift = getComputedStyle(node).translate.split(" ");
        const x = r.x - (parseFloat(shift[0]) || 0), y = r.y - (parseFloat(shift[1]) || 0);
        const last = layouts.get(id), from = previous.get(id);
        if (last && Math.abs(last.x - x) < .1 && Math.abs(last.y - y) < .1) continue;
        layouts.set(id, { ...r, x, y });
        animations.get(id)?.cancel();
        if (from && !reduce.matches) animations.set(id, node.animate([{ translate: `${from.x - x}px ${from.y - y}px` }, { translate: "0px 0px" }], { duration: 420, easing }));
      }
      cancelAnimationFrame(frame);
      until = performance.now() + (reduce.matches ? 0 : 540 + 60 * nodes.length);
      draw();
    }
    const mutations = new MutationObserver(records => {
      if (records.some(r => r.type === "attributes" || [...r.addedNodes, ...r.removedNodes].some(n => n instanceof HTMLElement && (n.matches(".at-item,.at-group") || n.querySelector(".at-slot"))))) update();
    });
    mutations.observe(tree, { childList: true, subtree: true, attributes: true, attributeFilter: ["data-wide", "data-exiting", "data-status"] });
    const resize = new ResizeObserver(update);
    resize.observe(tree);
    const preferenceChanged = () => { animations.forEach(a => a.cancel()); update(); };
    reduce.addEventListener("change", preferenceChanged);
    update();
    return () => { reduce.removeEventListener("change", preferenceChanged); resize.disconnect(); mutations.disconnect(); cancelAnimationFrame(frame); animations.forEach(a => a.cancel()); wires.replaceChildren(); pins.replaceChildren(); };
  }, []);
  return ref;
}

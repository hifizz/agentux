"use client";

import { Play, Square, Undo2 } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import { editPath, flatten, initial, insert, templates, type Path, type Slot, type Step, type Template } from "./workflow";
import { Steps, Tile } from "./steps";
import { useTestRun } from "./use-test-run";
import "./flow.css";

type Picker = { label: string; slot: Slot; left: number; top?: number; bottom?: number; maxHeight: number; anchor: HTMLButtonElement };

export default function Demo() {
  const [flow, setFlow] = useState(initial), [selected, setSelected] = useState<string | null>(null);
  const [picker, setPicker] = useState<Picker | null>(null), [removed, setRemoved] = useState("");
  const history = useRef<Path[]>([]), shell = useRef<HTMLElement>(null), canvas = useRef<HTMLDivElement>(null);
  const nextId = useRef(1);
  const grip = useRef<{ x: number; y: number; left: number; top: number } | null>(null);
  const { report, start, stop } = useTestRun(), order = flatten(flow);
  const active = order.find(step => step.id === report.active);

  function focusStep(id?: string) {
    if (id) requestAnimationFrame(() => shell.current?.querySelector<HTMLButtonElement>(`[data-step="${id}"] .fb-card`)?.focus());
  }
  function change(next: Path) {
    history.current.push(flow); setFlow(next); stop(); setPicker(null); setRemoved("");
  }
  function undo() {
    const last = history.current.pop();
    if (last) { setFlow(last); setSelected(null); setRemoved(""); setPicker(null); stop(); }
  }
  function remove(slot: Slot) {
    let target: Step | undefined;
    const next = editPath(flow, slot.path, list => {
      target = list[slot.index];
      return [...list.slice(0, slot.index), ...(target.paths?.[0]?.steps ?? []), ...list.slice(slot.index + 1)];
    });
    if (!target || target.kind === "trigger") return;
    change(next); setSelected(null); setRemoved(target.title); focusStep(order[order.indexOf(target) - 1]?.id);
  }
  function insertStep(template: Template) {
    if (!picker) return;
    const id = `added-${nextId.current++}`;
    change(insert(flow, picker.slot, template, id)); setSelected(id); focusStep(id);
  }
  function openMenu(e: MouseEvent<HTMLButtonElement>, slot: Slot, label: string) {
    const anchor = e.currentTarget, box = shell.current?.getBoundingClientRect();
    if (!box || picker?.anchor === anchor) { setPicker(null); return; }
    const rect = anchor.getBoundingClientRect(), below = rect.bottom - box.top + 6, above = box.bottom - rect.top + 6;
    const down = box.height - below >= 188 || below < above;
    const w = Math.min(248, box.width - 16);
    setPicker({ anchor, slot, label, left: Math.min(box.width - w - 8, Math.max(8, rect.left + rect.width / 2 - box.left - w / 2)), ...(down ? { top: below } : { bottom: above }), maxHeight: box.height - (down ? below : above) - 8 });
  }
  useEffect(() => {
    if (!picker) return;
    shell.current?.querySelector<HTMLButtonElement>('[role="menuitem"]')?.focus({ preventScroll: true });
    function dismiss(e: PointerEvent) { if (e.target instanceof Element && !e.target.closest('.fb-picker,.fb-plus')) setPicker(null); }
    const close = () => setPicker(null);
    document.addEventListener("pointerdown", dismiss); window.addEventListener("resize", close);
    return () => { document.removeEventListener("pointerdown", dismiss); window.removeEventListener("resize", close); };
  }, [picker]);
  useLayoutEffect(() => { const el = canvas.current; if (el) el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2; }, []);
  useEffect(() => {
    const el = canvas.current, node = el?.querySelector(`[data-step="${report.active}"]`);
    if (!el || !node) return;
    const rect = node.getBoundingClientRect(), box = el.getBoundingClientRect();
    const dx = rect.left < box.left ? rect.left - box.left - 16 : rect.right > box.right ? rect.right - box.right + 16 : 0;
    const dy = rect.top < box.top ? rect.top - box.top - 56 : rect.bottom > box.bottom ? rect.bottom - box.bottom + 56 : 0;
    el.scrollBy({ left: dx, top: dy, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }, [report.active]);

  function stepKeys(e: KeyboardEvent<HTMLButtonElement>, slot: Slot, step: Step) {
    const dir = e.key === "ArrowDown" ? 1 : e.key === "ArrowUp" ? -1 : 0;
    if ((e.key === "Backspace" || e.key === "Delete") && !active) { e.preventDefault(); remove(slot); return; }
    if (dir && e.altKey) {
      e.preventDefault(); if (active || step.kind === "trigger" || step.paths) return;
      let moved = false;
      const next = editPath(flow, slot.path, list => {
        const neighbor = list[slot.index + dir];
        if (!neighbor || neighbor.kind === "trigger" || neighbor.paths) return list;
        const result = list.slice(); result[slot.index] = neighbor; result[slot.index + dir] = step; moved = true; return result;
      });
      if (moved) { change(next); setSelected(step.id); focusStep(step.id); } return;
    }
    if (dir || e.key === "Home" || e.key === "End") {
      e.preventDefault(); focusStep(order[e.key === "Home" ? 0 : e.key === "End" ? order.length - 1 : Math.min(order.length - 1, Math.max(0, order.indexOf(step) + dir))].id);
    }
  }
  return <div className="fb-view"><section ref={shell} className="fb-shell" aria-label="Onboard new workspaces" data-selected={selected || undefined} data-running={active ? true : undefined}
    onKeyDown={e => {
      if (e.key === "Escape") { if (picker) { picker.anchor.focus(); setPicker(null); } else setSelected(null); }
      if (e.key.toLowerCase() === "z" && (e.metaKey || e.ctrlKey) && !active) { e.preventDefault(); undo(); }
    }}>
    <header className="fb-head"><h3>Onboard new workspaces</h3><span>{order.length} steps</span><button type="button" className="fb-test" onClick={() => { setPicker(null); setRemoved(""); if (active) stop(); else { setSelected(null); start(flow); } }} disabled={order.length < 2}>{active ? <Square /> : <Play />}{active ? "Stop" : "Run test"}</button></header>
    <div className="fb-canvas" role="group" aria-label="Workflow steps" ref={canvas} onScroll={() => { if (picker) setPicker(null); }}
      onPointerDown={e => {
        if (e.button !== 0 || e.pointerType === "touch" || !(e.target instanceof Element) || e.target.closest("button")) return;
        const el = e.currentTarget; grip.current = { x: e.clientX, y: e.clientY, left: el.scrollLeft, top: el.scrollTop }; el.setPointerCapture(e.pointerId); el.dataset.gripped = "";
      }} onPointerMove={e => {
        if (grip.current) e.currentTarget.scrollTo(grip.current.left + grip.current.x - e.clientX, grip.current.top + grip.current.y - e.clientY);
      }} onLostPointerCapture={e => { grip.current = null; delete e.currentTarget.dataset.gripped; }}>
      <div className="fb-tree"><Steps path={flow} ui={{ selected, active: report.active, results: report.results, order, openLabel: picker?.label, select: id => { setPicker(null); setSelected(selected === id ? null : id); }, remove, keys: stepKeys, menu: openMenu }} /></div>
    </div>
    <footer className="fb-foot" role="status">{active ? <><b data-state="running">Running</b>{active.title}</> : report.passed ? <><b data-state="done">Passed</b>{report.passed} steps ran</> : removed ? <><b>Removed</b>{removed}<button type="button" className="fb-undo" onClick={undo}><Undo2 size={12} />Undo</button></> : selected ? <span className="fb-hint"><kbd>⌥</kbd><kbd>↑↓</kbd> moves · <kbd>⌫</kbd> removes · <kbd>Esc</kbd> deselects</span> : "Add steps with the + on each line"}</footer>
    {picker && <div role="menu" className="fb-picker" aria-label={picker.label} style={{ left: picker.left, top: picker.top, bottom: picker.bottom, maxHeight: picker.maxHeight }} onKeyDown={e => {
      const items = Array.from(e.currentTarget.querySelectorAll("button")), at = items.findIndex(item => item === document.activeElement);
      const index = e.key === "Home" ? 0 : e.key === "End" ? items.length - 1 : e.key === "ArrowDown" ? (at + 1) % items.length : e.key === "ArrowUp" ? (at + items.length - 1) % items.length : -1;
      if (index >= 0) { e.preventDefault(); items[index].focus(); } if (e.key === "Tab") setPicker(null);
    }}>{templates.map(template => <button key={template.icon} type="button" role="menuitem" onClick={() => insertStep(template)}><span className="fb-tile"><Tile icon={template.icon} alternate /></span><span>{template.title}<small>{template.detail}</small></span></button>)}</div>}
  </section></div>;
}

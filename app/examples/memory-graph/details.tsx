import { useLayoutEffect, useRef, useState } from "react";
import { Folder, Plus, Trash2, X } from "lucide-react";
import { Mark } from "./marks";
import { catalog, type Entry, type Memory, type Tool } from "./session";

export type Panel = { kind: "entry"; item: Entry } | { kind: "list"; side: "memory" | "tool" } | { kind: "quick" | "add" };
export type Selection = { panel: Panel; anchor: HTMLButtonElement };
const fileNames = { chat: "Chat", pdf: "PDF", sheet: "Excel", word: "Word", markdown: "Markdown", figma: "Figma", file: "File" };

type Props = {
  selection: Selection; memories: Memory[]; tools: Tool[]; disabled: string[]; active: string[];
  close: () => void; select: (panel: Panel) => void; toggle: (id: string) => void; forget: (id: string) => void;
  connect: (tool: Tool) => void; addFiles: (files: FileList) => void;
};

export function Details({ selection: { panel, anchor }, memories, tools, disabled, active, close, select, toggle, forget, connect, addFiles }: Props) {
  const ref = useRef<HTMLDivElement>(null), input = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  const quickBox = useRef<DOMRect | null>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.showPopover();
    function position() {
      if (!el) return;
      const a = anchor.getBoundingClientRect(), w = el.offsetWidth, h = el.offsetHeight;
      const above = a.bottom + h + 6 > window.innerHeight - 8 && a.top >= h + 6;
      el.style.left = `${Math.max(8, Math.min(window.innerWidth - w - 8, a.left + (a.width - w) / 2))}px`;
      el.style.top = `${Math.max(8, Math.min(window.innerHeight - h - 8, above ? a.top - h - 6 : a.bottom + 6))}px`;
      el.dataset.above = String(above);
    }
    position();
    if (panel.kind === "add" && quickBox.current && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const from = quickBox.current, to = el.getBoundingClientRect();
      el.animate([{ transformOrigin: "0 0", transform: `translate(${from.x-to.x}px,${from.y-to.y}px) scale(${from.width/to.width},${from.height/to.height})` }, { transformOrigin: "0 0", transform: "none" }], { duration: 320, easing: "cubic-bezier(.32,.72,.24,1)" });
    }
    el.focus({ preventScroll: true });
    const resize = new ResizeObserver(position); resize.observe(el); resize.observe(anchor);
    window.addEventListener("scroll", position, true); window.addEventListener("resize", position);
    function outside(e: PointerEvent) { if (e.target instanceof Node && !el?.contains(e.target) && !anchor.contains(e.target)) close(); }
    function key(e: KeyboardEvent) { if (e.key === "Escape") { e.preventDefault(); close(); } }
    document.addEventListener("pointerdown", outside); document.addEventListener("keydown", key);
    return () => { resize.disconnect(); window.removeEventListener("scroll", position, true); window.removeEventListener("resize", position); document.removeEventListener("pointerdown", outside); document.removeEventListener("keydown", key); el.hidePopover(); };
  }, [anchor, panel, close]);

  const item = panel.kind === "entry" ? panel.item : null;
  const old = item?.kind === "memory" ? memories.find(m => m.replaces === item.id) : undefined;
  const list = panel.kind === "list" ? (panel.side === "memory" ? memories : tools).slice(5) : catalog.filter(t => !tools.some(other => other.id === t.id));
  const title = item?.name ?? (panel.kind === "list" ? `More ${panel.side === "tool" ? "tools" : "memories"}` : "Add to Assistant");
  const closeButton = <button type="button" className="mg-x" aria-label="Close" onClick={close}><X size={13} /></button>;
  const link = (memory: Memory) => <button key={memory.id} type="button" className="mg-chip" onClick={() => select({ kind: "entry", item: memory })}>{memory.name}</button>;
  return <div ref={ref} popover="manual" tabIndex={-1} role="dialog" aria-label={title} className="mg-panel" data-kind={panel.kind}>
    {panel.kind === "quick" ? <button type="button" className="mg-add" onClick={() => { quickBox.current = ref.current?.getBoundingClientRect() ?? null; select({ kind: "add" }); }}><Plus size={13} /> Add</button> : item ? <>
      <div className="mg-panel-head">{item.kind === "tool" ? <><span className="mg-tile"><Mark item={item} /></span><b>{item.name}</b></> : <span className="mg-chip">{item.tag}</span>}
        {old && <span className="mg-chip">Outdated</span>}{disabled.includes(item.id) ? <span className="mg-chip">Off</span> : active.includes(item.id) && <span className="mg-chip mg-live">{item.kind === "tool" ? "In use" : "Recalled"}</span>}{closeButton}</div>
      {item.kind === "memory" ? <><b data-old={old ? "" : undefined}>{item.name}</b><div className="mg-file-info"><Mark item={item} /><span>{item.file}<small>{fileNames[item.mark]}{item.via && ` · via ${tools.find(t => t.id === item.via)?.name}`}</small></span></div><p>{item.source}</p>
        {old && <p>Replaced by {link(old)}</p>}{item.replaces && memories.some(m => m.id === item.replaces) && <p>Replaces {memories.filter(m => m.id === item.replaces).map(link)}</p>}
        {memories.some(m => item.related?.includes(m.id)) && <div className="mg-related">Linked to {memories.filter(m => item.related?.includes(m.id)).map(link)}</div>}</> : <div className="mg-related"><span className="mg-chip">{item.access}</span><span className="mg-chip">{item.scope}</span></div>}
      <button type="button" role="switch" aria-checked={!disabled.includes(item.id)} className="mg-toggle" onClick={() => toggle(item.id)}>{item.kind === "tool" ? "Allow access" : "Use this memory"}<span aria-hidden="true" /></button>
      <footer className="mg-panel-foot">{item.kind === "tool" ? <>{item.last && <span>Used {item.last}</span>}<span>{item.calls} calls</span></> : <><span>Learned {item.learned}</span><span>Used {item.uses}×</span><button type="button" onClick={() => forget(item.id)}><Trash2 size={12} />Forget</button></>}</footer>
    </> : <><div className="mg-panel-head"><b>{title}</b>{closeButton}</div>
      {panel.kind === "add" && <><div className="mg-drop" data-over={over || undefined} onDragOver={e => { e.preventDefault(); setOver(true); }} onDragLeave={() => setOver(false)} onDrop={e => { e.preventDefault(); setOver(false); addFiles(e.dataTransfer.files); }}><Folder size={17} /><span>Drop a file <small>or</small> <button type="button" onClick={() => input.current?.click()}>browse</button></span><input type="file" multiple hidden ref={input} onChange={e => e.target.files && addFiles(e.target.files)} /></div>{list.length > 0 && <span>Connect a tool</span>}</>}
      <ul className="mg-options">{list.map(entry => <li key={entry.id}><button type="button" onClick={() => panel.kind === "add" && entry.kind === "tool" ? connect(entry) : select({ kind: "entry", item: entry })}><span className="mg-tile"><Mark item={entry} /></span><span><b>{entry.name}</b><small>{entry.kind === "tool" ? `${entry.access} · ${entry.scope}` : entry.file}</small></span>{panel.kind === "add" && <Plus size={14} />}</button></li>)}</ul></>}
  </div>;
}

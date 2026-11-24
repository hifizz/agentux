import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { ToolMark } from "./marks";
import { clock, seconds, type Entry, type Status } from "./runs";

type Selection = { index: number; top: number; opener: HTMLElement };

export function History({ steps, status }: { steps: Entry[]; status: Status }) {
  const strip = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLOListElement>(null);
  const dialog = useRef<HTMLDivElement>(null);
  const [over, setOver] = useState<number | null>(null);
  const [selected, select] = useState<Selection | null>(null);
  const picked = steps.find(s => s.index === selected?.index);
  const hot = picked?.index ?? over;
  const done = steps.filter(s => s.state !== "running").reverse();
  const total = steps.reduce((sum,s) => sum + s.took, 0);
  const close = useCallback(() => { select(null); selected?.opener.focus({ preventScroll: true }); }, [selected]);
  useEffect(() => {
    if (!selected) return;
    dialog.current?.querySelector("button")?.focus({ preventScroll: true });
    const outside = (event: PointerEvent) => {
      if (!(event.target instanceof Node) || dialog.current?.contains(event.target) || selected.opener.contains(event.target)) return;
      select(null);
    };
    document.addEventListener("pointerdown",outside);
    return () => document.removeEventListener("pointerdown",outside);
  },[selected]);
  function open(index: number, opener: HTMLElement) {
    if (selected?.index === index) return close();
    const card = strip.current?.closest("section");
    if (card) select({ index, opener, top: opener.getBoundingClientRect().bottom - card.getBoundingClientRect().top + 6 });
  }
  function reveal(index: number) {
    setOver(index);
    const row = list.current?.querySelector<HTMLElement>(`[data-index="${index}"]`);
    if (!row || !list.current) return;
    const delta = row.getBoundingClientRect().top - list.current.getBoundingClientRect().top;
    if (delta < 0) list.current.scrollTop += delta;
    else if (delta + 26 > list.current.clientHeight) list.current.scrollTop += delta + 26 - list.current.clientHeight;
  }
  function fades() {
    const el = list.current;
    if (!el) return;
    el.toggleAttribute("data-top", el.scrollTop > 1);
    el.toggleAttribute("data-bottom", el.scrollTop + el.clientHeight < el.scrollHeight - 1);
  }
  useLayoutEffect(() => {
    if (list.current) list.current.scrollTop = 0;
    fades();
    const observer = new ResizeObserver(fades);
    if (list.current) observer.observe(list.current);
    return () => observer.disconnect();
  },[done.length]);

  return <>
    <div className="am-track" ref={strip} role="group" aria-label="Step times" data-pointing={hot != null || undefined} onPointerLeave={() => setOver(null)}>
      {steps.map(s => <button type="button" className="am-segment" key={s.index} style={{ flexGrow: s.took || 1 }}
        title={`${s.label} · ${seconds(s.took)}`} aria-label={`${s.label}, ${seconds(s.took)}: details`} aria-expanded={picked?.index === s.index}
        data-state={s.state} data-hot={s.index === hot || undefined} onPointerEnter={() => reveal(s.index)} onClick={e => open(s.index, e.currentTarget)} />)}
      {status === "waiting" && <span className="am-wait-mark" />}
    </div>
    {done.length > 0 && <ol ref={list} className="am-list" aria-label="Finished steps" tabIndex={done.length > 3 ? 0 : undefined} onScroll={fades}
      style={{ height: Math.min(3, done.length)*26 }} data-pointing={hot != null || undefined} onPointerLeave={() => setOver(null)}>
      {done.map(s => <li key={s.index} data-index={s.index} data-hot={hot === s.index || undefined} onPointerEnter={() => setOver(s.index)}>
        <button type="button" className="am-row" aria-label={`${s.label}: details`} aria-expanded={picked?.index === s.index} onClick={e => open(s.index,e.currentTarget)}>
          <span className="am-tile" data-tool={s.tool}><ToolMark tool={s.tool}/></span><span className="am-row-text">{s.label}</span>
          <span className="am-duration" data-state={s.state}>{s.state === "failed" ? "Failed" : seconds(s.took)}</span>
        </button>
      </li>)}
    </ol>}
    {picked && selected && <div className="am-detail" ref={dialog} role="dialog" aria-label={picked.label} style={{ top: selected.top }}
      onKeyDown={e => { if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); close(); } }}>
      <header><span className="am-tile" data-tool={picked.tool}><ToolMark tool={picked.tool}/></span><div className="am-who"><strong>{picked.label}</strong><small>{picked.tool}</small></div>
        <button type="button" className="am-icon" aria-label="Close details" onClick={close}><X size={12}/></button></header>
      <dl>{[["Started", "+"+clock(picked.start)],["Took", seconds(picked.took)],["Share", Math.round(100*picked.took/(total||1))+"%"],["State", picked.state]].map(([k,v]) => <div key={k}><dt>{k}</dt><dd data-state={k === "State" ? v : undefined}>{v}</dd></div>)}</dl>
      <p>{picked.detail}</p>{picked.output && <code title={picked.output}>{picked.output}</code>}
    </div>}
  </>;
}

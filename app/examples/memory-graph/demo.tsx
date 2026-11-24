"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import { Details, type Panel, type Selection } from "./details";
import { Graph, type Travel } from "./graph";
import { beats, memories, memoryFromFile, tools, type Entry } from "./session";
import "./graph.css";

function Session({ replay }: { replay: () => void }) {
  const [step, setStep] = useState(0), [extra, setExtra] = useState<Entry[]>([]);
  const [disabled,setDisabled] = useState<string[]>([]), [forgotten,setForgotten] = useState<string[]>([]);
  const [selection, setSelection] = useState<Selection | null>(null);
  const anchor = useRef<HTMLButtonElement | null>(null), interacted = useRef(false);
  const [notice,setNotice] = useState("");
  useEffect(() => {
    const timers = beats.slice(1).map((beat,i) => window.setTimeout(() => setStep(i+1),beat.at));
    timers.push(window.setTimeout(() => { if (!interacted.current) replay(); }, 18000));
    return () => timers.forEach(clearTimeout);
  }, [replay]);
  const beat = beats[step];
  const memoryList = [...memories.slice(0,4), ...memories.slice(4).filter(m => beats.slice(0,step+1).some(b => b.learn === m.id)), ...extra.filter(e => e.kind === "memory")].filter(m => !forgotten.includes(m.id));
  const toolList = [...tools, ...extra.filter(e => e.kind === "tool")];
  const current = toolList.find(t => t.id === beat.using && !disabled.includes(t.id));
  const recall = memoryList.filter(m => beat.recall?.includes(m.id) && !disabled.includes(m.id));
  const active = [...recall.map(m => m.id), ...(current ? [current.id] : [])];
  const status = current ? `Using ${current.name}` : beat.learn ? "Learning…" : recall.length ? `Recalling ${recall.length} ${recall.length === 1 ? "memory" : "memories"}` : "Personal assistant";
  const flights: Travel[] = [...beats.slice(0,step+1).flatMap(b => b.flight ? [{...b.flight,key:String(b.at)}] : []),...extra.map(e => ({ to:e.id,key:e.id }))];
  const close = useCallback(() => { setSelection(null); anchor.current?.focus({preventScroll:true}); }, []);
  function open(panel: Panel, button: HTMLButtonElement) {
    interacted.current = true;
    if (button === anchor.current && selection) { close(); return; }
    anchor.current = button; setSelection({panel,anchor:button});
  }
  function select(panel: Panel) {
    let button = anchor.current;
    if (panel.kind === "entry") button = button?.closest(".mg-map")?.querySelector<HTMLButtonElement>(`[data-key="${panel.item.id}"]`) ?? button;
    if (button) { anchor.current=button; setSelection({panel,anchor:button}); }
  }
  function add(items: Entry[]) {
    if (!items.length) return;
    setExtra(previous => [...previous,...items]);
    setNotice(items.map(e => e.kind === "tool" ? `Connected ${e.name}` : `Learned ${e.name}`).join(". ")); close();
  }
  return <div className="mg-view"><div className="mg-frame"><button type="button" className="mg-replay" onClick={replay} aria-label="Replay memory graph" title="Replay"><RotateCcw size={14} /></button>
    <section className="mg-shell" aria-label="Assistant memory graph"><header className="mg-heading"><b>Assistant memory and tools</b><span>{memoryList.filter(m => !memoryList.some(other => other.replaces === m.id)).length} memories</span><span>{toolList.length} tools</span></header>
      <Graph memories={memoryList} tools={toolList} disabled={disabled} active={active} flights={flights} status={status} selected={selection?.anchor.dataset.key} open={open} />
      {selection && <Details selection={selection} memories={memoryList} tools={toolList} disabled={disabled} active={active} close={close} select={select} toggle={id => setDisabled(ids => ids.includes(id) ? ids.filter(other => other !== id) : [...ids,id])} forget={id => { const agent = anchor.current?.closest(".mg-map")?.querySelector<HTMLButtonElement>('[data-key="agent"]'); setForgotten(ids => [...ids,id]); setNotice("Memory forgotten"); close(); agent?.focus(); }} connect={t => add([t])} addFiles={files => add(Array.from(files,memoryFromFile))} />}
      <span className="sr-only" aria-live="polite">{notice || (beat.flight?.from ? `Assistant learned ${memoryList.find(m => m.id === beat.flight?.to)?.name ?? "a memory"}` : current ? `Assistant is using ${current.name}` : "")}</span>
    </section></div></div>;
}

export default function Demo() {
  const [run,setRun] = useState(0);
  const replay = useCallback(() => setRun(n => n+1),[]);
  return <Session key={run} replay={replay} />;
}

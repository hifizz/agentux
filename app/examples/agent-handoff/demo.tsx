"use client";

import { useEffect, useState } from "react";
import { ArrowRight, RotateCcw } from "lucide-react";
import { AgentCard, Face, TaskMark } from "./agent";
import { Connections } from "./connections";
import { PacketCard, type Drag } from "./packet";
import { assign, period, schedule, snapshot, type Packet } from "./relay";
import { agents } from "./tasks";
import "./handoff.css";

function Board() {
  const [now, setNow] = useState(0), [runs, setRuns] = useState(schedule);
  const [detail, setDetail] = useState<number | null>(null), [picked, setPicked] = useState<Packet | null>(null), [drag, setDrag] = useState<Drag | null>(null);
  useEffect(() => {
    const origin = performance.now(), timer = window.setInterval(() => setNow(performance.now() - origin), 100);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    const dismiss = (event: KeyboardEvent) => { if (event.key === "Escape") { setDetail(null); setPicked(null); } };
    const outside = (event: PointerEvent) => { if (event.target instanceof Element && !event.target.closest(".ah-agent-slot")) setDetail(null); };
    document.addEventListener("keydown", dismiss); document.addEventListener("pointerdown", outside);
    return () => { document.removeEventListener("keydown", dismiss); document.removeEventListener("pointerdown", outside); };
  }, []);
  const { packets, active, costs, states, waiting, lights } = snapshot(now, runs);
  const moving = drag?.packet ?? picked;
  function deliver(packet: Packet, index: number) {
    if (index <= packet.lane) return;
    setRuns(previous => assign(previous, packet.task, index, now)); setPicked(null); setDetail(null);
  }
  return <div className="ah-board" aria-label="Task relay">
    <Connections lights={lights}/>
    <div className="ah-layout">{agents.map((a, index) => {
      const task = active[index] ?? (index === 0 ? waiting[0] : undefined);
      return <AgentCard key={a.name} index={index} task={task} working={!!active[index]} waiting={waiting.length} cost={costs[index]} open={detail === index && !!task} over={drag?.over === index} eligible={moving ? index > moving.lane : null} onClose={() => setDetail(null)} onClick={() => { if (moving) deliver(moving, index); else if (task) setDetail(detail === index ? null : index); }}/>;
    })}
    {packets.map((list, lane) => <section key={lane} className="ah-lane" data-lane={lane} aria-label={`Handoffs from ${agents[lane].name} to ${agents[lane + 1].name}`}><header className="ah-lane-head"><span className="ah-tile"><Face index={lane}/></span><span>{agents[lane].name}</span><ArrowRight size={12}/><span className="ah-tile"><Face index={lane + 1}/></span><span>{agents[lane + 1].name}</span><b>{list.length}</b></header><ul className="ah-history">{list.map(packet => <PacketCard key={packet.key} packet={packet} state={states.get(packet.task) ?? "Looks good"} picked={picked?.key === packet.key} dragging={drag?.packet.key === packet.key} onPick={() => setPicked(picked?.key === packet.key ? null : packet)} onDrag={setDrag} onDrop={index => deliver(packet, index)}/>)}</ul></section>)}</div>
    {drag && <div className="ah-ghost" style={{ left: drag.x, top: drag.y, width: drag.width }} aria-hidden="true"><TaskMark brand={drag.packet.task.brand}/>{drag.packet.task.title}</div>}
  </div>;
}

export default function Demo() {
  const [run, setRun] = useState(0);
  useEffect(() => { const timer = window.setTimeout(() => setRun(n => n + 1), period); return () => clearTimeout(timer); }, [run]);
  return <div className="ah-view"><div className="ah-frame"><button type="button" className="ah-replay" title="Replay" aria-label="Replay handoff" onClick={() => setRun(n => n + 1)}><RotateCcw size={14}/></button><Board key={run}/></div></div>;
}

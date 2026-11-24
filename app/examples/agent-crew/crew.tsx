"use client";

import { useState, type KeyboardEvent, type ReactNode } from "react";
import { AgentCard } from "./agent-card";
import { itinerary, useRoutes, Wires } from "./routes";
import type { Agent, Action, Project, Pass } from "./model";

const palette = ["var(--cc-blue)", "rgb(166 81 240 / 85%)", "rgb(20 179 240 / 85%)", "rgb(95 200 138 / 90%)"];

export function CrewTree({ agents, project, now, pass, onSteer }: { agents: Agent[]; project: Project; now: number; pass?: Pass; onSteer: (a: Agent, action: Action, message?: string) => void }) {
  const { ref, edges } = useRoutes(project.agents);
  const [boundary, setBoundary] = useState<HTMLDivElement | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const [focus, setFocus] = useState(agents[0].id);
  const hops = itinerary(edges, pass);
  const last = hops.at(-1);
  const tones = new Map<string, string>();
  function navigate(e: KeyboardEvent<HTMLButtonElement>, id: string) {
    const i = agents.findIndex(a => a.id === id);
    const index = e.key === "Home" ? 0 : e.key === "End" ? agents.length - 1 : ["ArrowRight","ArrowDown"].includes(e.key) ? Math.min(agents.length-1,i+1) : ["ArrowLeft","ArrowUp"].includes(e.key) ? Math.max(0,i-1) : -1;
    if (index < 0) return;
    e.preventDefault(); setOpen(null);
    ref.current?.querySelectorAll<HTMLButtonElement>(".cc-card")[index]?.focus();
  }
  function branch(a: Agent, depth: number, tone: string): ReactNode {
    tones.set(a.id,tone);
    const children = agents.filter(n => n.parent === a.id);
    return <div key={a.id} className={depth === 0 ? "cc-root" : "cc-branch"}>
      <div className="cc-slot" data-slot={a.id}><AgentCard agent={a} depth={depth} tone={tone} now={now} boundary={boundary} open={open === a.id} tabStop={a.id === focus}
        onOpen={next => setOpen(current => next ? a.id : current === a.id ? null : current)} onFocus={() => setFocus(a.id)} onKey={e => navigate(e,a.id)} onSteer={(action,text) => onSteer(a,action,text)}
        flash={last && pass?.to === a.id ? { at: pass.at, delay: last.delay + last.duration, side: last.reverse ? "bottom" : last.edge.overhead ? "top" : "left" } : undefined} /></div>
      {children.length > 0 && <div className={depth === 0 ? "cc-columns" : "cc-below"} role="group">{children.map((child,i) => branch(child,depth+1,depth === 0 ? palette[1 + i % 3] : tone))}</div>}
    </div>;
  }
  const nodes = branch(agents[0],0,palette[0]);
  return <div ref={setBoundary}><div ref={ref} className="cc-tree" role="tree" aria-label={project.name}>
    <Wires edges={edges} hops={hops} pass={pass} tones={tones} agents={agents} />{nodes}
  </div></div>;
}

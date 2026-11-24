"use client";

import { useEffect, useReducer } from "react";
import { RotateCcw } from "lucide-react";
import { CrewTree } from "./crew";
import { ProjectPicker } from "./project-picker";
import { projects } from "./projects";
import { snapshot, steer, type Action, type Agent } from "./model";
import "./crew.css";

type Playback = { index: number; run: number; scene: number; now: number; edits: Record<string, Partial<Agent>>; notice: { text: string; at: number } | null };
type Event = { type: "tick"; now: number } | { type: "start"; index: number } | { type: "steer"; agent: Agent; action: Action; message?: string };
const initial: Playback = { index: 0, run: 0, scene: 0, now: 0, edits: {}, notice: null };

function reduce(state: Playback, event: Event): Playback {
  if (event.type === "start") return { ...initial, index: event.index, run: state.run + 1, scene: state.scene + 1 };
  if (event.type === "tick") return event.now < projects[state.index].period ? { ...state, now: event.now } : { ...initial, index: state.index, run: state.run + 1, scene: state.scene };
  const { agent, action, message = "" } = event;
  const change = steer(agent, action, state.now, message, state.edits[agent.id]);
  const edits = { ...state.edits, [agent.id]: change };
  return { ...state, edits, notice: { at: state.now, text: action === "Message" ? `Sent to ${agent.name}: ${message}` : `${agent.name}: ${change.activity ?? "Resumed"}` } };
}

export default function Demo() {
  const [state, dispatch] = useReducer(reduce, initial);
  const project = projects[state.index];
  useEffect(() => {
    const start = performance.now();
    const timer = window.setInterval(() => dispatch({ type: "tick", now: performance.now() - start }), 100);
    return () => clearInterval(timer);
  }, [state.run]);
  const { agents: base, pass } = snapshot(project,state.now);
  const agents = base.map(a => ({ ...a, ...state.edits[a.id] }));
  const names = new Map(agents.map(a => [a.id, a.name]));
  const working = agents.filter(a => a.status === "active").length, waiting = agents.filter(a => a.status === "waiting").length;
  const announce = state.notice && state.notice.at >= (pass?.at ?? 0) ? state.notice.text : pass ? `${names.get(pass.from)} handed to ${names.get(pass.to)}: ${pass.text}` : "";
  return <div className="cc-view cc-skin"><div className="cc-frame"><button type="button" className="cc-replay" aria-label="Replay crew" title="Replay" onClick={() => dispatch({ type: "start", index: state.index })}><RotateCcw size={14} /></button>
    <section className="cc-shell" aria-label={project.name}><header className="cc-bar"><ProjectPicker index={state.index} agents={agents} onChange={index => dispatch({type:"start",index})} />
      <div className="cc-summary">{working > 0 && <span>{working} working</span>}{waiting > 0 && <span className="cc-waiting">{waiting} needs you</span>}{agents.length} agents</div></header>
      <CrewTree key={state.scene} project={project} agents={agents} pass={pass} now={state.now} onSteer={(agent,action,message) => dispatch({type:"steer",agent,action,message})} />
      <span className="sr-only" aria-live="polite">{announce}</span>
    </section></div></div>;
}

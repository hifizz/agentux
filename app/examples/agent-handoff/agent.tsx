import { useId, useState, type ReactNode } from "react";
import { X } from "lucide-react";
import { AnthropicMark, GitHubMark, NotionMark, OpenAIMark, SlackMark } from "../_shared/ui/icons";
import { agents, type Brand, type Task } from "./tasks";

export function TaskMark({ brand }: { brand: Brand }) {
  const Mark = { github: GitHubMark, slack: SlackMark, notion: NotionMark }[brand];
  return <Mark viewBox={brand === "notion" ? "0 0 16 16" : "1.2 1.2 13.6 13.6"} />;
}

export function Face({ index }: { index: number }) {
  const id = useId();
  if (index === 0) return <AnthropicMark />;
  if (index === 1) return <OpenAIMark />;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><defs><linearGradient id={id} x1="0" y1="1" x2="1" y2="0" gradientUnits="objectBoundingBox"><stop stopColor="#1c7dff"/><stop offset=".52" stopColor="#306cff"/><stop offset="1" stopColor="#984dff"/></linearGradient></defs><path fill={`url(#${id})`} d="M12 0Q13.5 10.5 24 12Q13.5 13.5 12 24Q10.5 13.5 0 12Q10.5 10.5 12 0Z"/></svg>;
}

export function Spinner() { return <svg className="ah-spinner" viewBox="0 0 12 12" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="6" cy="6" r="4.25" opacity=".25"/><path d="M6 1.75a4.25 4.25 0 0 1 4.25 4.25" strokeLinecap="round"/></svg>; }

export function Swap({ value, children }: { value: string; children: ReactNode }) {
  const [layers, setLayers] = useState<{ value: string; current: ReactNode; old: ReactNode }>({ value, current: children, old: null });
  if (value !== layers.value) setLayers({ value, current: children, old: layers.current });
  return <span className="ah-swap" key={value}>{layers.old && <span className="ah-out" aria-hidden="true" onAnimationEnd={event => { if (event.target === event.currentTarget) setLayers(current => ({ ...current, old: null })); }}>{layers.old}</span>}<span className={layers.old ? "ah-in" : undefined}>{children}</span></span>;
}

type AgentProps = { index: number; task?: Task; working: boolean; waiting: number; cost: number; open: boolean; eligible: boolean | null; over: boolean; onClick: () => void; onClose: () => void };
export function AgentCard({ index, task, working, waiting, cost, open, eligible, over, onClick, onClose }: AgentProps) {
  const agent = agents[index], status = working ? "Working" : "Idle", action = working ? agent.action : "Up next";
  return <div className="ah-agent-slot" data-agent={index} data-blocked={eligible === false || undefined} data-target={over || undefined} data-peek={open || undefined}>
    <button type="button" className="ah-agent" aria-label={eligible !== null ? `Give the task to ${agent.name}` : [agent.name, task?.title].filter(Boolean).join(": ")} aria-disabled={eligible === false} aria-expanded={open} onClick={onClick}>
      <span className="ah-agent-head"><span className="ah-face"><Face index={index}/></span><span className="ah-who"><strong>{agent.name}</strong><small>{agent.model}</small></span><span className={working ? "ah-cost ah-shine" : "ah-cost"}>${cost.toFixed(2)}</span><span className="ah-status" data-working={working} title={status}>{working && <Spinner/>}<span className="ah-status-text"><Swap value={status}>{status}</Swap></span></span></span>
      <span className="ah-description">{agent.description}</span>
      <span className="ah-now"><Swap value={`${task?.title}:${working}:${waiting}`}>{!task ? "Ready for a task" : <>{!working && <span>Up next</span>}<span className="ah-tile"><TaskMark brand={task.brand}/></span><strong>{task.title}</strong>{working ? <span className="ah-shine">{action}</span> : waiting > 1 && <span className="ah-more">+{waiting - 1}</span>}</>}</Swap></span>
    </button>
    {open && task && <aside className="ah-peek" aria-label={`${agent.name} task details`}><div className="ah-peek-head"><span className="ah-tile"><TaskMark brand={task.brand}/></span><strong>{task.title}</strong><button type="button" aria-label="Close details" onClick={onClose}><X size={12}/></button></div><div className="ah-peek-state"><span className={working ? "ah-shine" : undefined}>{action}</span></div><div className="ah-peek-body"><p>{task.brief}</p><small>Tools</small><ul key={task.title}>{task.tools.map(([brand, name, count], i) => <li key={name} style={{ animationDelay: `${40 * i}ms` }}><span className="ah-tile"><TaskMark brand={brand}/></span><span>{name}</span>{count && <small>{count}</small>}</li>)}</ul></div></aside>}
  </div>;
}

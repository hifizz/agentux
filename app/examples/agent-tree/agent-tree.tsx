"use client";

import { AnimatePresence, usePresence } from "motion/react";
import { Check, ChevronDown, Clock3, Pause, TriangleAlert } from "lucide-react";
import { useEffect, useEffectEvent, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { branches, dollars, elapsed, issueText, statusText, type Agent, type Status } from "./run";
import { modelMarks, RunningRing, toolMarks, TreeSpark } from "./marks";
import { useWires } from "./use-wires";
import "./tree.css";

type Issue = keyof typeof issueText;
export type Answer = "approve" | "reject" | "dismiss" | "retry";
const glyphs = { running: RunningRing, done: Check, waiting: Clock3, failed: TriangleAlert, stopped: Pause };

function Badge({ status, iconOnly = false }: { status: Status; iconOnly?: boolean }) {
  const Icon = glyphs[status];
  return <span className="at-badge" data-status={status}><Icon size={12} aria-hidden="true" />{!iconOnly && statusText[status]}</span>;
}

function Card({ agent, count, open, toggle, cost, live }: { agent: Agent; count: number; open: boolean; toggle: () => void; cost: number; live: boolean }) {
  const Mark = modelMarks[agent.model];
  return <div className="at-card" data-status={agent.status}>
    <div className="at-heading">
      <span className="at-avatar"><Mark /></span>
      <span className="at-identity"><strong title={agent.name}>{agent.name}</strong><small>{agent.model}</small></span>
      <Badge status={agent.status} />
    </div>
    <p className="at-task" title={agent.task}><span className="at-tools" aria-hidden="true">{agent.tools.map(key => {
      const Icon = toolMarks[key];
      return <span key={key} data-tool={key}><Icon /></span>;
    })}</span>{agent.task}</p>
    <div className="at-foot"><span><b className="at-amount" data-live={live}>{dollars(cost)}</b> · {elapsed(agent.seconds)}</span>
      {count > 0 && <button type="button" className="at-fold" aria-expanded={open} aria-label={`${open ? "Hide" : "Show"} ${count} sub-agents of ${agent.name}`} onClick={toggle}>{!open && "+"}{count}<ChevronDown size={12} strokeWidth={1.8} /></button>}
    </div>
  </div>;
}

function Item({ agent, depth, expanded, children }: { agent: Agent; depth: number; expanded?: boolean; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [present, remove] = usePresence();
  const finish = useEffectEvent(() => remove?.());
  useEffect(() => {
    if (present) return;
    const count = ref.current?.closest('[role="tree"]')?.querySelectorAll('[data-exiting] .at-slot').length ?? 1;
    const timer = setTimeout(finish, matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 280 + Math.min(7, count - 1) * 45);
    return () => clearTimeout(timer);
  }, [present]);
  return <div ref={ref} role="treeitem" aria-selected={false} aria-level={depth + 1} aria-label={`${agent.name}: ${statusText[agent.status]}`} aria-expanded={expanded} aria-hidden={!present || undefined} inert={!present} className="at-item" data-exiting={!present || undefined}>{children}</div>;
}

export function AgentTree({ agents, folded, onFold, issue, onIssue, onAnswer }: {
  agents: Agent[]; folded: ReadonlySet<string>; onFold: (id: string) => void;
  issue: Issue | null; onIssue: (issue: Issue | null) => void; onAnswer: (action: Answer) => void;
}) {
  const tree = useWires();
  const head = useRef<HTMLElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const [width, setWidth] = useState(760);
  const { children, total } = branches(agents);
  const root = agents[0];
  const columns = root ? children.get(root.id)?.length ?? 0 : 0;
  const wide = width >= Math.max(560, columns * 248 + (columns - 1) * 8);
  const depth = agents.reduce((max, a) => Math.max(max, a.parent ? a.parent === root?.id ? 1 : 2 : 0), 0);
  useLayoutEffect(() => {
    const element = tree.current;
    if (!element) return;
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(element); return () => ro.disconnect();
  }, [tree]);
  useEffect(() => {
    if (!issue) return;
    head.current?.querySelector<HTMLButtonElement>("[data-primary]")?.focus({ preventScroll: true });
    const close = (event: PointerEvent | KeyboardEvent) => {
      if (event instanceof KeyboardEvent ? event.key !== "Escape" : head.current?.contains(event.target as Node)) return;
      onIssue(null);
      if (event instanceof KeyboardEvent) opener.current?.focus();
    };
    document.addEventListener("keydown", close); document.addEventListener("pointerdown", close);
    return () => { document.removeEventListener("keydown", close); document.removeEventListener("pointerdown", close); };
  }, [issue, onIssue]);
  if (!root) return null;
  function item(agent: Agent, level: number): ReactNode {
    const group = children.get(agent.id) ?? [];
    const open = !folded.has(agent.id);
    return <Item key={agent.id} agent={agent} depth={level} expanded={group.length ? open : undefined}>
      <div className="at-slot" data-id={agent.id} data-depth={level} data-parent={agent.parent}>
        <Card agent={agent} count={group.length} open={open} toggle={() => onFold(agent.id)} {...total(agent)} />
      </div>
      <div role="group" className={level === 0 ? "at-group at-columns" : "at-group at-twigs"}>
        <AnimatePresence>{open && group.map(child => item(child, level + 1))}</AnimatePresence>
      </div>
    </Item>;
  }
  const running = agents.filter(a => a.status === "running").length;
  const active = agents.find(a => a.status === issue);
  return <section className="at-panel" aria-label="Agent run">
    <header className="at-bar" ref={head}><TreeSpark /><span className="at-title" tabIndex={-1}>Agents</span>
      <div className="at-totals" aria-live="polite"><span>{agents.length} {agents.length === 1 ? "agent" : "agents"}</span>
        {running > 0 && <span className="at-running">{running} running</span>}
        {(["waiting", "failed"] as const).map(kind => {
          const n = agents.filter(a => a.status === kind).length;
          return n > 0 && <button key={kind} type="button" className="at-alert" data-status={kind} aria-haspopup="dialog" aria-expanded={issue === kind} onClick={event => { opener.current = event.currentTarget; onIssue(issue === kind ? null : kind); }}>{n} {kind === "waiting" ? "needs you" : "failed"}<ChevronDown size={12} strokeWidth={1.8} /></button>;
        })}<b className="at-amount" data-live={running > 0}>{dollars(total(root).cost)}</b>
      </div>
      {issue && active && <div role="dialog" aria-label={`${active.name}: ${statusText[issue]}`} className="at-dialog">
        <div><Badge status={issue} iconOnly /><strong>{active.name}</strong><small>{active.task}</small></div>
        <p>{issueText[issue]}</p><footer>{(issue === "waiting" ? ["reject", "approve"] as const : ["dismiss", "retry"] as const).map((action, i) => <button key={action} type="button" data-primary={i === 1 || undefined} onClick={() => { onAnswer(action); head.current?.querySelector<HTMLElement>(".at-title")?.focus(); }}>{action}</button>)}</footer>
      </div>}
    </header>
    <div ref={tree} role="tree" aria-label="Agents" className="at-tree" data-wide={wide} style={{ "--at-depth": depth } as React.CSSProperties}>
      <svg className="at-wires" aria-hidden="true" />{item(root, 0)}<svg className="at-pins" aria-hidden="true" />
    </div>
  </section>;
}

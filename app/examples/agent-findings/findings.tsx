"use client";

import { useState, type ReactNode } from "react";
import { X } from "lucide-react";
import { TreeSpark } from "../agent-tree/marks";
import "./findings.css";

export type Severity = "critical" | "warning" | "note";
export type Finding = { id: string; agentId: string; severity: Severity; title: string; location: string; at: number };
export type FindingAgent = { id: string; name: string; model: string; logo: ReactNode; step: string; done: number; total: number };

const counted = ["critical", "warning"] as const;
const ink: Record<Severity, readonly number[]> = { critical: [1, 1, 1, .6], warning: [1, .6, .6, .3], note: [.6, .3, .3, .3] };

function SeverityMark({ severity }: { severity: Severity }) {
  return <svg className="af-mark" data-level={severity} width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true">
    {ink[severity].map((opacity, i) => <rect key={i} x={(i % 2) * 5.5} y={Math.floor(i / 2) * 5.5} width="4.5" height="4.5" rx="1" opacity={opacity} />)}
  </svg>;
}

function Counts({ findings, summary = false }: { findings: readonly Finding[]; summary?: boolean }) {
  return <span className={summary ? "af-summary" : "af-counts"}>{counted.map(level => {
    const n = findings.filter(f => f.severity === level).length;
    const label = level === "critical" ? "critical" : n === 1 ? "warning" : "warnings";
    return <span key={level} data-level={level} data-zero={!n || undefined}>
      {!summary && <SeverityMark severity={level} />}<b key={n}>{n}</b><span className={summary ? undefined : "sr-only"}>{label}</span>
    </span>;
  })}</span>;
}

function age(now: number, at: number) {
  const seconds = Math.round(Math.max(0, now - at) / 1000);
  if (seconds < 5) return "now";
  return seconds < 60 ? `${seconds}s` : `${Math.floor(seconds / 60)}m`;
}

export function AgentFindings({ agents, findings, now, title = "Verification", rows = 4, onOpen }: {
  agents: readonly FindingAgent[]; findings: readonly Finding[]; now: number; title?: string; rows?: number; onOpen?: (finding: Finding) => void;
}) {
  const [filter, setFilter] = useState<string | null>(null);
  const selected = agents.find(a => a.id === filter);
  const visible = findings.filter(f => !selected || f.agentId === selected.id).sort((a, b) => b.at - a.at).slice(0, rows + 1);
  return <section className="af-panel" aria-label={title}>
    <div className="af-card">
      <header className="af-head"><span className="af-spark"><TreeSpark /></span><strong title={title}>{title}</strong>
        <span className="af-progress">{agents.reduce((n, a) => n + a.done, 0)} of {agents.reduce((n, a) => n + a.total, 0)} checks</span>
        <Counts findings={findings} summary />
      </header>
      <ul aria-label="Agents">{agents.map(a => <li key={a.id}>
        <button type="button" className="af-agent" aria-pressed={selected?.id === a.id} data-dim={!!selected && selected.id !== a.id || undefined} data-running={a.done < a.total} title={`${a.name} · ${a.model}`} onClick={() => setFilter(selected?.id === a.id ? null : a.id)}>
          <span className="af-avatar" aria-hidden="true">{a.logo}</span><span className="af-who"><b>{a.name}</b><small key={a.step} title={a.step}>{a.step}</small></span>
          <span className="af-track" aria-hidden="true"><span style={{ width: `${a.total ? a.done / a.total * 100 : 0}%` }} /></span>
          <span className="af-checks">{a.done}/{a.total}</span><Counts findings={findings.filter(f => f.agentId === a.id)} />
        </button>
      </li>)}</ul>
      <div className="af-feed-heading"><span>Latest findings</span>{selected && <button key={selected.id} className="af-chip" type="button" aria-label={`Show all agents (filtered by ${selected.name})`} onClick={() => setFilter(null)}><span>{selected.name}</span><X size={10} aria-hidden="true" /></button>}</div>
      <ol className="af-feed" aria-label="Latest findings" aria-live="polite" aria-relevant="additions" style={{ height: Math.max(1, Math.min(rows, visible.length)) * 40 + 8 }}>
        {visible.length === 0 && <li className="af-empty">Nothing found yet</li>}
        {visible.map((finding, i) => {
          const name = agents.find(a => a.id === finding.agentId)?.name;
          return <li key={finding.id} className="af-slot" data-out={i >= rows || undefined} aria-hidden={i >= rows || undefined} inert={i >= rows} style={{ transform: `translateY(${40 * i}px)` }}>
            <button type="button" className="af-finding" onClick={() => onOpen?.(finding)} tabIndex={i < rows ? 0 : -1}>
              <span className="af-entry"><SeverityMark severity={finding.severity} /><span className="sr-only">{finding.severity}: </span>
                <span className="af-subject" title={finding.title}>{finding.title}</span>
                <span className="af-location" title={`${name} · ${finding.location}`}><span>{name}</span><i>·</i><code>{finding.location}</code></span>
                <span className="af-age">{age(now, finding.at)}</span>
              </span>
            </button>
          </li>;
        })}
      </ol>
    </div>
  </section>;
}

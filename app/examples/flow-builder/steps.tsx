import { Check, Clock3, Database, Globe, Mail, NotepadText, Plus, X } from "lucide-react";
import { useEffect, useState, type CSSProperties, type KeyboardEvent, type MouseEvent } from "react";
import type { Path, Slot, Step, Template } from "./workflow";
import type { Result } from "./use-test-run";

const glyphs = { form: NotepadText, database: Database, clock: Clock3, globe: Globe, mail: Mail };
const kindLabel = { trigger: "Trigger", agent: "Agent", branch: "If / else", action: "Action", wait: "Wait" };
export function Tile({ icon, live, alternate }: { icon: Template["icon"]; live?: boolean; alternate?: boolean }) {
  if (icon === "pixels") return <span className="fb-pixels" aria-hidden="true" data-live={live || undefined}>{(alternate ? "101010111" : "111010101").split("").map((bit, i) => <i key={i} data-lit={bit === "1" || undefined} style={{ animationDelay: `${(i % 3 + Math.floor(i / 3)) * 120}ms` }} />)}</span>;
  if (icon === "slack") return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">{[0, 90, 180, 270].map(angle => <g key={angle} transform={`rotate(${angle} 12 12)`}><rect x="8" y="2" width="3.5" height="8.5" rx="1.75" /><rect x="2.5" y="7" width="3.5" height="3.5" rx="1.75" /></g>)}</svg>;
  if (icon === "split") return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 7v10m2 2h7q5 0 5-5v-1m-3 2 3-3 3 3" /><circle cx="5" cy="5" r="2" /><circle cx="5" cy="19" r="2" /><circle cx="19" cy="5" r="2" /></svg>;
  const Glyph = glyphs[icon];
  return <Glyph size={14} strokeWidth={1.5} aria-hidden="true" />;
}

function Elapsed({ start }: { start: number }) {
  const [ms, setMs] = useState(0);
  useEffect(() => { const timer = window.setInterval(() => setMs(performance.now() - start), 80); return () => clearInterval(timer); }, [start]);
  return <>{(ms / 1000).toFixed(1)}s</>;
}

type Controls = {
  selected: string | null; active?: string; results: Record<string, Result>; order: Step[]; openLabel?: string;
  select: (id: string) => void; remove: (slot: Slot) => void;
  keys: (e: KeyboardEvent<HTMLButtonElement>, slot: Slot, step: Step) => void;
  menu: (e: MouseEvent<HTMLButtonElement>, slot: Slot, label: string) => void;
};
function Link({ label, slot, state, end, first, ui }: { label: string; slot: Slot; state?: Result["state"]; end?: boolean; first?: boolean; ui: Controls }) {
  return <div className="fb-link" data-end={end || undefined} data-first={first || undefined} data-state={state}>
    {!first && <i className="fb-joint" />}<button type="button" className="fb-plus" aria-label={label} aria-haspopup="menu" aria-expanded={ui.openLabel === label} disabled={!!ui.active} onClick={e => ui.menu(e, slot, label)}><Plus size={12} strokeWidth={1.5} /></button>
  </div>;
}

function Card({ step, slot, ui }: { step: Step; slot: Slot; ui: Controls }) {
  const result = ui.results[step.id], state = result?.state, live = state === "running", selected = step.id === ui.selected;
  const tag = live ? "Running" : state === "done" ? "Passed" : state === "skipped" ? "Skipped" : kindLabel[step.kind];
  return <div className="fb-node" data-step={step.id} data-selected={selected || undefined} data-state={state}>
    <button type="button" className="fb-card" aria-pressed={selected} title={`${step.title} · ${step.detail}`} onClick={() => ui.select(step.id)} onKeyDown={e => ui.keys(e, slot, step)}>
      <span className="fb-face">{live && <i className="fb-arrival" />}
        <span className="fb-row"><span className="fb-tile" data-trigger={step.kind === "trigger" || undefined}><Tile icon={step.icon} live={live} /></span>
          <span className="fb-caption"><strong>{step.title}</strong><small>{step.detail}</small></span>
          <span key={tag} className="fb-badge" data-state={state}>{live ? <i className="fb-spinner" /> : state === "done" ? <Check size={11} strokeWidth={1.6} /> : null}{tag}</span>
        </span>
        <span className="fb-activity">{step.note}</span><span className="fb-stats" aria-hidden="true"><span className="fb-meter"><i /></span><span>{result?.state === "running" ? <Elapsed start={result.ms} /> : result?.state === "done" ? `${(result.ms / 1000).toFixed(1)}s` : "–"}</span></span>
      </span>
    </button>{selected && step.kind !== "trigger" && !ui.active && <button type="button" className="fb-remove" aria-label={`Remove ${step.title}`} onClick={() => ui.remove(slot)}><X size={12} /></button>}
  </div>;
}

export function Steps({ path, ui }: { path: Path; ui: Controls }) {
  const prev = path.steps.at(-1), nested = path.id !== "root";
  return <>{path.steps.map((step, index) => {
    const previous = path.steps[index - 1], slot = { path: path.id, index };
    return <div className="fb-item" key={step.id} style={{ "--fb-order": ui.order.indexOf(step) } as CSSProperties}>
      {(nested || previous) && <Link slot={slot} ui={ui} label={previous ? `Add a step after ${previous.title}` : `Add a step at the start of ${path.label}`} state={ui.results[step.id]?.state} first={!previous} />}
      <Card step={step} slot={slot} ui={ui} />
      {step.paths && <div className="fb-fork"><i className="fb-joint" /><div className="fb-paths">{step.paths.map(child => <div className="fb-path" key={child.id} data-skipped={ui.results[child.id]?.state === "skipped" || undefined}><span className="fb-path-name">{child.label}</span><Steps path={child} ui={ui} /></div>)}</div></div>}
    </div>;
  })}{!prev?.paths && <Link label={prev ? `Add a step after ${prev.title}` : `Add a step to ${path.label}`} slot={{ path: path.id, index: path.steps.length }} end first={!prev} ui={ui} />}</>;
}

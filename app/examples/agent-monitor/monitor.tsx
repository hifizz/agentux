import { useLayoutEffect, useRef, useState } from "react";
import { ArrowUpRight, ChevronsDownUp, CornerDownLeft, Pause, Play, RotateCcw, X } from "lucide-react";
import { Face, ToolMark } from "./marks";
import { Folded } from "./folded";
import { History } from "./history";
import { Swap } from "./swap";
import { clock, entries, releaseCommand, scenes, statusName, type Action, type Run } from "./runs";

export function Monitor({ run, dispatch }: { run: Run; dispatch: (action: Action) => void }) {
  const [folded, setFolded] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const restoreFocus = useRef(false);
  const { scene, status, elapsed } = run;
  const project = scenes[scene], step = project.steps[run.index], rows = entries(run);
  const name = statusName[status], live = status === "running" || status === "waiting";
  const message = status === "waiting" ? "Ready to release" : status === "failed" ? "The invoice ledger is busy" : status === "paused" ? "Paused · "+step.active : status === "finished" ? `Finished in ${Math.floor(elapsed/1000)}s` : status === "cancelled" ? `Cancelled after ${Math.floor(elapsed/1000)}s` : status === "idle" ? "No task yet" : step.active;
  const label = `${project.name}: ${name}${live ? ", "+message : ""}`;
  const mark = status === "waiting" ? "GitHub" : status === "running" ? step.tool : null;
  const cost = run.cost > 0 && run.cost < 0.001 ? "<$0.001" : "$"+run.cost.toFixed(3);
  function changeFold() { restoreFocus.current = true; setFolded(!folded); }
  useLayoutEffect(() => {
    if (restoreFocus.current) root.current?.querySelector<HTMLButtonElement>(folded ? ".am-folded" : ".am-fold")?.focus({ preventScroll: true });
    restoreFocus.current = false;
  },[folded]);
  return <div ref={root} className="am-unit" data-status={status}>
    {folded ? <Folded run={run} label={label} onOpen={changeFold}/> :
      <section className="am-card" aria-label={label} tabIndex={status === "waiting" ? 0 : undefined}
        onKeyDown={e => {
          if (status !== "waiting" || e.defaultPrevented || root.current?.querySelector('[role="dialog"]')) return;
          if (e.key === "Escape" || (e.key === "Enter" && e.target === e.currentTarget)) { e.preventDefault(); dispatch(e.key === "Enter" ? "advance" : "cancel"); }
        }}>
        <header className="am-header"><Face scene={scene}/><div className="am-who"><strong>{project.name}</strong><small>{project.role}</small></div>
          {status !== "idle" && <span className="am-cost" data-shine={live || undefined} aria-label={`Cost so far ${cost}`}>{cost}</span>}
          <span className="am-status"><i/><Swap value={status} roll>{name}</Swap></span>
          <button type="button" className="am-icon am-fold" aria-label="Fold away" title="Fold away" aria-expanded="true" onClick={changeFold}><ChevronsDownUp size={13}/></button></header>
        <div className="am-well"><Swap value={status+run.index} roll>
          {mark && <span className="am-tile" data-tool={mark}><ToolMark tool={mark}/></span>}{status === "failed" && <i/>}
          <strong className="am-task" data-shine={status === "running" || undefined}>{message}</strong>
          {status === "waiting" && <code title={releaseCommand}>{releaseCommand}</code>}
          {status === "finished" && <span className="am-outcome">{project.note}</span>}
        </Swap>{(live || status === "failed" || status === "paused") && <span className="am-clock" aria-label={`Elapsed ${Math.floor(elapsed/1000)} seconds`}>{clock(elapsed)}</span>}</div>
        {rows.length > 0 && <History steps={rows} status={status}/>}
        <footer className="am-foot"><Swap value={status}>
          {status === "running" || status === "paused" ? <span className="am-actions">
            <button type="button" onClick={() => dispatch(status === "running" ? "pause" : "resume")}>{status === "running" ? <Pause size={12}/> : <Play size={12}/>} {status === "running" ? "Pause" : "Resume"}</button>
            <button type="button" onClick={() => dispatch("cancel")}><X size={12}/> Cancel</button></span>
            : status === "waiting" ? <><button type="button" onClick={() => dispatch("cancel")}>Decline <kbd>Esc</kbd></button><button type="button" className="am-primary" onClick={() => dispatch("advance")}>Allow <kbd><CornerDownLeft size={11}/></kbd></button></>
            : status === "failed" ? <button type="button" className="am-primary" onClick={() => dispatch("advance")}><RotateCcw size={12}/> Try again</button> : null}
        </Swap>
          <span className="am-count">{rows.length > 0 && `${rows.length}/${run.total}`}</span>
          <button type="button" className="am-log" onClick={() => root.current?.querySelector<HTMLElement>(".am-list, .am-track button")?.focus({ preventScroll: true })}>Log <ArrowUpRight size={12}/></button>
        </footer>
      </section>}
  </div>;
}

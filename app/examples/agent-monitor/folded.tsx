import { Check, TriangleAlert } from "lucide-react";
import { Face, ToolMark } from "./marks";
import { clock, entries, scenes, seconds, statusName, type Run, type Tool } from "./runs";
import { Swap } from "./swap";

export function Folded({ run, label, onOpen }: { run: Run; label: string; onOpen: () => void }) {
  const tools = new Map<Tool,{ title: string; sub: string; active: boolean }>();
  for (const step of entries(run)) tools.set(step.tool, { title: step.label, sub: `${step.tool} · ${seconds(step.took)}`, active: step.state === "running" && run.status === "running" });
  if (run.status === "waiting") tools.set("GitHub", { title: "Ready to release", sub: "Waiting on you", active: true });
  const { status } = run;
  return <button type="button" className="am-folded" aria-expanded={false} aria-label={label} onClick={onOpen}>
    <Face scene={run.scene}/><strong className="am-fold-name">{scenes[run.scene].name}</strong>
    {tools.size > 0 && <span className="am-tools">{tools.size > 4 && <span className="am-more">+{tools.size-4}</span>}
      {[...tools].slice(-4).map(([tool,t]) => <span key={tool} className="am-tool" data-tool={tool} data-active={t.active || undefined}>
        <ToolMark tool={tool}/><span className="am-tip"><strong>{t.title}</strong>{t.sub}</span>
      </span>)}</span>}
    <Swap value={status}><span className={`am-mini am-mini-${status}`}>{status === "waiting" || status === "failed" ? <><TriangleAlert size={12}/>{statusName[status]}</> : status === "finished" ? <><Check size={12}/>{Math.floor(run.elapsed/1000)}s</> : status === "idle" || status === "cancelled" ? statusName[status] : clock(run.elapsed)}</span></Swap>
  </button>;
}

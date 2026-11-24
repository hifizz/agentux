"use client";

import { useRef } from "react";
import { Check } from "lucide-react";
import { SpinnerIcon } from "../_shared/ui/icons";
import { PixelMark } from "../_trace-kit/pixel-mark";
import { Connections } from "./connections";
import { Details, Identity } from "./details";
import { FileMark, FolderMark, toolMarks } from "./marks";
import { assistant, files, request, tools, type Step } from "./run";
import "./workbench.css";

function Activity({ step, live, showLogo = false }: { step: Step; live: boolean; showLogo?: boolean }) {
  const Icon = step.target === "request" || step.target === "files" ? null : toolMarks[step.target];
  return <li className="wb-step" data-live={live}>
    <span className="wb-step-status" aria-hidden="true">{live ? <i /> : <Check size={12} strokeWidth={2.4} />}</span>
    <span className="wb-step-caption" title={step.text}><span className={live ? "wb-shimmer" : undefined}>{step.text}</span></span>
    {showLogo && Icon && <span className="wb-step-logo"><Icon /></span>}
  </li>;
}

export function AgentWorkbench({ history, done, panel, setPanel }: {
  history: readonly Step[]; done: boolean; panel: string | null; setPanel: (id: string | null) => void;
}) {
  const board = useRef<HTMLDivElement>(null);
  const current = done ? undefined : history.at(-1);
  const finished = done ? history : history.slice(0, -1);
  const phase = done ? "Done" : current ? "Working" : "Idle";
  const mark = <PixelMark pattern="010111101" color="var(--wb-accent)" busy={!!current} />;
  const select = (id: string) => ({ open: panel === id, onOpenChange: (open: boolean) => { if (open || panel === id) setPanel(open ? id : null); } });
  return <section className="wb-shell wb-skin" aria-label="Agent workbench">
    <div className="wb-board" ref={board}>
      <Connections board={board} active={current?.target} />
      <div className="wb-card wb-person" data-port="request">
        <div className="wb-person-head"><span className="wb-portrait" aria-hidden="true" /><b>{request.name}</b></div>
        <p className="wb-message"><span>{request.message}</span></p>
      </div>
      <div className="wb-card wb-agent" data-port="agent">
        <div className="wb-agent-head"><span className="wb-tile wb-agent-mark">{mark}</span><Identity name={assistant.name} subtitle={assistant.subtitle} />
          <span className="wb-state" data-done={done}>{done ? <Check size={12} /> : current ? <SpinnerIcon className="wb-spin" width={12} height={12} /> : null}{phase}</span>
        </div>
        <ol className="wb-log" aria-label="Recent activity" aria-live="polite">
          {history.length ? history.slice(-3).reverse().map(step => <Activity key={step.text} step={step} live={step === current} showLogo />) : <li className="wb-idle">Waiting for a request</li>}
        </ol>
        <Details {...select("agent")} name={assistant.name} subtitle={assistant.subtitle} icon={mark} facts={[
          ["Model", "Claude Sonnet 4.5"], ["Approval", "Before sending email"], ["Started", "9:12 AM"],
          ["Now", current?.text ?? (done ? "Finished" : "Waiting")], ["Steps", `${finished.length} done`],
          ["Tools used", `${tools.filter(tool => history.some(s => s.target === tool.id)).length} of ${tools.length}`],
        ]} />
      </div>
      <div className="wb-card wb-files" data-port="files">
        <div className="wb-files-head"><span className="wb-tile wb-folder"><FolderMark /></span><Identity name="Uploaded files" subtitle={`${files.length} files`} /></div>
        <ul>{files.map(file => <li key={file.name}>
          <Details {...select(file.name)} name={file.name} subtitle={file.meta} icon={<FileMark kind={file.kind} />} facts={file.facts}
            reading={current?.target === "files" && file.kind === "sheet"}
            row={<><span className="wb-file-mark"><FileMark kind={file.kind} /></span><span className="wb-file-name" title={file.name}>{file.name}</span><small>{file.meta}</small></>} />
        </li>)}</ul>
      </div>
      <ul className="wb-tools">{tools.map(tool => {
        const calls = history.filter(step => step.target === tool.id);
        const last = calls.at(-1), calling = current?.target === tool.id;
        const status = calling ? "Calling" : last ? "Used" : "Ready";
        const Icon = toolMarks[tool.id];
        const tag = <span className="wb-tag" data-status={status}>{status}</span>;
        return <li key={tool.id} className="wb-card wb-tool" data-port={tool.id}>
          <div className="wb-tool-head"><span className="wb-tile"><Icon /></span><Identity name={tool.name} subtitle={tool.scope} />{tag}</div>
          <p className="wb-last"><span className={calling ? "wb-shimmer" : undefined} title={calling ? current?.text : last?.result ?? tool.last}>{calling ? current?.text : last?.result ?? tool.last}</span>{!calling && <small>{last ? "Just now" : tool.when}</small>}</p>
          <Details {...select(tool.id)} name={tool.name} subtitle={tool.scope} icon={<Icon />} tag={tag} facts={tool.facts}>
            <div className="wb-calls"><small>This request</small>{calls.length ? <ul>{calls.map(step => <Activity key={step.text} step={step} live={current === step} />)}</ul> : <p>No calls yet</p>}</div>
          </Details>
        </li>;
      })}</ul>
    </div>
  </section>;
}

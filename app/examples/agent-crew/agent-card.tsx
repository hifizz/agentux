import { Popover } from "@base-ui/react/popover";
import { ArrowUp, Check, Clock3, CornerDownRight, Pause, TriangleAlert, X } from "lucide-react";
import { useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { AnthropicMark, GitHubMark, LinearMark, NotionMark, VercelMark } from "../_shared/ui/icons";
import { RunningRing } from "../agent-tree/marks";
import { PixelMark } from "../_trace-kit/pixel-mark";
import { actions, duration, price, statusNames, tokens, type Action, type Agent, type Last, type Status } from "./model";

const logos = { GitHub: GitHubMark, Linear: LinearMark, Notion: NotionMark, Vercel: VercelMark };

function Badge({ status, compact }: { status: Status; compact: boolean }) {
  const Icon = status === "done" ? Check : status === "waiting" ? Clock3 : status === "paused" ? Pause : TriangleAlert;
  return <span className="cc-badge" data-status={status} data-compact={compact} title={statusNames[status]}>
    {status === "active" ? <RunningRing /> : status === "idle" ? <i /> : <Icon size={12} aria-hidden="true" />}{!compact && statusNames[status]}
  </span>;
}

function Handoff({ last }: { last: Last }) {
  return <span className="cc-last" title={`${last.from}: ${last.text}`}><CornerDownRight size={11} aria-hidden="true" /><b>{last.from}</b><span>{last.text}</span></span>;
}

type Props = { agent: Agent; depth: number; now: number; tone: string; boundary: HTMLElement | null; open: boolean; tabStop: boolean; onFocus: () => void; onKey: (ev: KeyboardEvent<HTMLButtonElement>) => void; onOpen: (open: boolean) => void; onSteer: (action: Action, text?: string) => void; flash?: { at: number; side: string; delay: number } };

export function AgentCard({ agent: a, depth, now, tone, boundary, open, tabStop, onFocus, onKey, onOpen, onSteer, flash }: Props) {
  const [writing, setWriting] = useState(false);
  const [message, setMessage] = useState("");
  const messageButton = useRef<HTMLButtonElement>(null);
  const field = useRef<HTMLInputElement>(null);
  const compact = depth > 1, active = a.status === "active", used = tokens(a.percent / 100 * a.limit);
  const returning = useRef(false);
  useLayoutEffect(() => {
    if (writing) field.current?.focus();
    else if (returning.current) {
      messageButton.current?.focus();
      returning.current = false;
    }
  }, [writing]);
  const resetField = (restore = false) => { returning.current = restore; setWriting(false); setMessage(""); };
  return <Popover.Root open={open} onOpenChange={(next, event) => {
    if (!next && writing && event.reason === "escape-key") {
      event.cancel(); resetField(true); return;
    }
    if (!next) resetField();
    onOpen(next);
  }}>
    <Popover.Trigger type="button" role="treeitem" aria-level={depth + 1} aria-selected={open} className="cc-card" data-small={compact || undefined} data-status={a.status} style={{ "--cc-tone": tone } as CSSProperties}
      tabIndex={tabStop ? 0 : -1} onFocus={onFocus} onKeyDown={onKey} aria-label={`${a.name}: ${statusNames[a.status]}, ${a.activity}, context ${a.percent}%`}>
      {flash && <span key={flash.at} className="cc-wash" data-side={flash.side} style={{ animationDelay: `${flash.delay}ms` }} aria-hidden="true" />}
      <span className="cc-card-head"><span className="cc-avatar"><PixelMark pattern={a.mark} color="var(--cc-tone)" busy={active} /></span><span className="cc-who"><b title={a.name}>{a.name}</b>{!compact && <small>{a.model}</small>}</span><Badge status={a.status} compact={compact} /></span>
      <span className="cc-activity" title={a.activity}>{a.activity}</span>
      <span className="cc-context" data-pressure={a.percent >= 95 ? "red" : a.percent >= 80 ? "amber" : undefined}><span className="cc-meter"><i style={{ width: `${a.percent}%` }} /></span><span>{used} / {tokens(a.limit)}</span></span>
      {!compact && <span className="cc-footer"><span className="cc-tools" aria-hidden="true">{a.tools.map(name => { const Logo = logos[name]; return <span key={name} data-tool={name}><Logo /></span>; })}</span>{a.last && <Handoff last={a.last} />}</span>}
    </Popover.Trigger>
    <Popover.Portal><Popover.Positioner side="bottom" align="center" sideOffset={6} collisionBoundary={boundary ?? undefined} collisionPadding={2} className="cc-position cc-skin">
      <Popover.Popup className="cc-detail" aria-label={`${a.name} details`} initialFocus={false}>
        <div className="cc-detail-head"><strong>{a.name}</strong><Popover.Close className="cc-close" aria-label="Close details"><X size={13} /></Popover.Close></div>
        <p title={a.task}>{a.task}</p><div className="cc-chips"><span><AnthropicMark />{a.model}</span></div>
        <dl className="cc-usage">{a.started !== undefined && <div><dt>{active || a.status === "waiting" ? "Running" : "Time"}</dt><dd>{duration((a.ended ?? now) - a.started)}</dd></div>}<div><dt>Cost</dt><dd>{price(a)}</dd></div><div><dt>Tokens</dt><dd>{used}</dd></div></dl>
        {a.tools.length > 0 && <div className="cc-chips">{a.tools.map(name => { const Logo = logos[name]; return <span key={name} data-tool={name}><Logo />{name}</span>; })}</div>}
        {a.last && <Handoff last={a.last} />}
        {writing ? <form className="cc-actions" onSubmit={e => { e.preventDefault(); if (!message.trim()) return; onSteer("Message", message.trim()); resetField(true); }}>
          <input ref={field} aria-label={`Message to ${a.name}`} placeholder={`Tell ${a.name}…`} value={message} onChange={e => setMessage(e.target.value)} /><button className="cc-send" type="submit" aria-label="Send message" data-primary disabled={!message.trim()}><ArrowUp size={13} /></button>
        </form> : <div className="cc-actions">{actions[a.status].map(action => <button type="button" key={action} ref={action === "Message" ? messageButton : undefined} data-primary={action === "Approve" || action === "Resume" || action === "Retry" || undefined} onClick={() => {
          if (action !== "Message") { onSteer(action); return; }
          setWriting(true);
        }}>{action}</button>)}</div>}
      </Popover.Popup>
    </Popover.Positioner></Popover.Portal>
  </Popover.Root>;
}

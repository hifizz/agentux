import type { ReactNode } from "react";
import { AgentMark } from "./agent-mark";
import { useAgent } from "./agents-context";
import type { Recipient } from "./types";

export function RecipientName({ to }: { to: Recipient }) {
  const agent = useAgent(to);
  return (
    <span className="ls-quote__who">
      {agent && <AgentMark agent={agent} />}
      {agent ? agent.name : "Everyone"}
    </span>
  );
}

export function Quote({ to, text, trailing, onClick }: { to: Recipient; text?: string; trailing?: ReactNode; onClick?: () => void }) {
  return (
    <div className="ls-quote" data-only={text ? undefined : ""} data-clickable={onClick ? "" : undefined} onClick={onClick}>
      <span className="ls-quote__name">
        <span className="ls-quote__to">to</span>
        <RecipientName to={to} />
        {trailing}
      </span>
      {text && <span className="ls-quote__text">{text}</span>}
    </div>
  );
}

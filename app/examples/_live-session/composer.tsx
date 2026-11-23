"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { ArrowUp, AtSign, X } from "lucide-react";
import { AgentMark } from "./agent-mark";
import { Quote, RecipientName } from "./quote";
import type { Agent, Draft, Recipient } from "./types";

export type ComposerReply = { to: Recipient; quote: string };

export type ComposerProps = {
  agents: Agent[];
  reply: ComposerReply | null;
  onClearReply: () => void;
  onSend: (draft: Draft) => void;
};

const MENTION = /(^|\s)@([\w-]*)$/;

export function Composer({ agents, reply, onClearReply, onSend }: ComposerProps) {
  const field = useRef<HTMLTextAreaElement>(null);
  const [text, setText] = useState("");
  const [to, setTo] = useState<Recipient>("everyone");
  const [active, setActive] = useState(0);
  const [dismissed, setDismissed] = useState<string | null>(null);

  const query = MENTION.exec(text)?.[2];
  const options = query === undefined ? [] : agents.filter((agent) => agent.name.toLowerCase().startsWith(query.toLowerCase()));
  const menuOpen = options.length > 0 && dismissed !== text;
  const recipient = reply?.to ?? to;
  const canSend = text.trim().length > 0;

  const pick = (agent: Agent) => {
    setText((value) => value.replace(MENTION, "$1").trimEnd());
    setTo(agent.id);
    setActive(0);
    field.current?.focus();
  };

  const send = () => {
    if (!canSend) return;
    onSend({ to: recipient, text: text.trim(), quote: reply?.quote });
    setText("");
    setTo("everyone");
    onClearReply();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (menuOpen) {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        setActive((i) => (i + (event.key === "ArrowDown" ? 1 : options.length - 1)) % options.length);
        return;
      }
      if (event.key === "Enter" || event.key === "Tab") {
        event.preventDefault();
        pick(options[Math.min(active, options.length - 1)]);
        return;
      }
      if (event.key === "Escape") {
        event.preventDefault();
        setDismissed(text);
        return;
      }
    }
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      send();
    }
  };

  return (
    <div className="ls-composer">
      {menuOpen && (
        <ul className="ls-menu" role="listbox" aria-label="Agents">
          {options.map((agent, i) => (
            <li
              key={agent.id}
              role="option"
              aria-selected={i === active}
              className="ls-option"
              onMouseEnter={() => setActive(i)}
              onMouseDown={(event) => {
                event.preventDefault();
                pick(agent);
              }}
            >
              <AgentMark agent={agent} />
              <span dir="auto">{agent.name}</span>
              <span className="ls-option__model">{agent.model}</span>
            </li>
          ))}
        </ul>
      )}
      <div className="ls-write" onClick={() => field.current?.focus()}>
        {reply && (
          <Quote
            to={reply.to}
            text={reply.quote}
            trailing={
              <button type="button" className="ls-unreply" aria-label="Remove reply" onClick={onClearReply}>
                <X size={12} aria-hidden="true" />
              </button>
            }
          />
        )}
        <textarea
          ref={field}
          className="ls-field"
          rows={1}
          value={text}
          placeholder="Message the agents – @ to name one"
          aria-label="Message the agents"
          onChange={(event) => {
            setText(event.target.value);
            setActive(0);
          }}
          onKeyDown={onKeyDown}
        />
        <div className="ls-tools">
          <button
            type="button"
            className="ls-at-btn"
            aria-label="Mention an agent"
            onClick={() => {
              setText((value) => `${value}${value && !value.endsWith(" ") ? " " : ""}@`);
              field.current?.focus();
            }}
          >
            <AtSign size={14} aria-hidden="true" />
          </button>
          <span className="ls-for">
            to {recipient === "everyone" ? "everyone" : <span className="ls-for__who"><RecipientName to={recipient} /></span>}
          </span>
          <button type="button" className="ls-send" disabled={!canSend} aria-label="Send" onClick={send}>
            <ArrowUp size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}

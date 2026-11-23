import type { KeyboardEvent } from "react";
import { AgentMark } from "./agent-mark";
import { useAgent } from "./agents-context";
import { DetailsCard } from "./details-card";
import { FileChip } from "./file-chip";
import { Quote } from "./quote";
import { RichText } from "./rich-text";
import type { FileRef, Message, SystemNote } from "./types";

export type ChatMessageProps = {
  message: Message;
  selected: boolean;
  kept: boolean;
  fresh: boolean;
  onSelect: () => void;
  onOpenFile: (file: FileRef) => void;
  onReply: () => void;
};

export function ChatMessage({ message, selected, kept, fresh, onSelect, onOpenFile, onReply }: ChatMessageProps) {
  const from = useAgent(message.from);
  const typing = message.status === "typing";
  const you = Boolean(from?.you);
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.target !== event.currentTarget || (event.key !== "Enter" && event.key !== " ")) return;
    event.preventDefault();
    onSelect();
  };

  return (
    <div
      className="ls-msg"
      role="button"
      tabIndex={0}
      aria-expanded={selected}
      data-you={you ? "" : undefined}
      data-selected={selected ? "" : undefined}
      data-kept={kept ? "" : undefined}
      data-fresh={fresh ? "" : undefined}
      data-typing={typing ? "" : undefined}
      onClick={onSelect}
      onKeyDown={onKeyDown}
    >
      <span className="ls-msg__side">{from && !you && <AgentMark agent={from} busy={typing} />}</span>
      <div className="ls-msg__body">
        <div className="ls-msg__head">
          <span className="ls-msg__from">{from?.name}</span>
          {message.tag && <span className="ls-tag">{message.tag}</span>}
          {message.needsYou && !typing && <span className="ls-needs">Needs you</span>}
          {message.needsYou && !typing && (
            <button
              type="button"
              className="ls-reply"
              onClick={(event) => {
                event.stopPropagation();
                onReply();
              }}
            >
              Reply
            </button>
          )}
          <span className="ls-msg__at">{message.time}</span>
        </div>
        <Quote to={message.to} text={message.quote} />
        {typing ? (
          <p className="ls-shimmer" data-text="Writing…">Writing…</p>
        ) : (
          <>
            <p className="ls-msg__text"><RichText text={message.text} /></p>
            {message.files && (
              <div className="ls-files">
                {message.files.map((file) => (
                  <FileChip key={file.id} file={file} onOpen={file.preview ? onOpenFile : onSelect} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
      {message.details && !typing && <DetailsCard details={message.details} open={selected} />}
    </div>
  );
}

export function SystemLine({ note, kept }: { note: SystemNote; kept: boolean }) {
  const actor = useAgent(note.actor);
  const target = useAgent(note.target);
  return (
    <div className="ls-system" data-kept={kept ? "" : undefined} data-fresh="">
      <span className="ls-system__text">
        {actor?.name} {note.verb} <span className="ls-system__name">{target?.name}</span>
      </span>
    </div>
  );
}

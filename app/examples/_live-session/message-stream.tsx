"use client";

import { useRef, useState } from "react";
import { ArrowDown } from "lucide-react";
import { ChatMessage } from "./chat-message";
import { SystemLine } from "./chat-message";
import type { AgentId, FileRef, StreamItem } from "./types";

const NEAR_BOTTOM = 48;

const isKept = (item: StreamItem, picked: AgentId) =>
  item.kind === "system" ? item.actor === picked || item.target === picked : item.from === picked || item.to === picked;

export type MessageStreamProps = {
  items: StreamItem[];
  picked: AgentId | null;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onOpenFile: (file: FileRef) => void;
  onReply: (messageId: string) => void;
};

export function MessageStream({ items, picked, selectedId, onSelect, onOpenFile, onReply }: MessageStreamProps) {
  const scroller = useRef<HTMLDivElement>(null);
  const stuck = useRef(true);
  const [initial] = useState(() => new Set(items.map((item) => item.id)));
  const [seen, setSeen] = useState(items.length);
  const unread = Math.max(0, items.length - seen);

  const toBottom = (el: HTMLDivElement, smooth: boolean) => el.scrollTo({ top: el.scrollHeight, behavior: smooth ? "smooth" : "auto" });
  const settle = (el: HTMLDivElement | null) => {
    if (!el || !stuck.current) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    toBottom(el, !reduced);
  };

  return (
    <div className="ls-panel">
      <div
        ref={(el) => {
          scroller.current = el;
          settle(el);
        }}
        className="ls-scroll"
        onScroll={(event) => {
          const el = event.currentTarget;
          stuck.current = el.scrollHeight - el.scrollTop - el.clientHeight < NEAR_BOTTOM;
          if (stuck.current) setSeen(items.length);
        }}
      >
        <div className="ls-stream" data-picking={picked ? "" : undefined}>
          {items.map((item) =>
            item.kind === "system" ? (
              <SystemLine key={item.id} note={item} kept={picked ? isKept(item, picked) : true} />
            ) : (
              <ChatMessage
                key={item.id}
                message={item}
                selected={selectedId === item.id}
                kept={picked ? isKept(item, picked) : true}
                fresh={!initial.has(item.id)}
                onSelect={() => onSelect(selectedId === item.id ? null : item.id)}
                onOpenFile={onOpenFile}
                onReply={() => onReply(item.id)}
              />
            ),
          )}
        </div>
      </div>
      {unread > 0 && (
        <button
          type="button"
          className="ls-new"
          onClick={() => {
            stuck.current = true;
            if (scroller.current) toBottom(scroller.current, true);
            setSeen(items.length);
          }}
        >
          {unread} new <ArrowDown size={12} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

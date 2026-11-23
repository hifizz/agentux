"use client";

import { useState } from "react";
import { AgentTabs } from "./agent-tabs";
import { AgentsProvider } from "./agents-context";
import { Composer, type ComposerReply } from "./composer";
import { FilePreview } from "./file-preview";
import { MessageStream } from "./message-stream";
import type { Agent, AgentId, Draft, FileRef, StreamItem } from "./types";

export type AgentChatProps = {
  agents: Agent[];
  visible: AgentId[];
  items: StreamItem[];
  picked: AgentId | null;
  onPick: (id: AgentId | null) => void;
  onSend: (draft: Draft) => void;
};

export function AgentChat({ agents, visible, items, picked, onPick, onSend }: AgentChatProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [preview, setPreview] = useState<FileRef | null>(null);
  const [reply, setReply] = useState<ComposerReply | null>(null);
  const shown = agents.filter((agent) => visible.includes(agent.id));

  const startReply = (messageId: string) => {
    const message = items.find((item) => item.kind === "message" && item.id === messageId);
    if (message?.kind === "message") setReply({ to: message.from, quote: message.text.replace(/\{\w+\|([^}]+)\}/g, "$1") });
  };

  return (
    <AgentsProvider agents={agents}>
      <section className="ls-chat" aria-label="Agent conversation" data-picking={picked ? "" : undefined}>
        <div className="ls-top">
          <AgentTabs agents={shown} picked={picked} onPick={onPick} />
          <span className="ls-live"><span className="ls-pulse" />Live</span>
        </div>
        <MessageStream items={items} picked={picked} selectedId={selectedId} onSelect={setSelectedId} onOpenFile={setPreview} onReply={startReply} />
        <Composer agents={agents.filter((agent) => !agent.you && visible.includes(agent.id))} reply={reply} onClearReply={() => setReply(null)} onSend={onSend} />
        {preview && <FilePreview file={preview} onClose={() => setPreview(null)} />}
      </section>
    </AgentsProvider>
  );
}

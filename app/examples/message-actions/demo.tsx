"use client";

import { useState } from "react";
import { GitBranch, Pencil, Share2, Trash2, Volume2 } from "lucide-react";
import Stage from "@/components/examples/Stage";
import { feedbackActions, MessageActions, MetaDot, retryAction, useCopyAction, type Feedback } from "../_message/message-actions";
import { Message } from "../_message/message";

const REPLY = "The queue strip flickers because it unmounts between replies. Keep it mounted while busy is true and drain the queue in the tick that ends the reply.";

function Variant({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-2">
      <h3 className="text-ch-caption text-ch-ink-subtle">{label}</h3>
      {children}
    </section>
  );
}

export default function Demo() {
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [log, setLog] = useState("Try copy, feedback, regenerate and the more menu");
  const copy = useCopyAction(REPLY);
  const menu = [
    { id: "branch", label: "Branch from here", icon: <GitBranch />, onSelect: () => setLog("Branched into a new chat") },
    { id: "read", label: "Read aloud", icon: <Volume2 />, onSelect: () => setLog("Reading aloud") },
    { id: "share", label: "Share", icon: <Share2 />, onSelect: () => setLog("Share link copied") },
    { id: "delete", label: "Delete", icon: <Trash2 />, danger: true, separated: true, onSelect: () => setLog("Deleted") },
  ];
  const meta = (
    <>
      <span>Sonnet 4.5</span>
      <MetaDot />
      <span>1.2k tokens</span>
      <MetaDot />
      <span>4.1s</span>
    </>
  );
  return (
    <Stage status={log}>
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-6 py-8">
        <Variant label="Footer with feedback, retry, menu and meta">
          <Message
            role="assistant"
            footer={
              <MessageActions
                actions={[copy, ...feedbackActions(feedback, (v) => { setFeedback(v); setLog(v ? `Feedback: ${v}` : "Feedback cleared"); }), retryAction(() => setLog("Regenerating"))]}
                menu={menu}
                meta={meta}
              />
            }
          >
            <p className="text-ch-body leading-6 text-ch-ink">{REPLY}</p>
          </Message>
        </Variant>
        <Variant label="Shown on hover or focus">
          <Message role="assistant" footer={<MessageActions reveal="hover" actions={[copy, retryAction(() => setLog("Regenerating"))]} />}>
            <p className="text-ch-body leading-6 text-ch-ink">Hover this message to see its toolbar.</p>
          </Message>
        </Variant>
        <Variant label="User message actions">
          <Message
            role="user"
            footer={<MessageActions reveal="hover" actions={[copy, { id: "edit", label: "Edit", icon: <Pencil />, onSelect: () => setLog("Editing the prompt") }]} />}
          >
            Why does the queue strip flicker?
          </Message>
        </Variant>
      </div>
    </Stage>
  );
}

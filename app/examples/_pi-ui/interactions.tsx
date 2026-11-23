"use client";

import { useState } from "react";
import { MessageCircleQuestion, ShieldQuestion } from "lucide-react";
import type { PiAnswer, PiApprovalRequest, PiInteraction } from "@/app/examples/_shared/pi/wire";
import { Button } from "@/app/examples/_shared/ui/button";
import { DiffView } from "@/app/examples/_shared/ui/diff-view";
import type { DiffLine } from "@/app/examples/_shared/ui/diff";
import { Tag } from "@/app/examples/_shared/ui/tag";
import { CodeLines, isCode } from "./tools/code-lines";
import { bashInput, editInput, writeInput } from "./tools/decode";
import { FilePath } from "./tools/file-path";

type Respond = (id: string, answer: PiAnswer) => Promise<void>;

function useRespond(id: string, respond: Respond) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();
  const send = async (answer: PiAnswer) => {
    setBusy(true);
    setError(undefined);
    try {
      await respond(id, answer);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setBusy(false);
    }
  };
  return { busy, error, send };
}

function Card({ icon: Icon, title, who, children }: { icon: typeof ShieldQuestion; title: React.ReactNode; who: string | undefined; children: React.ReactNode }) {
  return (
    <div role="group" aria-label={typeof title === "string" ? title : "Waiting for you"} className="flex flex-col gap-2.5 rounded-ch-card border border-ch-line bg-ch-surface p-3 shadow-ch-bar">
      <div className="flex items-center gap-2">
        <Icon aria-hidden className="size-4 shrink-0 text-ch-ink-muted" />
        <span className="min-w-0 flex-1 truncate text-ch-body font-medium text-ch-ink">{title}</span>
        {who && <Tag tone="design">{who}</Tag>}
      </div>
      {children}
    </div>
  );
}

function ApprovalPreview({ tool, args }: { tool: string; args: PiApprovalRequest["arguments"] }) {
  const bash = tool === "bash" ? bashInput(args) : undefined;
  if (bash) {
    return (
      <pre className="ch-mono max-h-40 overflow-auto rounded-ch-field border border-ch-line-soft bg-ch-sunken p-2.5 text-ch-caption leading-5 break-words whitespace-pre-wrap text-ch-ink">
        <span className="text-ch-ink-subtle">$ </span>
        {bash.command}
      </pre>
    );
  }
  const write = tool === "write" ? writeInput(args) : undefined;
  if (write) {
    return (
      <div className="flex flex-col gap-1.5">
        <span className="text-ch-caption">
          <FilePath path={write.path} />
        </span>
        <CodeLines text={write.content} start={1} code={isCode(write.path)} />
      </div>
    );
  }
  const edit = tool === "edit" ? editInput(args) : undefined;
  if (edit) {
    const lines: DiffLine[] = edit.edits.flatMap((e) => [
      ...e.oldText.split("\n").map((text): DiffLine => ({ kind: "del", text })),
      ...e.newText.split("\n").map((text): DiffLine => ({ kind: "add", text })),
    ]);
    return (
      <div className="flex flex-col gap-1.5">
        <span className="text-ch-caption">
          <FilePath path={edit.path} />
        </span>
        <div className="max-h-48 overflow-auto rounded-ch-badge border border-ch-line-soft bg-ch-surface">
          <DiffView lines={lines} wrap={false} />
        </div>
      </div>
    );
  }
  return <pre className="ch-mono max-h-40 overflow-auto rounded-ch-field border border-ch-line-soft bg-ch-sunken p-2.5 text-ch-caption leading-5 break-words whitespace-pre-wrap text-ch-ink">{JSON.stringify(args, null, 2)}</pre>;
}

function ApprovalCard({ item, who, respond }: { item: PiInteraction; who: string | undefined; respond: Respond }) {
  const { busy, error, send } = useRespond(item.id, respond);
  if (item.request.kind !== "approval") return null;
  const { tool, arguments: args } = item.request;
  return (
    <Card icon={ShieldQuestion} title={`Allow ${tool}?`} who={who}>
      <ApprovalPreview tool={tool} args={args} />
      {error && (
        <p role="alert" className="text-ch-caption text-ch-diff-del-ink">
          {error}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-1.5">
        <Button variant="ghost" disabled={busy} onClick={() => void send({ kind: "approval", allow: true, always: true })} title="Skip this question for every later call of this tool, until the server restarts">
          Always allow {tool}
        </Button>
        <div className="ml-auto flex items-center gap-1.5">
          <Button variant="secondary" disabled={busy} onClick={() => void send({ kind: "approval", allow: false, always: false })}>
            Deny
          </Button>
          <Button variant="primary" disabled={busy} onClick={() => void send({ kind: "approval", allow: true, always: false })}>
            Allow
          </Button>
        </div>
      </div>
    </Card>
  );
}

function QuestionCard({ item, who, respond }: { item: PiInteraction; who: string | undefined; respond: Respond }) {
  const { busy, error, send } = useRespond(item.id, respond);
  const [text, setText] = useState("");
  if (item.request.kind !== "question") return null;
  const { question, options } = item.request;
  return (
    <Card icon={MessageCircleQuestion} title={question} who={who}>
      {options.length > 0 ? (
        <div className="flex flex-wrap justify-end gap-1.5">
          {options.map((option) => (
            <Button key={option} variant="secondary" disabled={busy} onClick={() => void send({ kind: "question", text: option })}>
              {option}
            </Button>
          ))}
        </div>
      ) : (
        <form
          className="flex items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (text.trim()) void send({ kind: "question", text: text.trim() });
          }}
        >
          <textarea
            aria-label="Your answer"
            value={text}
            rows={1}
            placeholder="Your answer"
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault();
                e.currentTarget.form?.requestSubmit();
              }
            }}
            className="ch-focus max-h-32 min-h-8 min-w-0 flex-1 resize-none rounded-ch-field border border-ch-line bg-ch-page px-2.5 py-1.5 text-ch-body text-ch-ink [field-sizing:content] outline-none placeholder:text-ch-ink-subtle"
          />
          <Button type="submit" variant="primary" disabled={busy || !text.trim()}>
            Answer
          </Button>
        </form>
      )}
      {error && (
        <p role="alert" className="text-ch-caption text-ch-diff-del-ink">
          {error}
        </p>
      )}
    </Card>
  );
}

export function InteractionStack({ interactions, whoOf, respond }: { interactions: readonly PiInteraction[]; whoOf: (conversationId: number) => string | undefined; respond: Respond }) {
  if (interactions.length === 0) return null;
  return (
    <ul aria-label="Waiting for you" className="flex flex-col gap-2 pb-2">
      {interactions.map((item) => (
        <li key={item.id} className="ch-anim-fade-in">
          {item.request.kind === "approval" ? <ApprovalCard item={item} who={whoOf(item.conversationId)} respond={respond} /> : <QuestionCard item={item} who={whoOf(item.conversationId)} respond={respond} />}
        </li>
      ))}
    </ul>
  );
}

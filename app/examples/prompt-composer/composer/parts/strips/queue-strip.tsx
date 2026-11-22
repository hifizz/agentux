"use client";

import { useState } from "react";
import { Check, CornerDownRight, Pencil } from "lucide-react";
import { CloseIcon } from "@/app/examples/_shared/ui/icons";
import { Button } from "@/app/examples/_shared/ui/button";
import { Tooltip } from "@/app/examples/_shared/ui/tooltip";
import type { QueuedMessage, QueueStrip } from "../../types";
import { QueueIcon } from "../icons";
import { StripRow } from "./strip-row";

export type QueueStripViewProps = { strip: QueueStrip };

function Action({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Tooltip label={label}>
      <Button variant="icon" aria-label={label} onClick={onClick} className="size-5">
        {children}
      </Button>
    </Tooltip>
  );
}

function QueueItem({ message, strip }: { message: QueuedMessage; strip: QueueStrip }) {
  const [draft, setDraft] = useState<string | null>(null);
  const steer = message.mode === "steer";
  const save = () => {
    const text = draft?.trim();
    if (text && text !== message.text) strip.onEdit?.(message.id, text);
    setDraft(null);
  };
  return (
    <li className="group/item flex h-5 items-center gap-1.5">
      {steer && (
        <span className="flex shrink-0 items-center gap-0.5 rounded-ch-badge border border-ch-line px-1 text-ch-micro text-ch-ink-muted">
          <CornerDownRight aria-hidden className="size-2.5" />
          steer
        </span>
      )}
      {draft === null ? (
        <span className="min-w-0 flex-1 truncate text-ch-ink-muted">{message.text}</span>
      ) : (
        <input
          autoFocus
          aria-label="Edit queued message"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={save}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.nativeEvent.isComposing) save();
            if (e.key === "Escape") setDraft(null);
          }}
          className="min-w-0 flex-1 rounded-ch-badge bg-ch-surface px-1 text-ch-ink shadow-[0_0_0_1px_var(--ch-line)] outline-none"
        />
      )}
      <span className="flex shrink-0 items-center gap-0.5">
        {draft !== null ? (
          <Action label="Save" onClick={save}>
            <Check className="size-3" />
          </Action>
        ) : (
          strip.onEdit && (
            <Action label="Edit" onClick={() => setDraft(message.text)}>
              <Pencil className="size-3" />
            </Action>
          )
        )}
        {!steer && strip.onSteer && (
          <Action label="Steer into the current run" onClick={() => strip.onSteer?.(message.id)}>
            <CornerDownRight className="size-3" />
          </Action>
        )}
        <Action label="Remove from queue" onClick={() => strip.onRemove(message.id)}>
          <CloseIcon className="size-3" />
        </Action>
      </span>
    </li>
  );
}

export function QueueStripView({ strip }: QueueStripViewProps) {
  return (
    <StripRow icon={<QueueIcon className="size-3.5" />}>
      <ul aria-label="Queued messages" className="flex flex-col">
        {strip.messages.map((m) => (
          <QueueItem key={m.id} message={m} strip={strip} />
        ))}
      </ul>
    </StripRow>
  );
}

"use client";

import { FileText, Image as ImageIcon, RotateCcw, TriangleAlert } from "lucide-react";
import { cx } from "@/app/examples/_shared/ui/cx";
import { Button } from "@/app/examples/_shared/ui/button";
import "./message.css";

export type MessageRole = "user" | "assistant" | "system";

export type MessageProps = {
  role: MessageRole;
  name?: string;
  avatar?: React.ReactNode;
  time?: string;
  attachments?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
};

export function Message({ role, name, avatar, time, attachments, footer, className, children }: MessageProps) {
  if (role === "system") {
    return (
      <div role="note" className={cx("flex items-center gap-3 text-ch-caption text-ch-ink-subtle", className)}>
        <span className="h-px flex-1 bg-ch-line-soft" />
        {children}
        <span className="h-px flex-1 bg-ch-line-soft" />
      </div>
    );
  }
  if (role === "user") {
    return (
      <div className={cx("group/message flex flex-col items-end gap-1.5", className)}>
        {attachments}
        <div className="max-w-[85%] rounded-ch-card bg-ch-sunken px-3 py-2 text-ch-body leading-6 break-words whitespace-pre-wrap text-ch-ink">{children}</div>
        {footer}
      </div>
    );
  }
  return (
    <article className={cx("group/message flex min-w-0 flex-col gap-1", className)}>
      {(name || avatar) && (
        <header className="flex h-6 items-center gap-2">
          {avatar}
          {name && <span className="text-ch-body font-medium text-ch-ink">{name}</span>}
          {time && <time className="text-ch-caption text-ch-ink-subtle">{time}</time>}
        </header>
      )}
      <div className="flex min-w-0 flex-col gap-1">{children}</div>
      {footer}
    </article>
  );
}

export function MessageAvatar({ label, className }: { label: string; className?: string }) {
  return <span className={cx("grid size-5 place-items-center rounded-full bg-ch-ink text-[10px] font-semibold text-ch-surface uppercase", className)}>{label[0]}</span>;
}

export type MessageFile = { name: string; size?: string; kind?: "image" | "file" };

export function MessageAttachments({ files }: { files: readonly MessageFile[] }) {
  return (
    <ul className="flex flex-wrap justify-end gap-1.5">
      {files.map((f) => (
        <li key={f.name} className="flex h-9 max-w-56 items-center gap-2 rounded-ch-field border border-ch-line bg-ch-surface pr-3 pl-1.5">
          <span className="grid size-6 place-items-center rounded-ch-badge bg-ch-sunken text-ch-ink-muted">
            {f.kind === "image" ? <ImageIcon className="size-3.5" /> : <FileText className="size-3.5" />}
          </span>
          <span className="flex min-w-0 flex-col leading-tight">
            <span className="truncate text-ch-caption text-ch-ink">{f.name}</span>
            {f.size && <span className="text-ch-micro text-ch-ink-subtle">{f.size}</span>}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function MessageError({ title, detail, onRetry }: { title: string; detail?: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="flex items-start gap-2 rounded-ch-field border border-ch-line bg-ch-sunken px-3 py-2">
      <TriangleAlert className="mt-0.5 size-3.5 shrink-0 text-ch-diff-del-ink" />
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="text-ch-body text-ch-ink">{title}</span>
        {detail && <span className="text-ch-caption leading-5 text-ch-ink-muted">{detail}</span>}
      </div>
      {onRetry && (
        <Button onClick={onRetry} className="shrink-0 gap-1 [&_svg]:size-3">
          <RotateCcw />
          Retry
        </Button>
      )}
    </div>
  );
}

export function StreamingCaret() {
  return <span aria-hidden className="tf-caret" />;
}

export function TypingDots({ label = "Working" }: { label?: string }) {
  return (
    <span role="status" className="flex h-7 items-center gap-2 text-ch-caption text-ch-ink-subtle">
      <span className="flex gap-0.5">
        {[0, 1, 2].map((i) => (
          <span key={i} className="tf-pulse size-1 rounded-full bg-ch-ink-muted" style={{ animationDelay: `${i * 150}ms` }} />
        ))}
      </span>
      {label}
    </span>
  );
}

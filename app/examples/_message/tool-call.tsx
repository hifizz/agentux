"use client";

import { useState } from "react";
import { Check, Copy, LoaderCircle, TriangleAlert, Wrench } from "lucide-react";
import { cx } from "@/app/examples/_shared/ui/cx";
import { Button } from "@/app/examples/_shared/ui/button";
import { Tooltip } from "@/app/examples/_shared/ui/tooltip";
import { useCopy } from "@/app/examples/_shared/ui/use-copy";
import { Collapse } from "./collapse";
import { DisclosureRow } from "./disclosure-row";

export type ToolStatus = "pending" | "running" | "done" | "error";

export type ToolCallProps = {
  name: string;
  status: ToolStatus;
  verb?: { active: string; done: string };
  summary?: React.ReactNode;
  icon?: React.ReactNode;
  duration?: number;
  defaultOpen?: boolean;
  children?: React.ReactNode;
};

const STATUS_LABEL: Record<ToolStatus, string> = { pending: "Waiting", running: "Running", done: "Done", error: "Failed" };

export function ToolStatusIcon({ status }: { status: ToolStatus }) {
  if (status === "running") return <LoaderCircle aria-label="Running" className="size-3.5 shrink-0 animate-spin text-ch-ink-subtle motion-reduce:animate-none" />;
  if (status === "error") return <TriangleAlert aria-label="Failed" className="size-3.5 shrink-0 text-ch-diff-del-ink" />;
  if (status === "pending") return <span aria-label="Waiting" className="tf-pulse size-1.5 shrink-0 rounded-full bg-ch-ink-subtle" />;
  return null;
}

export function ToolCall({ name, status, verb, summary, icon = <Wrench />, duration, defaultOpen = false, children }: ToolCallProps) {
  const [open, setOpen] = useState(defaultOpen);
  const active = status === "pending" || status === "running";
  const label = verb ? (active ? verb.active : verb.done) : name;
  const end = (
    <>
      {duration !== undefined && !active && <span className="shrink-0 text-ch-caption text-ch-ink-subtle tabular-nums">{duration < 1 ? `${Math.round(duration * 1000)}ms` : `${duration.toFixed(1)}s`}</span>}
      <ToolStatusIcon status={status} />
    </>
  );
  return (
    <div data-status={status} className="flex flex-col">
      <DisclosureRow
        icon={icon}
        label={label}
        detail={summary}
        end={end}
        shimmer={status === "running"}
        open={open}
        onToggle={children ? () => setOpen((o) => !o) : undefined}
        className={cx(status === "error" && "[&_svg:first-child]:text-ch-diff-del-ink")}
      />
      {children && (
        <Collapse open={open} className="mt-1 mb-2 flex flex-col gap-2 overflow-hidden rounded-ch-field border border-ch-line-soft bg-ch-sunken p-2">
          <span className="sr-only">{STATUS_LABEL[status]}</span>
          {children}
        </Collapse>
      )}
    </div>
  );
}

export function ToolSection({ label, action, children }: { label: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="flex min-w-0 flex-col gap-1">
      <header className="flex h-5 items-center justify-between gap-2">
        <span className="text-ch-micro font-medium tracking-wide text-ch-ink-subtle uppercase">{label}</span>
        {action}
      </header>
      {children}
    </section>
  );
}

export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, copy] = useCopy(text);
  return (
    <Tooltip label={copied ? "Copied" : label}>
      <Button variant="icon" aria-label={label} onClick={copy} className="size-5 [&_svg]:size-3">
        {copied ? <Check /> : <Copy />}
      </Button>
    </Tooltip>
  );
}

export function ToolCode({ children, maxHeight = 240, tone = "default" }: { children: string; maxHeight?: number; tone?: "default" | "error" }) {
  return (
    <pre
      style={{ maxHeight }}
      className={cx(
        "ch-mono overflow-auto rounded-ch-badge bg-ch-surface px-2 py-1.5 text-ch-caption leading-5 break-words whitespace-pre-wrap",
        tone === "error" ? "text-ch-diff-del-ink" : "text-ch-ink-muted",
      )}
    >
      {children}
    </pre>
  );
}

export function ToolInput({ value }: { value: unknown }) {
  const text = typeof value === "string" ? value : JSON.stringify(value, null, 2);
  return (
    <ToolSection label="Input" action={<CopyButton text={text} label="Copy input" />}>
      <ToolCode>{text}</ToolCode>
    </ToolSection>
  );
}

export function ToolOutput({ value, error }: { value: string; error?: boolean }) {
  return (
    <ToolSection label={error ? "Error" : "Output"} action={<CopyButton text={value} label="Copy output" />}>
      <ToolCode tone={error ? "error" : "default"}>{value}</ToolCode>
    </ToolSection>
  );
}

export function ToolTerminal({ command, output, exitCode, running }: { command: string; output?: string; exitCode?: number; running?: boolean }) {
  return (
    <ToolSection
      label="Terminal"
      action={
        <span className="flex items-center gap-1">
          {exitCode !== undefined && (
            <span className={cx("ch-mono text-ch-micro", exitCode === 0 ? "text-ch-ink-subtle" : "text-ch-diff-del-ink")}>exit {exitCode}</span>
          )}
          <CopyButton text={command} label="Copy command" />
        </span>
      }
    >
      <div className="ch-mono flex flex-col gap-1 rounded-ch-badge bg-ch-surface px-2 py-1.5 text-ch-caption leading-5">
        <span className="text-ch-ink">
          <span className="text-ch-ink-subtle select-none">$ </span>
          {command}
        </span>
        {output && <span className="break-words whitespace-pre-wrap text-ch-ink-muted">{output}</span>}
        {running && <span className="tf-caret text-ch-ink-subtle" />}
      </div>
    </ToolSection>
  );
}

export function ToolGroup({ label, children, defaultOpen = true }: { label: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="flex flex-col">
      <DisclosureRow label={label} open={open} onToggle={() => setOpen((o) => !o)} />
      <Collapse open={open} className="ml-[7px] flex flex-col border-l border-ch-line pl-[15px]">
        {children}
      </Collapse>
    </div>
  );
}

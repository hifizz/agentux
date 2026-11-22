"use client";

import { useEffect, useRef, useState } from "react";
import { Brain } from "lucide-react";
import { Collapse } from "./collapse";
import { DisclosureRow } from "./disclosure-row";
import { Markdown } from "./markdown";

export type ThinkingProps = {
  children?: string;
  streaming: boolean;
  seconds?: number;
  redacted?: boolean;
  autoClose?: boolean;
  defaultOpen?: boolean;
  icon?: React.ReactNode;
  labels?: { active?: string; done?: (seconds?: number) => string };
};

const AUTO_CLOSE_MS = 1000;
const doneLabel = (s?: number) => (s === undefined ? "Thought" : `Thought for ${s} ${s === 1 ? "second" : "seconds"}`);

export function Thinking({ children = "", streaming, seconds, redacted, autoClose = true, defaultOpen, icon = <Brain />, labels }: ThinkingProps) {
  const [open, setOpen] = useState(defaultOpen ?? streaming);
  const [measured, setMeasured] = useState<number>();
  const started = useRef<number | null>(null);

  useEffect(() => {
    if (streaming) {
      started.current = Date.now();
      const t = setTimeout(() => setOpen(true), 0);
      return () => clearTimeout(t);
    }
    if (started.current === null) return;
    const elapsed = Math.max(1, Math.round((Date.now() - started.current) / 1000));
    started.current = null;
    const t1 = setTimeout(() => setMeasured(elapsed), 0);
    const t2 = autoClose ? setTimeout(() => setOpen(false), AUTO_CLOSE_MS) : undefined;
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [streaming, autoClose]);

  if (redacted) return <DisclosureRow icon={icon} label="Reasoning hidden by the provider" />;
  const label = streaming ? (labels?.active ?? "Thinking") : (labels?.done ?? doneLabel)(seconds ?? measured);
  return (
    <div className="flex flex-col">
      <DisclosureRow icon={icon} label={label} shimmer={streaming} open={open} onToggle={() => setOpen((o) => !o)} />
      <Collapse open={open} className="mt-1 mb-1 ml-[7px] border-l border-ch-line pl-[15px]">
        <Markdown size="small" streaming={streaming} className="[--md-color-text:var(--ch-ink-muted)]">
          {children}
        </Markdown>
      </Collapse>
    </div>
  );
}

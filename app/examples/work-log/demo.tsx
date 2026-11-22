"use client";

import { useMemo, useState } from "react";
import Stage from "@/components/examples/Stage";
import { useSteps } from "@/components/examples/use-script";
import { WorkLog, type WorkLogVariant, type WorkStep } from "../_message/work-log";

const SCRIPT: WorkStep[] = [
  { id: "1", kind: "read", file: "components.ts", range: "6-40" },
  { id: "2", kind: "search", scope: "components.ts", pattern: "export const reasoning" },
  { id: "3", kind: "search", scope: "tokens.css", pattern: "ch-anim-shimmer" },
  { id: "4", kind: "list", path: "words/dist" },
  { id: "5", kind: "run", command: "grep -o 'data-markdown=\"[a-z0-9]*\"' -r node_modules/@pierre/words/dist | sort -u", output: 'data-markdown="h1"\ndata-markdown="h2"\ndata-markdown="li"\ndata-markdown="root"' },
  { id: "6", kind: "think", seconds: 42, text: "The shimmer token already exists, so the header can reuse it.\nRows should truncate on one line and only open when they have a body." },
  { id: "7", kind: "search", scope: "menu.tsx, popover.tsx", pattern: "^export function" },
  { id: "8", kind: "run", command: 'grep -n "variant" -A3 components/ui/base/*.tsx | head -40' },
  { id: "9", kind: "search", scope: "ai-message-bubble.css", pattern: "^\\.ai-message" },
  { id: "10", kind: "search", scope: "tooltip.tsx", pattern: "export function Tooltip" },
  { id: "11", kind: "note", label: "Injected rules", detail: "(3)", body: <ul className="list-disc pl-4 text-ch-caption leading-5 text-ch-ink-muted"><li>AGENTS.md</li><li>CONVENTIONS.md</li><li>Comments</li></ul> },
  { id: "12", kind: "think", seconds: 6, text: "Group consecutive searches so long runs stay short." },
  { id: "13", kind: "read", file: "queue-strip.tsx", range: "1-12" },
  { id: "14", kind: "edit", file: "work-log.tsx", added: 286 },
  { id: "15", kind: "web", query: "css mask-image fade scroll container" },
  { id: "16", kind: "edit", file: "components.ts", added: 24, removed: 2 },
  { id: "17", kind: "run", command: "npm run lint && npm run typecheck", output: "✓ no problems\n✓ types ok" },
];
const DELAYS = SCRIPT.map((s) => (s.kind === "think" ? 1600 : s.kind === "run" ? 1100 : 650));

const VARIANTS: { id: WorkLogVariant; label: string }[] = [
  { id: "rail", label: "Rail" },
  { id: "timeline", label: "Timeline" },
  { id: "ticker", label: "Ticker" },
];

function diff(steps: WorkStep[]) {
  return steps.reduce((acc, s) => (s.kind === "edit" ? { added: acc.added + (s.added ?? 0), removed: acc.removed + (s.removed ?? 0) } : acc), { added: 0, removed: 0 });
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-1">
      <h3 className="text-ch-caption text-ch-ink-subtle">{label}</h3>
      {children}
    </section>
  );
}

function Live({ variant, group }: { variant: WorkLogVariant; group: boolean }) {
  const shown = useSteps(DELAYS);
  const steps = useMemo(() => SCRIPT.slice(0, Math.max(1, shown)), [shown]);
  const done = shown >= SCRIPT.length;
  return <WorkLog steps={steps} status={done ? "done" : "working"} seconds={done ? 810 : undefined} variant={variant} group={group} maxHeight={300} {...diff(steps)} />;
}

export default function Demo() {
  const [run, setRun] = useState(0);
  const [variant, setVariant] = useState<WorkLogVariant>("rail");
  const [group, setGroup] = useState(false);
  const total = diff(SCRIPT);
  return (
    <Stage
      status="Steps stream in while the agent works"
      onReplay={() => setRun((r) => r + 1)}
      actions={[...VARIANTS.map((v) => ({ label: v.label, pressed: variant === v.id, onClick: () => setVariant(v.id) })), { label: "Group", pressed: group, onClick: () => setGroup((g) => !g) }]}
    >
      <div key={variant} className="flex flex-col gap-6">
        <Section label="Live">
          <Live key={`${run}-${variant}`} variant={variant} group={group} />
        </Section>
        <Section label="From history, folded">
          <WorkLog steps={SCRIPT} status="done" seconds={810} variant={variant} group={group} defaultOpen={false} {...total} />
        </Section>
        <Section label="Stopped by the user">
          <WorkLog steps={SCRIPT.slice(0, 5)} status="stopped" seconds={48} variant={variant} group={group} defaultOpen={false} />
        </Section>
        <Section label="Failed">
          <WorkLog
            steps={[...SCRIPT.slice(0, 2), { id: "x", kind: "run", command: "npm test", output: "✗ queue drains in order\n  expected 2, received 3" }]}
            status="failed"
            seconds={21}
            variant={variant}
            group={group}
          />
        </Section>
      </div>
    </Stage>
  );
}

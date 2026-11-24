"use client";

import { useCallback } from "react";
import Stage from "@/components/examples/Stage";
import { RunningNow } from "../_running-now/running-now";
import type { NowTask } from "../_running-now/types";
import { useNowScript } from "../_running-now/use-now-script";

const TASKS = (): NowTask[] => [
  { id: "release", title: "Release notes", state: "running", step: "Grouping merged PRs", done: 2, total: 4 },
  { id: "payout", title: "Payout review", state: "needs-you", step: "Approve the March payout batch", done: 1, total: 3 },
  { id: "digest", title: "Metrics digest", state: "running", step: "Pulling last week's numbers", done: 1, total: 5 },
  { id: "migrate", title: "Schema migration", state: "paused", step: "Backfilling account rows", done: 1, total: 4 },
  { id: "triage", title: "Ticket triage", state: "running", step: "Loading 380 tickets", done: 0, total: 6 },
];

const RESUME_STEP: Record<string, string> = {
  payout: "Posting the approved batch",
  triage: "Applying the routing",
};

function BrandMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <rect width="16" height="16" rx="4" fill="currentColor" />
      <path d="M8 3.4 9.1 6.9 12.6 8 9.1 9.1 8 12.6 6.9 9.1 3.4 8 6.9 6.9Z" fill="var(--color-card)" />
    </svg>
  );
}

export default function Demo() {
  const { tasks, resolve, replay } = useNowScript(TASKS);
  const open = useCallback(
    (id: string) => {
      const task = tasks.find((t) => t.id === id);
      if (task?.state === "needs-you") resolve(id, "running", { step: RESUME_STEP[id] ?? "Resuming" });
    },
    [tasks, resolve],
  );
  return (
    <Stage status="Background work keeps ticking in the pill. Open it, pause a task, or clear the one waiting on you." onReplay={replay}>
      <div className="mx-auto flex w-full max-w-[720px] flex-col">
        <div className="flex h-12 items-center justify-between gap-3 rounded-[12px] bg-card px-2.5 pl-3.5 shadow-sm ring-1 ring-foreground/[0.06] dark:ring-white/10">
          <span className="flex min-w-0 items-center gap-2 text-foreground">
            <BrandMark />
            <span className="truncate text-[13px] text-ch-ink-muted">
              Atlas <span className="text-ch-ink-subtle">/</span> <span className="font-medium text-ch-ink">Agents</span>
            </span>
          </span>
          <RunningNow tasks={tasks} defaultOpen onPause={(id) => resolve(id, "paused")} onResume={(id) => resolve(id, "running")} onOpen={open} onOpenAll={() => {}} />
        </div>
        <div className="h-[340px]" aria-hidden="true" />
      </div>
    </Stage>
  );
}

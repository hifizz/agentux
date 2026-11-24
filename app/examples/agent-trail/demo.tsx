"use client";

import { useCallback, useEffect, useRef } from "react";
import Stage from "@/components/examples/Stage";
import { AgentTrail } from "../_agent-trail/agent-trail";
import type { TrailStep } from "../_agent-trail/types";
import { useTrailScript } from "../_agent-trail/use-trail-script";
import { AnthropicMark, GitHubMark, LinearMark, NotionMark, VercelMark } from "../_shared/ui/icons";

const STEPS = (now: number): TrailStep[] => [
  { id: "triage", title: "Triage the bug report", state: "done", duration: 8000, tool: { name: "Linear", logo: <LinearMark /> } },
  { id: "repro", title: "Reproduce the crash", state: "done", duration: 34000, tool: { name: "Vercel", logo: <VercelMark /> } },
  {
    id: "patch",
    title: "Patch the checkout page",
    state: "running",
    status: "Editing",
    startedAt: now - 23000,
    tool: { name: "GitHub", logo: <GitHubMark /> },
    substeps: [
      { title: "Pinned down the empty-cart case", detail: "cart.ts:142", state: "done" },
      { title: "Guarded the empty branch, added 2 tests", detail: "cart.test.ts", state: "running" },
    ],
  },
  { id: "notes", title: "Write the release note", state: "pending", tool: { name: "Notion", logo: <NotionMark /> } },
  {
    id: "pr",
    title: "Open a pull request",
    state: "pending",
    gate: true,
    ask: 'Open PR #486 "Fix empty-cart crash" against main – 4 files, 212 tests passing',
    tool: { name: "GitHub", logo: <GitHubMark /> },
  },
];

export default function Demo() {
  const { steps, run, resolve, replay } = useTrailScript(STEPS);
  const settle = useRef<number>(0);
  useEffect(() => {
    window.clearTimeout(settle.current);
    return () => window.clearTimeout(settle.current);
  }, [run]);
  const approve = useCallback(() => {
    resolve("pr", "running", { status: "Opening" });
    settle.current = window.setTimeout(() => resolve("pr", "done", { duration: 6000 }), 3500);
  }, [resolve]);
  const decline = useCallback(() => resolve("pr", "declined"), [resolve]);
  return (
    <Stage status="Watch the run, then approve the pull request when it pauses for you." onReplay={replay}>
      <div className="mx-auto w-full max-w-[380px]">
        <AgentTrail title="Fix the empty-cart crash" agent={{ name: "Coder", logo: <AnthropicMark /> }} steps={steps} onApprove={approve} onDecline={decline} />
      </div>
    </Stage>
  );
}

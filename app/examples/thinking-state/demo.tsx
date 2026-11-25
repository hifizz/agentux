"use client";

import { useState } from "react";
import Stage from "@/components/examples/Stage";
import { ThinkingState } from "../_thinking-state/thinking-state";
import type { ThinkingStep } from "../_thinking-state/types";
import { useThinkingScript } from "../_thinking-state/use-thinking-script";
import { FigmaMark, GitHubMark, GitLabMark, LinearMark, NotionMark, SlackMark, VercelMark } from "../_shared/ui/icons";

const STEPS: ThinkingStep[] = [
  {
    kind: "search",
    label: "Searched",
    activeLabel: "Searching incident sources",
    sources: [
      { label: "Slack – #incident", icon: <SlackMark />, href: "https://slack.com", tooltip: "#incident-checkout" },
      { label: "GitHub – PR 1284", icon: <GitHubMark />, href: "https://github.com", tooltip: "Checkout PR 1284" },
      { label: "Vercel – Deploy 482", icon: <VercelMark />, href: "https://vercel.com", tooltip: "Deployment 482" },
      { label: "Notion – Rollback notes", icon: <NotionMark />, href: "https://www.notion.so", tooltip: "Rollback notes for checkout" },
    ],
    moreSources: [
      { label: "Linear – Release checklist", icon: <LinearMark />, href: "https://linear.app" },
      { label: "Figma – Recovery flow", icon: <FigmaMark />, href: "https://figma.com" },
      { label: "GitLab – Backfill job", icon: <GitLabMark />, href: "https://gitlab.com" },
    ],
  },
  { kind: "step", label: "Reading 7 sources about the checkout errors" },
  { kind: "step", label: "Comparing the failing deploy with the last green one" },
  { kind: "step", label: "Checking feature flags and rollback options" },
  { kind: "step", label: "Drafting the incident summary" },
];

export default function Demo() {
  const script = useThinkingScript();
  const [seconds, setSeconds] = useState<number | null>(null);
  const replay = () => {
    setSeconds(null);
    script.replay();
  };
  const status =
    seconds == null
      ? "Steps, sources and the timer play on their own. Open +3 more, press the header to fold the trail, or replay it."
      : `Finished after ${seconds}s. Replay to watch it again.`;
  return (
    <Stage status={status} onReplay={replay}>
      <div className="mx-auto w-full max-w-[440px]">
        <ThinkingState key={script.run} steps={STEPS} loop onDone={setSeconds} />
      </div>
    </Stage>
  );
}

"use client";

import { useCallback } from "react";
import Stage from "@/components/examples/Stage";
import { AgentCheckpoints } from "../_agent-checkpoints/agent-checkpoints";
import type { Checkpoint, CpDraft } from "../_agent-checkpoints/types";
import { useCheckpointsScript } from "../_agent-checkpoints/use-checkpoints-script";
import { FigmaMark, GitHubMark, LinearMark, NotionMark, SlackMark, VercelMark } from "../_shared/ui/icons";

const DRAFTS: Record<string, CpDraft> = {
  skeleton: { title: "Sketched the flow skeleton", icon: <FigmaMark />, files: 4, time: "0:31", cost: 0.06 },
  copy: { title: "Wrote the welcome copy", icon: <NotionMark />, files: 1, time: "0:49", cost: 0.05 },
  grid: { title: "Built the survey card", icon: <GitHubMark />, files: 3, time: "1:14", cost: 0.11 },
  signup: { title: "Wired up the legacy signup", icon: <SlackMark />, files: 5, time: "1:58", cost: 0.14 },
  tests: { title: "Tests failing – 3 of 9", icon: <GitHubMark />, time: "2:19", cost: 0.04 },
  swap: { title: "Swapped the signup endpoint", icon: <VercelMark />, files: 3, time: "2:41", cost: 0.12 },
  pass: { title: "Tests pass – 9 of 9", icon: <GitHubMark />, time: "3:05", cost: 0.04 },
  pr: { title: "Opened the pull request", icon: <GitHubMark />, files: 1, time: "3:18", cost: 0.03 },
};

const FIRST = (): Checkpoint[] => [{ id: "read", title: "Read the design notes", status: "running", icon: <LinearMark />, time: "0:07", cost: 0.02 }];

export default function Demo() {
  const { rows, rewind, replay } = useCheckpointsScript(FIRST, undefined, DRAFTS);
  const onRewind = useCallback((cp: Checkpoint) => rewind(cp.id), [rewind]);
  return (
    <Stage status="The run rewinds itself after the failed checkpoint. Hover a row to rewind it yourself." onReplay={replay}>
      <div className="mx-auto w-full max-w-[480px]">
        <AgentCheckpoints task="Rebuild the onboarding flow" checkpoints={rows} onRewind={onRewind} />
      </div>
    </Stage>
  );
}

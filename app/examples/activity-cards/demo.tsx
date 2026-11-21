"use client";

import { useMemo, useState } from "react";
import Stage from "@/components/examples/Stage";
import { useSteps } from "@/components/examples/use-script";
import { EditsBeat } from "../_conversation/beats/edits-beat";
import { PrBeat } from "../_conversation/beats/pr-beat";
import { RunBeat } from "../_conversation/beats/run-beat";
import { StepsBeat } from "../_conversation/beats/steps-beat";
import { BeatHostProvider, type BeatHost } from "../_conversation/engine/beat-host";
import type { EditedFile, PanelTarget, PrBeat as Pr, RunBeat as Run, Step } from "../_conversation/script/types";

const STEPS: Step[] = [
  { id: "slack", label: "Read #support for the last 7 days", mark: "slack" },
  { id: "notion", label: "Read the triage playbook", mark: "notion" },
  { id: "search", label: "Search the repo for the queue strip", icon: "search" },
];
const FILES: EditedFile[] = [
  { path: "app/examples/prompt-composer/demo.tsx", add: 14, del: 9 },
  { path: "app/examples/prompt-composer/composer/parts/strips/queue-strip.tsx", add: 6, del: 2 },
  { path: "lib/components.ts", add: 3, del: 0 },
];
const RUN: Run = { kind: "run", command: "npm run lint && npm run typecheck", output: ["> eslint", "", "> tsc --noEmit", "", "Done in 6.2s"], result: "Passed" };
const PR: Pr = { kind: "pr", number: 128, title: "Stop the queue strip from flickering", branch: "fix/queue-strip", state: "open" };
const DELAYS = [700, 700, 700, 500, 600, 600, 600, 500, 1600, 600];

const describe = (target: PanelTarget) => (target.tab === "changes" ? `Would open Changes at ${target.file ?? "the first file"}` : target.tab === "terminal" ? "Would open the Terminal tab" : "Would open the Pull request tab");

function Cards({ onOpen }: { onOpen: (text: string) => void }) {
  const at = useSteps(DELAYS);
  const host = useMemo<BeatHost>(() => ({ onShow: () => {}, open: (target) => onOpen(describe(target)) }), [onOpen]);
  return (
    <BeatHostProvider value={host}>
      <StepsBeat steps={STEPS} doneSteps={Math.min(at, 3)} />
      {at >= 4 && <EditsBeat files={FILES} doneSteps={Math.min(at - 4, 3)} />}
      {at >= 8 && <RunBeat beat={RUN} done={at >= 9} />}
      {at >= 10 && <PrBeat beat={PR} />}
    </BeatHostProvider>
  );
}

export default function Demo() {
  const [run, setRun] = useState(0);
  const [status, setStatus] = useState("Files, the terminal card and the pull request are clickable");
  return (
    <Stage status={status} onReplay={() => setRun((n) => n + 1)}>
      <Cards key={run} onOpen={setStatus} />
    </Stage>
  );
}

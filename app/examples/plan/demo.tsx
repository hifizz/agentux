"use client";

import { useState } from "react";
import Stage from "@/components/examples/Stage";
import { useSteps } from "@/components/examples/use-script";
import { planSnapshot } from "../_fixtures/plan";
import { Message, MessageAvatar } from "../_message/message";
import { Plan } from "../_message/plan";

const steps = ["Trace the queue updates", "Move the drain into the completion handler", "Run the queue regression tests"];
const delays = [900, 1350, 1350, 1350];
const phases = ["Proposed", "Working", "Finished"] as const;
const positions = { Proposed: -1, Working: 1, Finished: steps.length };

function Playback({ onReplay }: { onReplay: () => void }) {
  const [selected, setSelected] = useState<(typeof phases)[number] | null>(null);
  const tick = useSteps(delays, selected === null);
  const position = selected === null ? tick - 1 : positions[selected];
  const proposed = position < 0;
  const phase = proposed ? "Proposed" : position === steps.length ? "Finished" : "Working";
  const plan = planSnapshot(steps, Math.max(0, position), !proposed);
  return (
    <Stage onReplay={onReplay} actions={phases.map((label) => ({
      label, pressed: phase === label, onClick: () => setSelected(label),
    }))}>
      <Message role="assistant" name="reni" avatar={<MessageAvatar label="r" className="normal-case" />} className="mx-auto w-full max-w-md gap-2">
        <Plan plan={plan} />
      </Message>
    </Stage>
  );
}

export default function Demo() {
  const [run, setRun] = useState(0);
  return <Playback key={run} onReplay={() => setRun((value) => value + 1)} />;
}

"use client";

import { useState } from "react";
import Stage from "@/components/examples/Stage";
import { planSnapshot } from "../_fixtures/plan";
import { Message, MessageAvatar } from "../_message/message";
import { Plan } from "../_message/plan";

const steps = ["Trace the queue updates", "Move the drain into the completion handler", "Run the queue regression tests"];
const snapshots = {
  Proposed: planSnapshot(steps, 0, false),
  Working: planSnapshot(steps, 1),
  Finished: planSnapshot(steps, steps.length),
};

export default function Demo() {
  const [state, setState] = useState<keyof typeof snapshots>("Working");
  return (
    <Stage actions={(["Proposed", "Working", "Finished"] as const).map((label) => ({
      label, pressed: state === label, onClick: () => setState(label),
    }))}>
      <Message role="assistant" name="reni" avatar={<MessageAvatar label="r" className="normal-case" />} className="mx-auto w-full max-w-md gap-2">
        <Plan plan={snapshots[state]} />
      </Message>
    </Stage>
  );
}

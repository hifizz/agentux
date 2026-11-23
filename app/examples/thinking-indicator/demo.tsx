"use client";

import { useState } from "react";
import Stage from "@/components/examples/Stage";
import { TallyProvider, useTallyRef } from "../_conversation/engine/tally";
import { Thinking } from "../_conversation/thinking";
import { StepSpinner } from "../_shared/ui/step-spinner";

function Indicators({ done }: { done: boolean }) {
  const tally = useTallyRef();
  return (
    <TallyProvider value={tally}>
      <div className="flex flex-col gap-4">
        <Thinking />
        <div className="flex h-7 items-center gap-2">
          <StepSpinner done={done} />
          <span className="text-ch-caption text-ch-ink-muted">{done ? "Step finished" : "Step running"}</span>
        </div>
      </div>
    </TallyProvider>
  );
}

export default function Demo() {
  const [run, setRun] = useState(0);
  const [done, setDone] = useState(false);
  return (
    <Stage
      align="center"
      status="Elapsed time ticks every second, tokens roll every few seconds"
      actions={[{ label: "Finish the step", onClick: () => setDone(true) }]}
      replayLabel="Reset"
      onReplay={() => {
        setDone(false);
        setRun((n) => n + 1);
      }}
    >
      <Indicators key={run} done={done} />
    </Stage>
  );
}

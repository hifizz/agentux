"use client";

import { RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { AgentWorkbench } from "./workbench";
import { holds, steps } from "./run";

function Playback({ replay }: { replay: () => void }) {
  const [beat, setBeat] = useState(0);
  const [panel, setPanel] = useState<string | null>(null);
  const done = beat > steps.length;
  const holdFinished = done && panel !== null;
  useEffect(() => {
    if (holdFinished) return;
    const timer = setTimeout(() => setBeat((beat + 1) % holds.length), holds[beat]);
    return () => clearTimeout(timer);
  }, [beat, holdFinished]);
  return <div className="wb-view wb-skin"><div className="wb-frame">
    <button type="button" className="wb-replay" onClick={replay} aria-label="Replay workbench" title="Replay"><RotateCcw size={14} /></button>
    <div className="wb-scene" data-fading={beat === holds.length - 1 && !panel}>
      <AgentWorkbench history={steps.slice(0, beat)} done={done} panel={panel} setPanel={setPanel} />
    </div>
  </div></div>;
}

export default function Demo() {
  const [run, setRun] = useState(0);
  return <Playback key={run} replay={() => setRun(n => n + 1)} />;
}

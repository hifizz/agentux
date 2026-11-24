"use client";

import { useEffect, useState } from "react";
import { RotateCcw } from "lucide-react";
import { modelMarks } from "../agent-tree/marks";
import { AgentFindings } from "./findings";
import { cycleMs, snapshot } from "./run";

function Playback() {
  const [now, setNow] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const timer = window.setInterval(() => setNow(Math.floor(((performance.now() - start) % cycleMs) / 250) * 250), 250);
    return () => clearInterval(timer);
  }, []);
  const { agents, findings } = snapshot(now);
  return <AgentFindings agents={agents.map(a => {
    const Logo = modelMarks[a.model];
    return { ...a, logo: <Logo /> };
  })} findings={findings} now={now} />;
}

export default function Demo() {
  const [run, setRun] = useState(0);
  return <div className="af-stage"><div className="af-frame">
    <button className="af-replay" type="button" aria-label="Replay verification" title="Replay" onClick={() => setRun(n => n + 1)}><RotateCcw size={14} /></button>
    <Playback key={run} />
  </div></div>;
}

"use client";

import { RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { useMediaQuery } from "@/lib/use-media-query";
import { AgentTree, type Answer } from "./agent-tree";
import { sample, type Decisions, type issueText } from "./run";

const period = 18500;

function Run({ replay }: { replay: () => void }) {
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [time, setTime] = useState(0);
  const [issue, setIssue] = useState<keyof typeof issueText | null>(null);
  const [decisions, setDecisions] = useState<Decisions>({});
  const [folds, setFolds] = useState<Record<string, boolean>>({});
  useEffect(() => {
    if (issue || reduced) return;
    let last = performance.now();
    const timer = setInterval(() => {
      const now = performance.now(), delta = now - last;
      last = now;
      setTime(t => t + delta);
    }, 100);
    return () => clearInterval(timer);
  }, [issue, reduced]);
  if (time >= period) {
    setTime(time % period);
    setFolds({});
    setDecisions({});
  }
  const t = reduced ? 13000 : time;
  const seconds = t * .008;
  const agents = sample(seconds, decisions);
  const folded = new Set(agents.filter(a => folds[a.id] ?? (a.id === "research" && t >= 9000 && t < 16000)).map(a => a.id));
  function answer(action: Answer) {
    if (action === "approve" || action === "reject") setDecisions(d => ({ ...d, editor: action, answeredAt: seconds }));
    else setDecisions(d => ({ ...d, tester: action, retryAt: seconds }));
    setIssue(null);
  }
  return <div className="at-stage"><div className="at-stage-inner">
    <button type="button" className="at-replay" aria-label="Replay agent run" title="Replay" onClick={replay}><RotateCcw size={14} /></button>
    <AgentTree agents={agents} folded={folded} onFold={id => setFolds(f => ({ ...f, [id]: !folded.has(id) }))} issue={issue} onIssue={setIssue} onAnswer={answer} />
  </div></div>;
}

export default function Demo() {
  const [run, setRun] = useState(0);
  return <Run key={run} replay={() => setRun(r => r + 1)} />;
}

"use client";

import { useEffect, useReducer } from "react";
import Stage from "@/components/examples/Stage";
import { Markdown } from "../_message/markdown";
import { Swarm, type SwarmAgent } from "../_message/swarm";

type Plan = { id: string; name: string; role: string; task: string; steps: string[]; fails?: boolean };

const PLAN: Plan[] = [
  { id: "a", name: "Atlas", role: "research", task: "Collect how three chat apps pace streamed text", steps: ["Searching the web", "Reading 6 sources", "Summarizing findings"] },
  { id: "b", name: "Birch", role: "frontend", task: "Build the smooth stream hook", steps: ["Reading use-script.ts", "Writing use-smooth-stream.ts", "Running typecheck"] },
  { id: "c", name: "Cedar", role: "tests", task: "Write tests for burst and idle streams", steps: ["Creating stream.test.ts", "npm test stream", "2 tests failing"], fails: true },
  { id: "d", name: "Dune", role: "docs", task: "Document the props in the example panel", steps: ["Reading lib/components.ts", "Writing props"] },
  { id: "e", name: "Elm", role: "review", task: "Review the diff once the others finish", steps: ["Reading 4 changed files", "Leaving 2 comments"] },
];
const SLOTS = 3;

type State = { tick: number; agents: SwarmAgent[] };

const initial = (): State => ({ tick: 0, agents: PLAN.map((p) => ({ id: p.id, name: p.name, role: p.role, task: p.task, status: "queued" })) });

function reduce(state: State, action: "tick" | "reset"): State {
  if (action === "reset") return initial();
  let free = SLOTS - state.agents.filter((a) => a.status === "working").length;
  const agents = state.agents.map((a, i): SwarmAgent => {
    const plan = PLAN[i];
    if (a.status === "working") {
      const at = plan.steps.indexOf(a.step ?? "") + 1;
      if (at >= plan.steps.length) {
        free += 1;
        return { ...a, status: plan.fails ? "failed" : "done", step: plan.fails ? "2 tests failing" : "Finished", progress: 1 };
      }
      return { ...a, step: plan.steps[at], progress: (at + 1) / (plan.steps.length + 1) };
    }
    return a;
  });
  return {
    tick: state.tick + 1,
    agents: agents.map((a, i) => {
      if (a.status !== "queued" || free <= 0) return a;
      if (PLAN[i].role === "review" && agents.some((x) => x.status === "working" || (x.status === "queued" && x.id !== a.id))) return a;
      free -= 1;
      return { ...a, status: "working", step: PLAN[i].steps[0], progress: 1 / (PLAN[i].steps.length + 1) };
    }),
  };
}

export default function Demo() {
  const [state, dispatch] = useReducer(reduce, undefined, initial);
  const settled = state.agents.every((a) => a.status === "done" || a.status === "failed");
  useEffect(() => {
    if (settled) return;
    const t = window.setTimeout(() => dispatch("tick"), state.tick === 0 ? 500 : 1100);
    return () => window.clearTimeout(t);
  }, [state.tick, settled]);
  return (
    <Stage status={settled ? "All agents reported back" : "Three slots run in parallel, the reviewer waits for the rest"} onReplay={() => dispatch("reset")}>
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-6 py-8">
        <Swarm title={settled ? "Swarm finished" : "Running 5 agents"} agents={state.agents} />
        {settled && <Markdown>{"Four agents finished and **Cedar** reported 2 failing tests. I will fix the burst test before asking Elm to review again."}</Markdown>}
      </div>
    </Stage>
  );
}

"use client";

import { useCallback, useEffect, useReducer, useState } from "react";
import { TRAIL_SCRIPT, type TrailOp, type TrailScriptStep } from "./script";
import type { TrailState, TrailStep } from "./types";

type State = { steps: TrailStep[]; idx: number; run: number };

type Action =
  | { type: "advance" }
  | { type: "resolve"; step: string; state: TrailState; status?: string; duration?: number }
  | { type: "replay" };

function applyOp(steps: TrailStep[], op: TrailOp, initial: (now: number) => TrailStep[]): TrailStep[] {
  switch (op.kind) {
    case "reset":
      return initial(Date.now());
    case "status":
      return steps.map((s) => (s.id === op.step ? { ...s, status: op.status } : s));
    case "doneSub":
      return steps.map((s) => (s.id === op.step ? { ...s, substeps: s.substeps?.map((t, i) => (i === op.index ? { ...t, state: "done" as const } : t)) } : s));
    case "addSub":
      return steps.map((s) => (s.id === op.step ? { ...s, substeps: [...(s.substeps ?? []), op.sub] } : s));
    case "state":
      return steps.map((s) =>
        s.id === op.step
          ? { ...s, state: op.state, duration: op.duration ?? s.duration, status: op.status ?? s.status, startedAt: op.startedNow ? Date.now() : s.startedAt, substeps: op.subs ?? s.substeps }
          : s,
      );
  }
}

export function useTrailScript(initial: (now: number) => TrailStep[], script: TrailScriptStep[] = TRAIL_SCRIPT) {
  const [seed] = useState(() => Date.now());
  const [state, dispatch] = useReducer(
    (st: State, a: Action): State => {
      if (a.type === "advance") {
        const step = script[st.idx % script.length];
        return { ...st, steps: step.ops.reduce((x, o) => applyOp(x, o, initial), st.steps), idx: st.idx + 1 };
      }
      if (a.type === "resolve") {
        return { ...st, steps: applyOp(st.steps, { kind: "state", step: a.step, state: a.state, status: a.status, duration: a.duration, startedNow: a.state === "running" }, initial) };
      }
      return { steps: initial(Date.now()), idx: 0, run: st.run + 1 };
    },
    seed,
    (s0) => ({ steps: initial(s0), idx: 0, run: 0 }),
  );

  const step = script[state.idx % script.length];
  useEffect(() => {
    const id = window.setTimeout(() => dispatch({ type: "advance" }), step.wait);
    return () => window.clearTimeout(id);
  }, [state.idx, state.run, step.wait]);

  const resolve = useCallback((stepId: string, next: TrailState, extra?: { status?: string; duration?: number }) => {
    dispatch({ type: "resolve", step: stepId, state: next, status: extra?.status, duration: extra?.duration });
  }, []);

  const replay = useCallback(() => dispatch({ type: "replay" }), []);

  return { ...state, resolve, replay };
}

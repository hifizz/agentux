"use client";

import { useCallback, useEffect, useReducer } from "react";
import { NOW_SCRIPT, type NowOp, type NowScriptStep } from "./script";
import type { NowState, NowTask } from "./types";

type State = { tasks: NowTask[]; idx: number; run: number };

type Action = { type: "advance" } | { type: "resolve"; task: string; state: NowState; step?: string; done?: number } | { type: "replay" };

function applyOp(tasks: NowTask[], op: NowOp, initial: () => NowTask[]): NowTask[] {
  switch (op.kind) {
    case "reset":
      return initial();
    case "step":
      return tasks.map((t) => (t.id === op.task ? { ...t, done: op.done, step: op.step } : t));
    case "state":
      return tasks.map((t) => (t.id === op.task ? { ...t, state: op.state, step: op.step ?? t.step, done: op.done ?? t.done } : t));
  }
}

export function useNowScript(initial: () => NowTask[], script: NowScriptStep[] = NOW_SCRIPT) {
  const [state, dispatch] = useReducer(
    (st: State, a: Action): State => {
      if (a.type === "advance") {
        const step = script[st.idx % script.length];
        return { ...st, tasks: step.ops.reduce((x, o) => applyOp(x, o, initial), st.tasks), idx: st.idx + 1 };
      }
      if (a.type === "resolve") {
        return { ...st, tasks: applyOp(st.tasks, { kind: "state", task: a.task, state: a.state, step: a.step, done: a.done }, initial) };
      }
      return { tasks: initial(), idx: 0, run: st.run + 1 };
    },
    initial,
    (init) => ({ tasks: init(), idx: 0, run: 0 }),
  );

  const step = script[state.idx % script.length];
  useEffect(() => {
    const id = window.setTimeout(() => dispatch({ type: "advance" }), step.wait);
    return () => window.clearTimeout(id);
  }, [state.idx, state.run, step.wait]);

  const resolve = useCallback((taskId: string, next: NowState, extra?: { step?: string; done?: number }) => {
    dispatch({ type: "resolve", task: taskId, state: next, step: extra?.step, done: extra?.done });
  }, []);

  const replay = useCallback(() => dispatch({ type: "replay" }), []);

  return { ...state, resolve, replay };
}

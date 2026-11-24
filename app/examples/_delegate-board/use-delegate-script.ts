"use client";

import { useCallback, useEffect, useReducer } from "react";
import { locate, moveTask } from "./board-model";
import { DELEGATE_SCRIPT, type DelegateStep } from "./script";
import type { BoardData, BoardDrag, DropTarget } from "./types";

export type DelegateState = BoardData & {
  auto: boolean;
  drag: BoardDrag | null;
  step: number;
  run: number;
};

type Action = { type: "advance"; steps: DelegateStep[]; initial: BoardData } | { type: "assign"; task: string; to: DropTarget; from: string | null } | { type: "auto"; auto: boolean } | { type: "replay"; initial: BoardData };

const start = (initial: BoardData): DelegateState => ({ ...initial, auto: false, drag: null, step: 0, run: 0 });

function applyStep(st: DelegateState, step: DelegateStep, initial: BoardData): DelegateState {
  const next = { ...st, step: st.step + 1 };
  if (step.reset) return { ...start(initial), run: st.run, step: st.step + 1 };
  if (step.drag) {
    const hit = locate(st, step.drag.task);
    next.drag = hit ? { task: hit.task, from: step.drag.from === undefined ? hit.from : step.drag.from, over: step.drag.over, picked: step.drag.picked } : null;
  }
  if (step.assign) {
    const moved = moveTask(st, step.assign.task, step.assign.to, step.assign.from);
    return { ...next, tasks: moved.tasks, agents: moved.agents, drag: null };
  }
  if (step.auto !== undefined) next.auto = step.auto;
  return next;
}

function reduce(st: DelegateState, action: Action): DelegateState {
  switch (action.type) {
    case "advance": {
      const step = action.steps[st.step % action.steps.length];
      return applyStep(st, step, action.initial);
    }
    case "assign": {
      const moved = moveTask(st, action.task, action.to, action.from);
      return { ...st, tasks: moved.tasks, agents: moved.agents, drag: null };
    }
    case "auto":
      return { ...st, auto: action.auto };
    case "replay":
      return { ...start(action.initial), run: st.run + 1 };
  }
}

export function useDelegateScript(initial: BoardData, steps: DelegateStep[] = DELEGATE_SCRIPT) {
  const [state, dispatch] = useReducer(reduce, initial, start);

  const step = steps[state.step % steps.length];
  const waiting = step.wait === "empty" ? state.tasks.length > 0 : false;
  useEffect(() => {
    if (waiting) return;
    const ms = step.wait === "empty" ? 0 : step.wait;
    const id = window.setTimeout(() => dispatch({ type: "advance", steps, initial }), ms);
    return () => window.clearTimeout(id);
  }, [waiting, step, state.run, steps, initial]);

  const assign = useCallback((task: string, to: DropTarget, from: string | null) => dispatch({ type: "assign", task, to, from }), []);
  const setAuto = useCallback((auto: boolean) => dispatch({ type: "auto", auto }), []);
  const replay = useCallback(() => dispatch({ type: "replay", initial }), [initial]);

  return { ...state, assign, setAuto, replay };
}

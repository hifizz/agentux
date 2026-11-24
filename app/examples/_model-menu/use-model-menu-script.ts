"use client";

import { useCallback, useEffect, useReducer } from "react";
import { MM_SCRIPT, type MmOp, type MmScriptStep } from "./script";
import type { MenuEffort, MenuModel } from "./types";

export type MmBase = { value: string; thinking: boolean; effort: MenuEffort; web: boolean };

type State = MmBase & {
  open: boolean;
  active: string | null;
  pointing: boolean;
  idx: number;
  run: number;
};

type Action =
  | { type: "advance" }
  | { type: "op"; op: MmOp }
  | { type: "openChange"; open: boolean }
  | { type: "activeChange"; id: string | null }
  | { type: "pointingChange"; pointing: boolean }
  | { type: "change"; id: string }
  | { type: "thinkingChange"; on: boolean }
  | { type: "effortChange"; effort: MenuEffort }
  | { type: "webChange"; on: boolean }
  | { type: "replay" };

const baseOf = (b: MmBase): State => ({ ...b, open: false, active: null, pointing: false, idx: 0, run: 0 });

function applyOp(st: State, op: MmOp, models: MenuModel[], b: MmBase): State {
  switch (op.kind) {
    case "reset":
      return { ...baseOf(b), run: st.run };
    case "open":
      return { ...st, open: true, active: st.value, pointing: false };
    case "lit": {
      const m = models[op.index];
      return m ? { ...st, active: m.id, pointing: true } : st;
    }
    case "unpoint":
      return { ...st, pointing: false };
    case "think":
      return { ...st, thinking: op.on };
    case "effort":
      return { ...st, effort: op.effort };
    case "web":
      return { ...st, web: op.on };
    case "select": {
      const m = models[op.index];
      return m ? { ...st, value: m.id, open: false, pointing: false } : st;
    }
  }
}

function reduce(st: State, a: Action, models: MenuModel[], b: MmBase, script: MmScriptStep[]): State {
  switch (a.type) {
    case "advance": {
      const step = script[st.idx % script.length];
      return { ...step.ops.reduce((s, o) => applyOp(s, o, models, b), st), idx: st.idx + 1 };
    }
    case "op":
      return applyOp(st, a.op, models, b);
    case "openChange":
      return a.open ? { ...st, open: true, active: st.value, pointing: false } : { ...st, open: false, pointing: false };
    case "activeChange":
      return { ...st, active: a.id };
    case "pointingChange":
      return { ...st, pointing: a.pointing };
    case "change":
      return { ...st, value: a.id, open: false, pointing: false };
    case "thinkingChange":
      return { ...st, thinking: a.on };
    case "effortChange":
      return { ...st, effort: a.effort };
    case "webChange":
      return { ...st, web: a.on };
    case "replay":
      return { ...baseOf(b), run: st.run + 1 };
  }
}

export function useModelMenuScript(models: MenuModel[], base: MmBase, script: MmScriptStep[] = MM_SCRIPT) {
  const [state, dispatch] = useReducer((st: State, a: Action): State => reduce(st, a, models, base, script), base, (b) => baseOf(b));

  const step = script[state.idx % script.length];
  useEffect(() => {
    const id = window.setTimeout(() => dispatch({ type: "advance" }), step.wait);
    return () => window.clearTimeout(id);
  }, [state.idx, state.run, step.wait]);

  const openChange = useCallback((open: boolean) => dispatch({ type: "openChange", open }), []);
  const activeChange = useCallback((id: string | null) => dispatch({ type: "activeChange", id }), []);
  const pointingChange = useCallback((pointing: boolean) => dispatch({ type: "pointingChange", pointing }), []);
  const change = useCallback((id: string) => dispatch({ type: "change", id }), []);
  const thinkingChange = useCallback((on: boolean) => dispatch({ type: "thinkingChange", on }), []);
  const effortChange = useCallback((effort: MenuEffort) => dispatch({ type: "effortChange", effort }), []);
  const webChange = useCallback((on: boolean) => dispatch({ type: "webChange", on }), []);
  const op = useCallback((o: MmOp) => dispatch({ type: "op", op: o }), []);
  const replay = useCallback(() => dispatch({ type: "replay" }), []);

  return { ...state, openChange, activeChange, pointingChange, change, thinkingChange, effortChange, webChange, op, replay };
}

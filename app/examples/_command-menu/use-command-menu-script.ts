"use client";

import { useCallback, useEffect, useReducer } from "react";
import { flatOptions, jumpKey, moveKey, viewGroups } from "./menu-model";
import { MENU_SCRIPT, type MenuOp, type MenuScriptStep } from "./script";
import { MENU_LABELS, type CommandGroup, type CommandItem, type MenuLabels } from "./types";

type MenuState = {
  query: string;
  active: string | null;
  ran: string | null;
  done: string | null;
  idx: number;
  run: number;
};

type Action = { type: "advance" } | { type: "op"; op: MenuOp } | { type: "activate"; key: string } | { type: "replay" };

type Model = { groups: CommandGroup[]; L: MenuLabels; askLogo: CommandItem["logo"] };

const firstKey = (m: Model, query: string) => flatOptions(viewGroups(m.groups, query, m.L, m.askLogo))[0]?.key ?? null;

const base = (m: Model): MenuState => ({ query: "", active: firstKey(m, ""), ran: null, done: null, idx: 0, run: 0 });

function applyOp(st: MenuState, op: MenuOp, m: Model): MenuState {
  switch (op.kind) {
    case "reset":
      return { ...base(m), run: st.run };
    case "settle":
      return { ...st, ran: null, done: null };
    case "type": {
      const query = st.query + op.text;
      return { ...st, query, active: firstKey(m, query) };
    }
    case "query":
      return { ...st, query: op.q, active: firstKey(m, op.q) };
    case "move":
      return { ...st, active: moveKey(flatOptions(viewGroups(m.groups, st.query, m.L, m.askLogo)), st.active, op.dir) };
    case "jump":
      return { ...st, active: jumpKey(viewGroups(m.groups, st.query, m.L, m.askLogo), st.active, op.dir) };
    case "select":
      return { ...st, active: op.key };
    case "run": {
      const opt = flatOptions(viewGroups(m.groups, st.query, m.L, m.askLogo)).find((o) => o.key === st.active);
      if (!opt) return st;
      return { ...st, ran: opt.key, done: opt.item.done ?? opt.item.name };
    }
  }
}

function reduce(st: MenuState, a: Action, m: Model, script: MenuScriptStep[]): MenuState {
  switch (a.type) {
    case "advance": {
      const step = script[st.idx % script.length];
      return { ...step.ops.reduce((s, o) => applyOp(s, o, m), st), idx: st.idx + 1 };
    }
    case "op":
      return applyOp(st, a.op, m);
    case "activate": {
      const opt = flatOptions(viewGroups(m.groups, st.query, m.L, m.askLogo)).find((o) => o.key === a.key);
      if (!opt) return st;
      return { ...st, active: a.key, ran: a.key, done: opt.item.done ?? opt.item.name };
    }
    case "replay":
      return { ...base(m), run: st.run + 1 };
  }
}

export function useCommandMenuScript(groups: CommandGroup[], opts?: { labels?: Partial<MenuLabels>; askLogo?: CommandItem["logo"]; script?: MenuScriptStep[] }) {
  const { labels, askLogo, script = MENU_SCRIPT } = opts ?? {};
  const model: Model = { groups, L: { ...MENU_LABELS, ...labels }, askLogo };
  const [state, dispatch] = useReducer(
    (st: MenuState, a: Action): MenuState => reduce(st, a, model, script),
    null,
    (): MenuState => base(model),
  );

  const step = script[state.idx % script.length];
  useEffect(() => {
    const id = window.setTimeout(() => dispatch({ type: "advance" }), step.wait);
    return () => window.clearTimeout(id);
  }, [state.idx, state.run, step.wait]);

  const setQuery = useCallback((q: string) => dispatch({ type: "op", op: { kind: "query", q } }), []);
  const select = useCallback((key: string) => dispatch({ type: "op", op: { kind: "select", key } }), []);
  const activate = useCallback((key: string) => dispatch({ type: "activate", key }), []);
  const replay = useCallback(() => dispatch({ type: "replay" }), []);

  return { ...state, setQuery, select, activate, replay };
}

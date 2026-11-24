"use client";

import { useCallback, useEffect, useMemo, useReducer } from "react";
import { liveIds } from "./checkpoint-model";
import { CP_FIX, CP_SCRIPT, type CpOp, type CpScriptStep } from "./script";
import type { Checkpoint, CpDraft } from "./types";

type State = { rows: Checkpoint[]; idx: number; run: number; attempts: number; seq: number };

type Action = { type: "advance" } | { type: "rewind"; target: string; resumeAt: number } | { type: "replay" };

const indexOf = (rows: Checkpoint[]) => new Map(rows.map((r, i) => [r.id, i]));

function applyOp(st: State, op: CpOp, drafts: Record<string, CpDraft>, initial: () => Checkpoint[]): State {
  switch (op.kind) {
    case "reset":
      return { ...st, rows: initial(), attempts: 1 };
    case "add": {
      const d = drafts[op.draft];
      if (!d) return st;
      const id = st.rows.some((r) => r.id === op.draft) ? `${op.draft}-${st.seq}` : op.draft;
      return { ...st, seq: st.seq + 1, rows: [...st.rows, { ...d, id, status: "running" as const }] };
    }
    case "settle":
      return { ...st, rows: st.rows.map((r, i) => (i === st.rows.length - 1 ? { ...r, status: op.status } : r)) };
    case "rewind": {
      const t = st.rows.findIndex((r) => r.id === op.target);
      if (t < 0 || t === st.rows.length - 1) return st;
      const idx = indexOf(st.rows);
      const keep = new Set<string>();
      for (let i = t; i >= 0; ) {
        keep.add(st.rows[i].id);
        const f = st.rows[i].forkOf;
        const p = f !== undefined ? idx.get(f) : undefined;
        i = p !== undefined && p < i ? p : i - 1;
      }
      const live = liveIds(st.rows);
      const attempts = st.attempts + 1;
      const rows = st.rows.map((r) => (live.has(r.id) && !keep.has(r.id) ? { ...r, status: r.status === "running" ? ("stopped" as const) : r.status } : r));
      const d = drafts[op.draft];
      if (d) {
        const id = st.rows.some((r) => r.id === op.draft) ? `${op.draft}-${st.seq}` : op.draft;
        rows.push({ ...d, id, status: "running", attempt: attempts, forkOf: op.target });
        return { ...st, rows, attempts, seq: st.seq + 1 };
      }
      return { ...st, rows, attempts };
    }
  }
}

export function useCheckpointsScript(initial: () => Checkpoint[], script: CpScriptStep[] = CP_SCRIPT, drafts: Record<string, CpDraft> = {}) {
  const [state, dispatch] = useReducer(
    (st: State, a: Action): State => {
      if (a.type === "advance") {
        const step = script[st.idx % script.length];
        const next = step.ops.reduce((x, o) => applyOp(x, o, drafts, initial), st);
        return { ...next, idx: st.idx + 1 };
      }
      if (a.type === "rewind") {
        const next = applyOp(st, { kind: "rewind", target: a.target, draft: CP_FIX }, drafts, initial);
        if (next === st) return st;
        return { ...next, idx: a.resumeAt };
      }
      return { rows: initial(), idx: 0, run: st.run + 1, attempts: 1, seq: st.seq };
    },
    initial,
    (init) => ({ rows: init(), idx: 0, run: 0, attempts: 1, seq: 0 }),
  );

  const resumeAt = useMemo(() => {
    const i = script.findIndex((s) => s.ops.some((o) => o.kind === "rewind"));
    return i < 0 ? 0 : i + 1;
  }, [script]);

  const step = script[state.idx % script.length];
  useEffect(() => {
    const id = window.setTimeout(() => dispatch({ type: "advance" }), step.wait);
    return () => window.clearTimeout(id);
  }, [state.idx, state.run, step.wait]);

  const rewind = useCallback((target: string) => dispatch({ type: "rewind", target, resumeAt }), [resumeAt]);
  const replay = useCallback(() => dispatch({ type: "replay" }), []);

  return { ...state, rewind, replay };
}

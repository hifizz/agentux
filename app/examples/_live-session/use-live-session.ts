"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { clockLabel, reduceSession, userMessage } from "./session-state";
import type { Draft, Script } from "./types";

type Options = { loop?: boolean; loopDelay?: number };

export function useLiveSession(script: Script, { loop = true, loopDelay = 0 }: Options = {}) {
  const [state, dispatch] = useReducer(reduceSession, script.initial);
  const [run, setRun] = useState(0);
  const [elapsed, setElapsed] = useState(script.startSeconds);
  const sent = useRef(0);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    dispatch({ type: "reset", state: script.initial });
    const ids = script.events.map((event) => {
      const { at, ...action } = event;
      return window.setTimeout(() => dispatch(action), at);
    });
    if (loop) ids.push(window.setTimeout(() => setRun((n) => n + 1), script.duration + loopDelay));
    return () => ids.forEach(window.clearTimeout);
  }, [script, run, loop, loopDelay]);

  useEffect(() => {
    const id = window.setInterval(() => setElapsed((n) => n + 1), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => () => timers.current.forEach(window.clearTimeout), []);

  const send = useCallback((draft: Draft) => {
    const n = (sent.current += 1);
    dispatch({ type: "add", item: userMessage(`u-${n}`, draft) });
    const replyId = `r-${n}`;
    const target = draft.to === "everyone" || draft.to === "you" ? "orchestrator" : draft.to;
    timers.current.push(
      window.setTimeout(
        () => dispatch({ type: "add", item: { kind: "message", id: replyId, from: target, to: "you", text: "Got it – I'll pass that on and update the plan.", time: clockLabel(), status: "typing" } }),
        700,
      ),
      window.setTimeout(() => dispatch({ type: "say", id: replyId }), 1600),
    );
  }, []);

  const replay = useCallback(() => setRun((n) => n + 1), []);

  return { state, elapsed, send, replay };
}

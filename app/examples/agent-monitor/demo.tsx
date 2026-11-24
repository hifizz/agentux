"use client";

import { useEffect, useReducer } from "react";
import { RotateCcw } from "lucide-react";
import { Monitor } from "./monitor";
import { initial, play } from "./runs";
import "./monitor.css";

export default function Demo() {
  const [run, dispatch] = useReducer(play, initial);
  useEffect(() => {
    let prev = performance.now();
    const timer = window.setInterval(() => {
      const now = performance.now();
      dispatch({ delta: Math.min(now-prev, 1000) });
      prev = now;
    },100);
    return () => clearInterval(timer);
  },[]);
  return <div className="am-view"><div className="am-stage">
    <button type="button" className="am-replay" aria-label="Replay monitor" title="Replay" onClick={() => dispatch("replay")}><RotateCcw size={14}/></button>
    <Monitor key={run.serial} run={run} dispatch={dispatch}/>
  </div></div>;
}

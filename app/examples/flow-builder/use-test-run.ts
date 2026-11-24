import { useEffect, useState } from "react";
import { initial, itinerary, type Path } from "./workflow";

export type Result = { state: "running" | "done"; ms: number } | { state: "skipped" };
type Report = { results: Record<string, Result>; active?: string; passed?: number };
const empty: Report = { results: {} };

export function useTestRun() {
  const [play, setPlay] = useState<{ path: Path; delay: number } | null>({ path: initial, delay: 1500 });
  const [report, setReport] = useState<Report>(empty);
  useEffect(() => {
    if (!play) return;
    const route = itinerary(play.path), results: Record<string, Result> = {};
    const timers: number[] = [];
    let at = play.delay;
    route.forEach(({ step, skip, duration }, index) => {
      timers.push(window.setTimeout(() => {
        results[step.id] = { state: "running", ms: performance.now() };
        setReport({ results: { ...results }, active: step.id });
      }, at));
      at += duration;
      timers.push(window.setTimeout(() => {
        results[step.id] = { state: "done", ms: duration };
        for (const id of skip) results[id] = { state: "skipped" };
        setReport({ results: { ...results }, passed: index === route.length - 1 ? route.length : undefined });
      }, at));
      at += 120;
    });
    return () => timers.forEach(clearTimeout);
  }, [play]);
  function stop() { setPlay(null); setReport(empty); }
  function start(path: Path) { setReport(empty); setPlay({ path, delay: 0 }); }
  return { report, start, stop };
}

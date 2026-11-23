import type { Step, StepView } from "./types";

export const endOf = (steps: Step[]) => Math.max(...steps.map((step) => step.start + step.duration));

export function viewAt(steps: Step[], now: number): StepView[] {
  return steps
    .filter((step) => step.start <= now)
    .map((step) => {
      const done = now >= step.start + step.duration;
      const failed = done && Boolean(step.failed);
      return {
        step,
        depth: step.parentId ? 1 : 0,
        elapsed: Math.min(now - step.start, step.duration),
        status: failed ? "failed" : done ? "done" : "running",
        bar: failed ? "error" : step.kind,
      };
    });
}

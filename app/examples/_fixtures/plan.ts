import type { PlanStep } from "../_message/plan";

export function planSnapshot(steps: readonly string[], completed: number, running = true): PlanStep[] {
  return steps.map((step, index) => ({
    step,
    status: index < completed ? "completed" : index === completed && running ? "in_progress" : "pending",
  }));
}

import { PlanList, type PlanStep } from "../../_message/plan";
import type { ToolRenderer } from "../contracts";
import { isJsonObject } from "../model";

function isPlan(value: unknown): value is PlanStep[] {
  return Array.isArray(value) && value.every((item) => isJsonObject(item) && typeof item.step === "string" &&
    (item.status === "pending" || item.status === "in_progress" || item.status === "completed"));
}

export const planTool: ToolRenderer = (tool) => {
  if ((tool.name !== "plan" && tool.name !== "update_plan") || tool.result?.message.isError) return undefined;
  const details = tool.result?.message.details;
  const plan = isJsonObject(details) && isPlan(details.plan) ? details.plan : tool.arguments?.plan;
  if (!isPlan(plan)) return undefined;
  return {
    category: "plan",
    action: { active: "Updating plan", done: "Updated plan" },
    summary: `${plan.length} ${plan.length === 1 ? "step" : "steps"}`,
    body: <PlanList plan={plan} />,
  };
};

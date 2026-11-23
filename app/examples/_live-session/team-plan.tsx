"use client";

import { Sparkle } from "lucide-react";
import { formatDuration } from "./format";
import { StepIcon } from "./step-icon";
import { useElapsed } from "./use-ticker";
import type { AgentId, PlanStep } from "./types";

function StepTime({ step }: { step: PlanStep }) {
  const live = step.status === "active";
  const seconds = useElapsed(step.seconds ?? 0, live);
  if (step.status === "pending") return null;
  return <span className="ls-step__time">{formatDuration(seconds)}</span>;
}

export type TeamPlanProps = {
  title?: string;
  agentCount: number;
  steps: PlanStep[];
  elapsed: number;
  picked: AgentId | null;
};

export function TeamPlan({ title = "Team plan", agentCount, steps, elapsed, picked }: TeamPlanProps) {
  const current = steps.findIndex((step) => step.status === "active");
  const done = steps.every((step) => step.status === "done");
  const status = done ? "done" : "running";
  const stepNo = done ? steps.length : current + 1;

  return (
    <section className="ls-plan" data-status={status} aria-label={title}>
      <div className="ls-plan__card">
        <div className="ls-plan__head">
          <span className="ls-plan__spark"><Sparkle size={14} fill="currentColor" aria-hidden="true" /></span>
          <div className="ls-plan__heading">
            <span className="ls-plan__title">{title}</span>
            <span className="ls-plan__sub">
              <span>{agentCount} agents</span>
              <span className="ls-plan__dot">·</span>
              <span className="ls-tnum">Step {stepNo} of {steps.length}</span>
            </span>
            <span className="ls-plan__state" data-status={status}>
              <span className="ls-plan__pulse" />
              {done ? "Done" : "Running"} · {formatDuration(elapsed)}
            </span>
          </div>
        </div>
        <ol className="ls-plan__steps">
          {steps.map((step) => (
            <li
              key={step.id}
              className="ls-step"
              data-status={step.status}
              data-faded={picked && !step.agents.includes(picked) ? "" : undefined}
              aria-current={step.status === "active" ? "step" : undefined}
            >
              <div className="ls-step__row">
                <StepIcon status={step.status} />
                <span className="ls-step__title" dir="auto" title={step.title}>{step.title}</span>
                <StepTime key={`${step.id}-${step.status}`} step={step} />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

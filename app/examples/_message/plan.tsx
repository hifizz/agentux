"use client";

import { Check, Circle, CircleDot, ListChecks } from "lucide-react";
import { useState } from "react";
import { cx } from "@/app/examples/_shared/ui/cx";
import { STEP_STAGGER } from "@/app/examples/_shared/ui/motion";
import { ShimmerText } from "@/app/examples/_shared/ui/shimmer-text";
import { Collapse } from "./collapse";
import { DisclosureRow } from "./disclosure-row";
import "./plan.css";

export type PlanStep = { step: string; status: "pending" | "in_progress" | "completed" };

const states = {
  pending: { icon: Circle, label: "Pending" },
  in_progress: { icon: CircleDot, label: "In progress" },
  completed: { icon: Check, label: "Completed" },
};

export function PlanList({ plan }: { plan: readonly PlanStep[] }) {
  if (!plan.length) return <p className="text-ch-caption text-ch-ink-muted">No steps yet.</p>;
  return (
    <ol aria-label="Plan steps" className="flex flex-col gap-2">
      {plan.map(({ step, status }, index) => {
        const { icon: Icon, label } = states[status];
        const active = status === "in_progress";
        return (
          <li
            key={index}
            className="reni-plan-step flex items-start gap-2 text-ch-body leading-5"
            style={{ animationDelay: `${Math.min(index, 6) * STEP_STAGGER}s` }}
          >
            <Icon aria-hidden data-status={status} className={cx("reni-plan-icon mt-0.5 size-3.5 shrink-0", active ? "text-ch-ink" : "text-ch-ink-subtle")} />
            <span className="sr-only">{label}. </span>
            <ShimmerText active={active} className={cx("min-w-0 whitespace-pre-wrap [overflow-wrap:anywhere]", active && "font-medium text-ch-ink")}>
              {step}
            </ShimmerText>
          </li>
        );
      })}
    </ol>
  );
}

export function Plan({ plan, defaultOpen = true }: { plan: readonly PlanStep[]; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const completed = plan.filter((item) => item.status === "completed").length;
  return (
    <section aria-label="Plan" className="min-w-0 rounded-ch-card border border-ch-line-soft bg-ch-surface px-3 py-1.5">
      <DisclosureRow
        icon={<ListChecks />}
        label="Plan"
        open={open}
        onToggle={() => setOpen((value) => !value)}
        end={
          <span className="inline-flex shrink-0 overflow-hidden text-ch-caption text-ch-ink-muted tabular-nums">
            <span key={completed} className="reni-plan-count">{completed}</span>/{plan.length} complete
          </span>
        }
      />
      <Collapse open={open} className="border-t border-ch-line-soft pt-2.5 pb-1.5">
        <PlanList plan={plan} />
      </Collapse>
    </section>
  );
}

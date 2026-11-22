"use client";

import { Check, TriangleAlert } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cx } from "@/app/examples/_shared/ui/cx";
import { EASE_MORPH } from "@/app/examples/_shared/ui/motion";
import { DisclosureRow } from "./disclosure-row";
import "./message.css";

export type AgentStatus = "queued" | "working" | "done" | "failed";

export type SwarmAgent = {
  id: string;
  name: string;
  role?: string;
  task: string;
  status: AgentStatus;
  step?: string;
  progress?: number;
};

export function AgentOrb({ status, label, className }: { status: AgentStatus; label: string; className?: string }) {
  return (
    <span className={cx("relative grid size-6 shrink-0 place-items-center", className)}>
      {status === "working" && (
        <span aria-hidden className="tf-orb-ring absolute inset-0 rounded-full [background:conic-gradient(from_0deg,transparent_0deg,var(--ch-ink)_300deg,transparent_360deg)] [mask:radial-gradient(farthest-side,transparent_calc(100%-1.5px),#000_calc(100%-1px))]" />
      )}
      <span
        className={cx(
          "grid size-5 place-items-center rounded-full text-[10px] leading-none font-semibold uppercase",
          status === "queued" ? "border border-dashed border-ch-line text-ch-ink-subtle" : "bg-ch-ink text-ch-surface",
          status === "failed" && "bg-ch-diff-del-ink",
        )}
      >
        {status === "done" ? <Check className="size-3" /> : status === "failed" ? <TriangleAlert className="size-3" /> : label[0]}
      </span>
    </span>
  );
}

export function SwarmSummary({ agents }: { agents: readonly SwarmAgent[] }) {
  const working = agents.filter((a) => a.status === "working").length;
  const done = agents.filter((a) => a.status === "done").length;
  const failed = agents.filter((a) => a.status === "failed").length;
  return (
    <span className="flex items-center gap-1.5 text-ch-caption text-ch-ink-subtle tabular-nums">
      {working > 0 && <span>{working} working</span>}
      <span>
        {done}/{agents.length} done
      </span>
      {failed > 0 && <span className="text-ch-diff-del-ink">{failed} failed</span>}
    </span>
  );
}

function AgentTile({ agent, index }: { agent: SwarmAgent; index: number }) {
  const reduced = useReducedMotion();
  const working = agent.status === "working";
  return (
    <motion.li
      layout={!reduced}
      initial={reduced ? false : { opacity: 0, scale: 0.92, filter: "blur(2px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.32, ease: EASE_MORPH, delay: reduced ? 0 : index * 0.06 }}
      className={cx(
        "relative flex min-w-0 flex-col gap-1.5 overflow-hidden rounded-ch-field border bg-ch-surface p-2.5 transition-colors duration-300",
        working ? "border-ch-ink/25 shadow-ch-chip" : "border-ch-line-soft",
        agent.status === "queued" && "opacity-60",
      )}
    >
      <div className="flex min-w-0 items-center gap-2">
        <AgentOrb status={agent.status} label={agent.name} />
        <span className="min-w-0 flex-1 truncate text-ch-body font-medium text-ch-ink">{agent.name}</span>
        {agent.role && <span className="shrink-0 text-ch-micro text-ch-ink-subtle">{agent.role}</span>}
      </div>
      <p className="line-clamp-2 text-ch-caption leading-5 text-ch-ink-muted">{agent.task}</p>
      <div className="relative h-5 overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={agent.step ?? agent.status}
            initial={reduced ? false : { y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduced ? undefined : { y: -12, opacity: 0 }}
            transition={{ duration: 0.22, ease: EASE_MORPH }}
            className={cx("ch-mono absolute inset-x-0 truncate text-ch-micro leading-5", working ? "ch-anim-shimmer" : "text-ch-ink-subtle")}
          >
            {agent.step ?? (agent.status === "queued" ? "Waiting for a slot" : agent.status)}
          </motion.span>
        </AnimatePresence>
      </div>
      <span aria-hidden className="absolute inset-x-0 bottom-0 h-0.5 bg-ch-line-soft">
        <motion.span
          className={cx("block h-full origin-left", agent.status === "failed" ? "bg-ch-diff-del-ink" : "bg-ch-ink")}
          initial={false}
          animate={{ scaleX: agent.status === "done" ? 1 : (agent.progress ?? 0) }}
          transition={{ duration: reduced ? 0 : 0.4, ease: EASE_MORPH }}
        />
      </span>
    </motion.li>
  );
}

export type SwarmProps = {
  title: string;
  agents: readonly SwarmAgent[];
  lead?: React.ReactNode;
  columns?: 1 | 2 | 3;
};

const COLS = { 1: "grid-cols-1", 2: "grid-cols-1 @md:grid-cols-2", 3: "grid-cols-1 @md:grid-cols-2 @2xl:grid-cols-3" };

export function Swarm({ title, agents, lead, columns = 2 }: SwarmProps) {
  const active = agents.some((a) => a.status === "working" || a.status === "queued");
  return (
    <div className="@container flex flex-col gap-2" aria-live="polite">
      <DisclosureRow
        icon={<span className={cx("size-1.5 rounded-full bg-ch-ink", active && "tf-pulse")} />}
        label={title}
        shimmer={active}
        end={<SwarmSummary agents={agents} />}
      />
      {lead}
      <ul className={cx("grid gap-2", COLS[columns])}>
        {agents.map((a, i) => (
          <AgentTile key={a.id} agent={a} index={i} />
        ))}
      </ul>
    </div>
  );
}

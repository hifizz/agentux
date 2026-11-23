import type { CSSProperties } from "react";
import type { Agent } from "./types";

export function AgentMark({ agent, busy }: { agent: Pick<Agent, "pattern" | "color" | "you">; busy?: boolean }) {
  return (
    <span className="ls-mark" aria-hidden="true" data-you={agent.you ? "" : undefined} data-busy={busy ? "" : undefined} style={{ "--ls-mark": agent.color } as CSSProperties}>
      {Array.from(agent.pattern).map((on, i) => (
        <i key={i} data-on={on === "1" ? "" : undefined} style={{ animationDelay: `${((i % 3) + Math.floor(i / 3)) * 120}ms` }} />
      ))}
    </span>
  );
}

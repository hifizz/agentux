"use client";

import { useState } from "react";
import { AgentChat } from "./agent-chat";
import { ContextWindow } from "./context-window";
import { TeamPlan } from "./team-plan";
import type { Agent, AgentId, Draft, SessionState } from "./types";
import "./live-session.css";

export type LiveSessionProps = {
  agents: Agent[];
  session: SessionState;
  agentCount: number;
  elapsed: number;
  onSend: (draft: Draft) => void;
  className?: string;
};

export function LiveSession({ agents, session, agentCount, elapsed, onSend, className }: LiveSessionProps) {
  const [picked, setPicked] = useState<AgentId | null>(null);

  return (
    <div className={className ? `ls ${className}` : "ls"}>
      <div className="ls__grid">
        <div className="ls__main">
          <AgentChat agents={agents} visible={session.visible} items={session.items} picked={picked} onPick={setPicked} onSend={onSend} />
        </div>
        <div className="ls__side">
          <TeamPlan agentCount={agentCount} steps={session.steps} elapsed={elapsed} picked={picked} />
          <ContextWindow context={session.context} />
        </div>
      </div>
    </div>
  );
}

"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { Agent, AgentId } from "./types";

const AgentsContext = createContext<Record<AgentId, Agent>>({});

export function AgentsProvider({ agents, children }: { agents: Agent[]; children: ReactNode }) {
  const byId = useMemo(() => Object.fromEntries(agents.map((agent) => [agent.id, agent])), [agents]);
  return <AgentsContext.Provider value={byId}>{children}</AgentsContext.Provider>;
}

export function useAgent(id: AgentId | "everyone"): Agent | undefined {
  return useContext(AgentsContext)[id];
}

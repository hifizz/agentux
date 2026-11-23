import { AgentMark } from "./agent-mark";
import type { Agent, AgentId } from "./types";

export function AgentTabs({ agents, picked, onPick }: { agents: Agent[]; picked: AgentId | null; onPick: (id: AgentId | null) => void }) {
  return (
    <div className="ls-tabs" role="group" aria-label="Filter by agent">
      <button type="button" className="ls-tab" aria-pressed={picked === null} onClick={() => onPick(null)}>
        Everyone
      </button>
      {agents.map((agent) => (
        <button
          key={agent.id}
          type="button"
          className="ls-tab"
          data-fresh=""
          aria-pressed={picked === agent.id}
          title={agent.model ? `${agent.name} · ${agent.model}` : agent.name}
          onClick={() => onPick(picked === agent.id ? null : agent.id)}
        >
          <AgentMark agent={agent} />
          <span className="ls-tab__name">{agent.name}</span>
        </button>
      ))}
    </div>
  );
}

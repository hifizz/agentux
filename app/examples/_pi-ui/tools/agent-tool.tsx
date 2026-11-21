import { useContext } from "react";
import { Button } from "@/app/examples/_shared/ui/button";
import type { ToolAction, ToolRenderer, ToolView } from "../contracts";
import { PanelHostContext } from "../renderers";
import { AgentStatusPill } from "../panel/agent-status";
import { agentIdOf, resultText } from "./decode";

const ACTIONS: Readonly<Record<string, ToolAction>> = {
  subagent: { active: "Running agent", done: "Ran agent" },
  agent_spawn: { active: "Starting agent", done: "Started agent" },
  agent_send: { active: "Messaging agent", done: "Messaged agent" },
  agent_wait: { active: "Waiting for agent", done: "Waited for agent" },
  agent_stop: { active: "Stopping agent", done: "Stopped agent" },
  agent_list: { active: "Listing agents", done: "Listed agents" },
};

const stringArg = (tool: ToolView, key: string) => {
  const value = tool.arguments?.[key];
  return typeof value === "string" ? value : undefined;
};

function Summary({ tool }: { tool: ToolView }) {
  const { agents } = useContext(PanelHostContext);
  const id = agentIdOf(tool);
  const name = (id !== undefined ? agents.get(id)?.name : undefined) ?? stringArg(tool, "name") ?? (id !== undefined ? `agent ${id}` : undefined);
  const what = stringArg(tool, "task") ?? stringArg(tool, "message");
  return (
    <>
      {name && <span className="text-ch-ink">{name}</span>}
      {what && <span className="text-ch-ink-subtle">{name ? " · " : ""}{what}</span>}
    </>
  );
}

function Body({ tool }: { tool: ToolView }) {
  const { agents, openAgent } = useContext(PanelHostContext);
  const id = agentIdOf(tool);
  const agent = id !== undefined ? agents.get(id) : undefined;
  const what = stringArg(tool, "task") ?? stringArg(tool, "message");
  const result = tool.result?.message.isError ? undefined : resultText(tool);
  return (
    <div className="flex flex-col gap-2">
      {agent && (
        <div className="flex items-center gap-2">
          <AgentStatusPill status={agent.status} />
          <span className="text-ch-caption text-ch-ink-subtle">{agent.mode === "background" ? "background" : "foreground"} · conversation {agent.id}</span>
          {openAgent && (
            <Button variant="secondary" className="ml-auto" onClick={() => openAgent(agent.id)}>
              Open agent
            </Button>
          )}
        </div>
      )}
      {what && <p className="text-ch-caption leading-5 break-words whitespace-pre-wrap text-ch-ink">{what}</p>}
      {result && <pre className="ch-mono max-h-64 overflow-auto border-t border-ch-line-soft pt-2 text-ch-caption leading-5 break-words whitespace-pre-wrap text-ch-ink-muted">{result}</pre>}
    </div>
  );
}

export const agentTool: ToolRenderer = (tool) => {
  const action = ACTIONS[tool.name];
  if (!action) return undefined;
  return { category: "agent", action, summary: <Summary tool={tool} />, body: <Body tool={tool} /> };
};

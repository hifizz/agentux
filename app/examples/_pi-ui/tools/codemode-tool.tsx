import { isJsonObject } from "../model";
import { ToolStepList } from "../blocks/tool-steps";
import type { ToolRenderer, ToolView } from "../contracts";
import { CodeLines } from "./code-lines";
import { codemodeDetails, codemodeInput } from "./decode";

function parseArguments(text: string): ToolView["arguments"] {
  try {
    const value: unknown = JSON.parse(text);
    return isJsonObject(value) ? value : undefined;
  } catch {
    return undefined;
  }
}

function callsOf(tool: ToolView): readonly ToolView[] {
  const details = codemodeDetails(tool);
  if (details) {
    return details.calls.map((c) => ({
      callId: `${tool.callId}/c${c.id}`,
      name: c.name,
      arguments: parseArguments(c.args),
      argsText: c.args,
      outcome: c.status,
      error: c.error,
      durationMs: c.durationMs,
    }));
  }
  return (tool.nested ?? []).map((slot) => ({
    callId: slot.callId,
    name: slot.name,
    arguments: slot.arguments,
    slot,
    outcome: slot.status !== "done" ? "running" : slot.summary?.isError ? "error" : "ok",
    error: slot.summary?.error,
    durationMs: slot.summary?.durationMs,
  }));
}

export const codemodeTool: ToolRenderer = (tool) => {
  if (tool.name !== "codemode") return undefined;
  const input = codemodeInput(tool.arguments);
  if (!input) return undefined;
  const calls = callsOf(tool);
  const [header, ...output] = tool.result?.message.content.flatMap((block) => (block.type === "text" ? [block.text] : [])) ?? [];
  const names = [...new Set(calls.map((c) => c.name))];
  return {
    category: "script",
    action: { active: "Running script", done: "Ran script" },
    summary: names.length > 0 ? <span className="text-ch-ink-subtle">{names.join(", ")}</span> : undefined,
    body: (
      <div className="flex flex-col gap-3">
        <CodeLines text={input.code} start={1} code />
        {calls.length > 0 && <ToolStepList tools={calls} streaming={false} />}
        {header && <p className="text-ch-caption text-ch-ink-subtle">{header.trim().replace(/\n+/g, " · ")}</p>}
        {output.map((text, i) => (
          <pre key={i} className="ch-mono max-h-64 overflow-auto text-ch-caption leading-5 break-words whitespace-pre-wrap text-ch-ink-muted">
            {text.replace(/<\/?console_output>\n?/g, "").trim()}
          </pre>
        ))}
        {codemodeDetails(tool)?.fullOutputPath && <p className="text-ch-caption text-ch-ink-subtle">Output was cut; the full text is on the server at {codemodeDetails(tool)?.fullOutputPath}</p>}
      </div>
    ),
  };
};

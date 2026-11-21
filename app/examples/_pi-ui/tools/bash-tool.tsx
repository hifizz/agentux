import { Tag } from "@/app/examples/_shared/ui/tag";
import type { ToolRenderer } from "../contracts";
import { bashInput, exitCodeOf, resultText, stripAnsi } from "./decode";

export const bashTool: ToolRenderer = (tool) => {
  if (tool.name !== "bash") return undefined;
  const input = bashInput(tool.arguments);
  if (!input) return undefined;
  const output = stripAnsi(tool.result ? (resultText(tool) ?? "") : (tool.slot?.output ?? "")).trimEnd();
  const exit = exitCodeOf(tool);
  return {
    category: "shell",
    action: { active: "Running", done: "Ran" },
    summary: (
      <>
        <span className="text-ch-ink-subtle">$ </span>
        <span className="text-ch-ink">{input.command.split("\n")[0]}</span>
      </>
    ),
    body: (
      <div className="flex flex-col gap-2">
        <pre className="ch-mono text-ch-caption leading-5 break-words whitespace-pre-wrap text-ch-ink">
          <span className="text-ch-ink-subtle">$ </span>
          {input.command}
        </pre>
        {output && <pre className="ch-mono max-h-64 overflow-auto text-ch-caption leading-5 break-words whitespace-pre-wrap text-ch-ink-muted">{output}</pre>}
        {(exit !== undefined && exit !== 0) || input.timeout !== undefined ? (
          <div className="flex items-center gap-2">
            {exit !== undefined && exit !== 0 && <Tag tone="frontend">Exit {exit}</Tag>}
            {input.timeout !== undefined && <span className="text-ch-caption text-ch-ink-subtle">timeout {input.timeout}s</span>}
          </div>
        ) : null}
      </div>
    ),
  };
};

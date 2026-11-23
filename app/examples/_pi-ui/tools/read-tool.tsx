import type { ToolRenderer } from "../contracts";
import { readDetails, readInput, resultText } from "./decode";
import { CodeLines, isCode } from "./code-lines";
import { FilePath } from "./file-path";

export const readTool: ToolRenderer = (tool) => {
  if (tool.name !== "read") return undefined;
  const input = readInput(tool.arguments);
  if (!input) return undefined;
  const start = input.offset ?? 1;
  const range = input.offset !== undefined || input.limit !== undefined ? `:${start}–${input.limit === undefined ? "" : start + input.limit - 1}` : "";
  const text = tool.result?.message.isError ? undefined : resultText(tool);
  const truncation = readDetails(tool)?.truncation;
  return {
    category: "file",
    action: { active: "Reading", done: "Read" },
    summary: (
      <>
        <FilePath path={input.path} />
        {range && <span className="text-ch-ink-subtle">{range}</span>}
      </>
    ),
    body:
      text === undefined ? undefined : (
        <div className="flex flex-col gap-1.5">
          {text === "" ? <p className="text-ch-caption text-ch-ink-subtle">Empty file</p> : <CodeLines text={text} start={start} code={isCode(input.path)} />}
          {truncation?.truncated && (
            <p className="text-ch-caption text-ch-ink-subtle">
              Showing the first {truncation.outputLines} of {truncation.totalLines} lines
            </p>
          )}
        </div>
      ),
  };
};

import type { ToolRenderer } from "../contracts";
import { CodeLines, isCode } from "./code-lines";
import { writeInput } from "./decode";
import { FilePath } from "./file-path";

export const writeTool: ToolRenderer = (tool) => {
  if (tool.name !== "write") return undefined;
  const input = writeInput(tool.arguments);
  if (!input) return undefined;
  const lines = input.content === "" ? 0 : input.content.replace(/\n$/, "").split("\n").length;
  return {
    category: "file",
    action: { active: "Writing", done: "Wrote" },
    summary: (
      <>
        <FilePath path={input.path} />
        <span className="text-ch-ink-subtle"> · {lines} {lines === 1 ? "line" : "lines"}</span>
      </>
    ),
    body: input.content === "" ? undefined : <CodeLines text={input.content} start={1} code={isCode(input.path)} />,
  };
};

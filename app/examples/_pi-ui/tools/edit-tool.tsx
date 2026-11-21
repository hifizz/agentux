import { DiffStat } from "@/app/examples/_shared/ui/diff-stat";
import { parsePatch } from "@/app/examples/_shared/ui/diff";
import { DiffView } from "@/app/examples/_shared/ui/diff-view";
import type { ToolRenderer } from "../contracts";
import { editDetails, editInput } from "./decode";
import { FilePath } from "./file-path";

export const editTool: ToolRenderer = (tool) => {
  if (tool.name !== "edit") return undefined;
  const input = editInput(tool.arguments);
  if (!input) return undefined;
  const details = tool.result?.message.isError ? undefined : editDetails(tool);
  const hunks = details ? details.patch.slice(Math.max(0, details.patch.indexOf("@@"))).replace(/\n$/, "") : undefined;
  const patch = hunks?.startsWith("@@") ? parsePatch(hunks) : undefined;
  return {
    category: "file",
    action: { active: "Editing", done: "Edited" },
    summary: (
      <span className="flex min-w-0 items-center gap-2">
        <span className="min-w-0 truncate">
          <FilePath path={input.path} />
          {details?.firstChangedLine !== undefined && <span className="text-ch-ink-subtle">:{details.firstChangedLine}</span>}
        </span>
        {patch && <DiffStat add={patch.add} del={patch.del} />}
      </span>
    ),
    body: patch && (
      <div className="max-h-80 overflow-auto rounded-ch-badge border border-ch-line-soft bg-ch-surface">
        <DiffView lines={patch.lines} wrap={false} />
      </div>
    ),
  };
};

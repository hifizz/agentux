import type { EditedFile } from "../script/types";
import { useBeatHost } from "../engine/beat-host";
import { PencilIcon } from "@/app/examples/_shared/ui/code-icons";
import { DiffStat } from "@/app/examples/_shared/ui/diff-stat";
import { FileIcon } from "@/app/examples/_shared/ui/icons";
import { RevealItem } from "@/app/examples/_shared/ui/reveal";
import { STEP_STAGGER } from "@/app/examples/_shared/ui/motion";
import { StepSpinner } from "@/app/examples/_shared/ui/step-spinner";
import { Glyph } from "@/app/examples/_shared/ui/tag";

export function EditsBeat({ files, doneSteps }: { files: EditedFile[]; doneSteps: number }) {
  const host = useBeatHost();
  return (
    <ol className="flex flex-col gap-2">
      <RevealItem className="flex h-7 items-center gap-2">
        <Glyph>
          <PencilIcon className="size-2.5 text-ch-ink-muted" />
        </Glyph>
        <span className="text-ch-caption text-ch-ink">Edit files</span>
      </RevealItem>
      {files.map((file, i) => {
        const slash = file.path.lastIndexOf("/") + 1;
        return (
          <RevealItem key={file.path} delay={(i + 1) * STEP_STAGGER} className="relative flex h-7 items-center gap-2">
            <svg aria-hidden className="pointer-events-none absolute -top-2 left-0 h-2 w-4 overflow-visible stroke-ch-step-mark">
              <line x1="8" y1="0.5" x2="8" y2="7.5" strokeWidth={1} strokeLinecap="round" />
            </svg>
            <StepSpinner done={i < doneSteps} />
            <Glyph>
              <FileIcon className="size-2.5" />
            </Glyph>
            <button
              type="button"
              onClick={() => host.open({ tab: "changes", file: file.path })}
              className="ch-color-ease ch-focus -mx-1 flex min-w-0 cursor-pointer items-center rounded-ch-badge px-1 text-ch-caption outline-none hover:bg-ch-ghost-hover"
            >
              <span className="ch-mono truncate">
                <span className="text-ch-ink-subtle">{file.path.slice(0, slash)}</span>
                <span className="text-ch-ink">{file.path.slice(slash)}</span>
              </span>
            </button>
            <DiffStat add={file.add} del={file.del} />
          </RevealItem>
        );
      })}
    </ol>
  );
}

import type { RunBeat as RunBeatData } from "../script/types";
import { useBeatHost } from "../engine/beat-host";
import { TerminalIcon } from "@/app/examples/_shared/ui/code-icons";
import { CheckIcon } from "@/app/examples/_shared/ui/icons";
import { Reveal } from "@/app/examples/_shared/ui/reveal";
import { StepSpinner } from "@/app/examples/_shared/ui/step-spinner";
import { Glyph, Tag } from "@/app/examples/_shared/ui/tag";

const TAIL = 3;

export function RunBeat({ beat, done }: { beat: RunBeatData; done: boolean }) {
  const host = useBeatHost();
  return (
    <Reveal>
      <button
        type="button"
        onClick={() => host.open({ tab: "terminal" })}
        aria-label={`Open terminal: ${beat.command}`}
        className="ch-color-ease ch-focus flex w-full cursor-pointer flex-col overflow-hidden rounded-ch-card border border-ch-line bg-ch-surface text-left outline-none hover:border-ch-line-hover"
      >
        <span className="flex h-10 items-center gap-2 px-3">
          <Glyph>
            <TerminalIcon className="size-2.5" />
          </Glyph>
          <code className="ch-mono min-w-0 flex-1 truncate text-ch-caption text-ch-ink">
            <span className="text-ch-ink-subtle">$ </span>
            {beat.command}
          </code>
          {done ? (
            <Tag tone={beat.ok === false ? "frontend" : "success"} className="gap-1 pl-1">
              {beat.ok !== false && <CheckIcon className="size-3" />}
              {beat.result}
            </Tag>
          ) : (
            <span className="flex items-center gap-1 text-ch-caption text-ch-ink-muted">
              <StepSpinner done={false} />
              Running
            </span>
          )}
        </span>
        {done && (
          <span className="ch-anim-fade-in flex flex-col border-t border-ch-line-soft bg-ch-sunken px-3 py-2">
            {beat.output.slice(-TAIL).map((line, i) => (
              <span key={i} className="ch-mono truncate text-ch-caption leading-5 text-ch-ink-muted">
                {line || "\u200B"}
              </span>
            ))}
          </span>
        )}
      </button>
    </Reveal>
  );
}

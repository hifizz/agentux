import type { Step } from "../script/types";
import { ReadToolsIcon } from "@/app/examples/_shared/ui/icons";
import { AppMark } from "@/app/examples/_shared/ui/app-mark";
import { FileIcon, SearchIcon } from "@/app/examples/_shared/ui/icons";
import { RevealItem } from "@/app/examples/_shared/ui/reveal";
import { STEP_STAGGER } from "@/app/examples/_shared/ui/motion";
import { StepSpinner } from "@/app/examples/_shared/ui/step-spinner";
import { Glyph } from "@/app/examples/_shared/ui/tag";

export function StepsBeat({ steps, doneSteps }: { steps: Step[]; doneSteps: number }) {
  return (
    <ol className="flex flex-col gap-2">
      <RevealItem className="flex h-7 items-center gap-2">
        <Glyph>
          <ReadToolsIcon className="h-2 w-[9px] text-ch-ink-muted" />
        </Glyph>
        <span className="text-ch-caption text-ch-ink">Read tools</span>
      </RevealItem>
      {steps.map((step, i) => (
        <RevealItem key={step.id} delay={(i + 1) * STEP_STAGGER} className="relative flex h-7 items-center gap-2">
          <svg aria-hidden className="pointer-events-none absolute -top-2 left-0 h-2 w-4 overflow-visible stroke-ch-step-mark">
            <line x1="8" y1="0.5" x2="8" y2="7.5" strokeWidth={1} strokeLinecap="round" />
          </svg>
          <StepSpinner done={i < doneSteps} />
          {step.mark ? (
            <AppMark mark={step.mark} />
          ) : (
            <Glyph>{step.icon === "search" ? <SearchIcon className="size-2.5" /> : <FileIcon className="size-2.5" />}</Glyph>
          )}
          <span className="truncate text-ch-caption text-ch-ink-muted">{step.label}</span>
        </RevealItem>
      ))}
    </ol>
  );
}

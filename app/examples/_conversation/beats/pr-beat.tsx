import type { PrBeat as PrBeatData } from "../script/types";
import { useBeatHost } from "../engine/beat-host";
import { ArrowRightIcon, PullRequestIcon } from "@/app/examples/_shared/ui/code-icons";
import { GitHubMark } from "@/app/examples/_shared/ui/icons";
import { Reveal } from "@/app/examples/_shared/ui/reveal";
import { Tag } from "@/app/examples/_shared/ui/tag";

export function PrBeat({ beat }: { beat: PrBeatData }) {
  const host = useBeatHost();
  return (
    <Reveal>
      <button
        type="button"
        onClick={() => host.open({ tab: "pr" })}
        className="ch-color-ease ch-focus flex w-full cursor-pointer items-center gap-3 rounded-ch-card border border-ch-line bg-ch-surface p-3 text-left outline-none hover:border-ch-line-hover"
      >
        <span aria-hidden className="grid size-8 shrink-0 place-items-center rounded-ch-control border border-ch-line bg-ch-surface text-ch-ink shadow-ch-chip">
          <GitHubMark className="size-4" />
        </span>
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="truncate text-ch-body text-ch-ink">
            {beat.title} <span className="text-ch-ink-subtle">#{beat.number}</span>
          </span>
          <span className="ch-mono flex items-center gap-1 text-ch-caption text-ch-ink-muted">
            <PullRequestIcon className="size-3" />
            {beat.branch}
            <ArrowRightIcon className="size-3" />
            main
          </span>
        </span>
        <Tag tone={beat.state === "merged" ? "backend" : beat.state === "open" ? "success" : "workflow"} className="capitalize">
          {beat.state ?? "draft"}
        </Tag>
      </button>
    </Reveal>
  );
}

import { CloseIcon } from "@/app/examples/_shared/ui/icons";
import { Button } from "@/app/examples/_shared/ui/button";
import { Tooltip } from "@/app/examples/_shared/ui/tooltip";
import type { QueueStrip } from "../../types";
import { QueueIcon } from "../icons";
import { StripRow } from "./strip-row";

export type QueueStripViewProps = { strip: QueueStrip };

export function QueueStripView({ strip }: QueueStripViewProps) {
  return (
    <StripRow icon={<QueueIcon className="size-3.5" />}>
      <ul aria-label="Queued messages" className="flex flex-col">
        {strip.messages.map((m) => (
          <li key={m.id} className="flex items-center gap-2">
            <span className="min-w-0 flex-1 truncate text-ch-ink-muted">{m.text}</span>
            {m.mode === "steer" && <span className="shrink-0 rounded-ch-badge border border-ch-line px-1 text-ch-micro text-ch-ink-subtle">steer</span>}
            {m.mode === "queue" && strip.onSteer && (
              <Button variant="ghost" onClick={() => strip.onSteer?.(m.id)} className="text-ch-caption">
                Steer
              </Button>
            )}
            <Tooltip label="Remove from queue">
              <Button variant="icon" aria-label="Remove from queue" onClick={() => strip.onRemove(m.id)}>
                <CloseIcon className="size-3" />
              </Button>
            </Tooltip>
          </li>
        ))}
      </ul>
    </StripRow>
  );
}

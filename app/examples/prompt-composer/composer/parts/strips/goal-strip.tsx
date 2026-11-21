import { CloseIcon } from "@/app/examples/_shared/ui/icons";
import { Button } from "@/app/examples/_shared/ui/button";
import { Tooltip } from "@/app/examples/_shared/ui/tooltip";
import type { GoalStrip } from "../../types";
import { TargetIcon } from "../icons";
import { StripRow } from "./strip-row";

export type GoalStripViewProps = { strip: GoalStrip };

const STATUS: Record<GoalStrip["status"], string> = { active: "Working toward", paused: "Paused", done: "Reached" };

export function GoalStripView({ strip }: GoalStripViewProps) {
  return (
    <StripRow
      icon={<TargetIcon className="size-3.5" />}
      actions={
        strip.onClear && (
          <Tooltip label="Clear goal">
            <Button variant="icon" aria-label="Clear goal" onClick={strip.onClear} className="-mr-1">
              <CloseIcon className="size-3" />
            </Button>
          </Tooltip>
        )
      }
    >
      <span className="text-ch-ink-muted">{STATUS[strip.status]} </span>
      <span className="truncate">{strip.text}</span>
    </StripRow>
  );
}

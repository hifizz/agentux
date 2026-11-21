import { CloseIcon, InfoIcon } from "@/app/examples/_shared/ui/icons";
import { Button } from "@/app/examples/_shared/ui/button";
import { LinkButton } from "@/app/examples/_shared/ui/link-button";
import { Tooltip } from "@/app/examples/_shared/ui/tooltip";
import type { UsageStrip } from "../../types";
import { StripRow } from "./strip-row";

export type UsageStripViewProps = { strip: UsageStrip; onDismiss: () => void };

export function UsageStripView({ strip, onDismiss }: UsageStripViewProps) {
  return (
    <StripRow
      icon={<InfoIcon className="size-3.5" />}
      actions={
        <Tooltip label="Dismiss">
          <Button variant="icon" aria-label="Dismiss" onClick={onDismiss} className="-mr-1">
            <CloseIcon className="size-3" />
          </Button>
        </Tooltip>
      }
    >
      You&apos;ve used {strip.percent}%<span className="@max-[340px]:hidden"> of your tokens</span>. <LinkButton onClick={strip.onViewUsage}>View usage</LinkButton>
    </StripRow>
  );
}

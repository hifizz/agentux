import { ArrowUpIcon, StopIcon } from "../../shared/ui/icons";
import { Button } from "../../shared/ui/button";
import { cx } from "../../shared/ui/cx";
import { Tooltip } from "../../shared/ui/tooltip";

export type SendButtonProps = {
  canSend: boolean;
  onSend: () => void;
  label?: string;
  onStop?: () => void;
};

export function SendButton({ canSend, onSend, label = "Send", onStop }: SendButtonProps) {
  if (onStop) {
    return (
      <Tooltip label="Stop">
        <Button variant="solid" aria-label="Stop" onClick={onStop} className="size-6 px-0">
          <StopIcon className="size-4" />
        </Button>
      </Tooltip>
    );
  }
  return (
    <Tooltip label={label}>
      <Button
        variant={canSend ? "primary" : "icon"}
        aria-label={label}
        disabled={!canSend}
        onClick={onSend}
        className={cx("size-6 rounded-ch-control px-0 [--press-squash:0.92]", !canSend && "bg-ch-composer-send text-ch-ink-subtle")}
      >
        <ArrowUpIcon className="size-3.5" />
      </Button>
    </Tooltip>
  );
}

"use client";

import { Check, ThumbsDown, ThumbsUp } from "lucide-react";
import { Button } from "@/app/examples/_shared/ui/button";
import { CopyIcon } from "@/app/examples/_shared/ui/icons";
import { Tooltip } from "@/app/examples/_shared/ui/tooltip";
import { useCopy } from "@/app/examples/_shared/ui/use-copy";

export type MessageActionsProps = {
  text: string;
  onFeedback?: (value: "up" | "down") => void;
};

export function MessageActions({ text, onFeedback }: MessageActionsProps) {
  const [copied, copy] = useCopy(text);
  return (
    <div role="toolbar" aria-label="Message actions" className="bubble-actions">
      <Tooltip label={copied ? "Copied" : "Copy"}>
        <Button variant="icon" aria-label="Copy message" onClick={copy}>
          {copied ? <Check className="size-3.5" /> : <CopyIcon className="size-3.5" />}
        </Button>
      </Tooltip>
      <Tooltip label="Good response">
        <Button variant="icon" aria-label="Good response" onClick={() => onFeedback?.("up")}>
          <ThumbsUp className="size-3.5" />
        </Button>
      </Tooltip>
      <Tooltip label="Bad response">
        <Button variant="icon" aria-label="Bad response" onClick={() => onFeedback?.("down")}>
          <ThumbsDown className="size-3.5" />
        </Button>
      </Tooltip>
    </div>
  );
}

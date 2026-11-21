"use client";

import { useRef } from "react";
import { PaperclipIcon } from "../../shared/ui/icons";
import { Button } from "../../shared/ui/button";
import { Tooltip } from "../../shared/ui/tooltip";
import type { Attachment, AttachControl } from "../types";

export type AttachButtonProps = AttachControl & {
  onAttach: (files: readonly Attachment[]) => void;
};

export function AttachButton({ accept, onAttach }: AttachButtonProps) {
  const input = useRef<HTMLInputElement>(null);
  return (
    <>
      <input
        ref={input}
        type="file"
        multiple
        hidden
        accept={accept}
        onChange={(e) => {
          onAttach(Array.from(e.target.files ?? []).map((f) => ({ id: crypto.randomUUID(), name: f.name })));
          e.target.value = "";
        }}
      />
      <Tooltip label="Attach a file">
        <Button variant="iconRaised" aria-label="Attach a file" onClick={() => input.current?.click()}>
          <PaperclipIcon className="size-3.5" />
        </Button>
      </Tooltip>
    </>
  );
}

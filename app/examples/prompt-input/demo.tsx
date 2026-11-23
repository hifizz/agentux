"use client";

import { useState } from "react";
import { AtSign } from "lucide-react";
import Stage from "@/components/examples/Stage";
import { CHIP } from "@/components/ui/base";
import { AttachButton, AttachmentChips, PromptInput, SendButton, type Attachment } from "../prompt-composer/composer";

export default function Demo() {
  const [text, setText] = useState("");
  const [files, setFiles] = useState<readonly Attachment[]>([{ id: "a", name: "composer-spec.md" }]);
  const [sent, setSent] = useState<string>();
  const [compact, setCompact] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const canSend = text.trim().length > 0 && !disabled;
  const send = () => {
    if (!canSend) return;
    setSent(text.trim());
    setText("");
  };
  return (
    <Stage
      align="center"
      status={sent ? `Sent: ${sent}` : "Header, start and end are slots. Fill them with anything"}
      actions={[
        { label: "Compact", pressed: compact, onClick: () => setCompact((v) => !v) },
        { label: "Invalid", pressed: invalid, onClick: () => setInvalid((v) => !v) },
        { label: "Disabled", pressed: disabled, onClick: () => setDisabled((v) => !v) },
      ]}
    >
      <PromptInput
        value={text}
        onChange={setText}
        onEnter={send}
        placeholder="Describe the change you want"
        density={compact ? "compact" : "regular"}
        invalid={invalid}
        disabled={disabled}
        header={files.length > 0 && <AttachmentChips attachments={files} onRemove={(id) => setFiles((f) => f.filter((x) => x.id !== id))} />}
        start={
          <>
            <AttachButton onAttach={(next) => setFiles((f) => [...f, ...next])} />
            <button type="button" disabled={disabled} onClick={() => setText((t) => `${t}@`)} className={CHIP}>
              <AtSign className="size-3.5" /> Mention
            </button>
          </>
        }
        end={<SendButton canSend={canSend} onSend={send} />}
      />
      {invalid && <p className="text-ch-caption text-ch-diff-del-ink">The message could not be sent. Try again.</p>}
    </Stage>
  );
}

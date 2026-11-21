"use client";

import { useRef, useState } from "react";
import { findModel } from "@/app/examples/_shared/models";
import { cx } from "@/app/examples/_shared/ui/cx";
import { activeStrip } from "./tables";
import type { Attachment, AttachControl, BusyMode, BusyPolicy, ModelControl, PermissionControl, Strip, Submission, TrayControl } from "./types";
import { AttachButton } from "./parts/attach-button";
import { AttachmentChips } from "./parts/attachment-chips";
import { BusyToggle } from "./parts/busy-toggle";
import { ComposerCard } from "./parts/composer-card";
import { EffortPicker } from "./parts/effort-picker";
import { ModelPicker } from "./parts/model-picker";
import { PermissionPicker } from "./parts/permission-picker";
import { SendButton } from "./parts/send-button";
import { StripHost } from "./parts/strips/strip-host";
import { Tray } from "./parts/tray";

export type PromptComposerProps = {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder: string;
  onSubmit: (submission: Submission) => void | Promise<void>;

  busy?: boolean;
  busyPolicy?: BusyPolicy;
  onStop?: () => void;

  attach?: AttachControl;
  model?: ModelControl;
  permission?: PermissionControl;

  strips?: readonly Strip[];
  tray?: TrayControl;

  density?: "regular" | "compact";
  disabled?: boolean;
  autoFocus?: boolean;
  textareaRef?: React.Ref<HTMLTextAreaElement>;
  className?: string;
};

function assignRef<T>(ref: React.Ref<T> | undefined, value: T | null) {
  if (typeof ref === "function") ref(value);
  else if (ref) (ref as React.RefObject<T | null>).current = value;
}

export function PromptComposer({
  value,
  defaultValue = "",
  onValueChange,
  placeholder,
  onSubmit,
  busy = false,
  busyPolicy = "block",
  onStop,
  attach,
  model,
  permission,
  strips = [],
  tray,
  density = "regular",
  disabled = false,
  autoFocus,
  textareaRef,
  className,
}: PromptComposerProps) {
  const [inner, setInner] = useState(defaultValue);
  const text = value ?? inner;
  const setText = (next: string) => {
    if (value === undefined) setInner(next);
    onValueChange?.(next);
  };
  const [attachments, setAttachments] = useState<readonly Attachment[]>([]);
  const [busyMode, setBusyMode] = useState<BusyMode>("queue");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string>();
  const [usageDismissed, setUsageDismissed] = useState(false);
  const own = useRef<HTMLTextAreaElement | null>(null);

  const hasContent = text.trim().length > 0 || attachments.length > 0;
  const canSend = hasContent && !sending && !disabled && !(busy && busyPolicy === "block");
  const whenBusy: BusyMode | null = !busy || busyPolicy === "block" ? null : busyPolicy === "steerable" ? busyMode : "queue";
  const sendLabel = whenBusy === "steer" ? "Steer" : whenBusy === "queue" ? "Queue message" : "Send";

  const send = async () => {
    if (!canSend) return;
    setSending(true);
    setError(undefined);
    try {
      await onSubmit({ text: text.trim(), attachments, model: model?.value, permission: permission?.value, whenBusy });
      setText("");
      setAttachments([]);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSending(false);
      own.current?.focus();
    }
  };

  const strip = activeStrip(strips);
  const stripCollapsed = strip?.kind === "usage" && usageDismissed;
  const card = model ? findModel(model.catalog, model.value.key) : undefined;

  return (
    <div className={cx("@container relative z-30 flex flex-col", className)}>
      <StripHost strip={strip} collapsed={stripCollapsed} onDismissUsage={() => setUsageDismissed(true)} />
      {error && (
        <p role="alert" className="pb-2 text-ch-caption text-ch-diff-del-ink">
          {error}
        </p>
      )}
      <div className={cx(strip && "-mt-4", "flex flex-col")}>
        <ComposerCard
          value={text}
          onChange={setText}
          placeholder={placeholder}
          onEnter={() => void send()}
          inputRef={(el) => {
            own.current = el;
            assignRef(textareaRef, el);
          }}
          autoFocus={autoFocus}
          disabled={disabled}
          density={density}
          above={<AttachmentChips attachments={attachments} onRemove={(id) => setAttachments((a) => a.filter((x) => x.id !== id))} />}
          toolbar={
            <>
              <div className="flex min-w-0 items-center gap-1.5">
                {attach && <AttachButton {...attach} onAttach={(files) => setAttachments((a) => [...a, ...files])} />}
                {permission && <PermissionPicker {...permission} />}
                {busy && busyPolicy === "steerable" && <BusyToggle mode={busyMode} onChange={setBusyMode} />}
              </div>
              <div className="flex min-w-0 items-center gap-1.5">
                {model && <ModelPicker {...model} />}
                {model && card && <EffortPicker model={card} value={model.value.effort} onChange={(effort) => model.onChange({ ...model.value, effort })} />}
                <SendButton canSend={canSend} onSend={() => void send()} label={sendLabel} onStop={busy && !hasContent ? onStop : undefined} />
              </div>
            </>
          }
        />
        {tray && <Tray {...tray} />}
      </div>
    </div>
  );
}

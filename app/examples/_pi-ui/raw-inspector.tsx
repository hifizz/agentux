"use client";

import { useState } from "react";
import { Braces } from "lucide-react";
import { cx } from "@/app/examples/_shared/ui/cx";
import { useCopy } from "@/app/examples/_shared/ui/use-copy";

export function RawButton({ label, open, onClick }: { label: string; open: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={`${label} raw data`}
      aria-pressed={open}
      onClick={onClick}
      className={cx(
        "ch-focus inline-flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-ch-badge text-ch-ink-subtle outline-none hover:bg-ch-ghost-hover hover:text-ch-ink",
        open && "bg-ch-ghost-hover text-ch-ink",
      )}
    >
      <Braces className="size-3" />
    </button>
  );
}

export function RawToggle({ value, label }: { value: unknown; label: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <RawButton label={label} open={open} onClick={() => setOpen((o) => !o)} />
      {open && <RawJson value={value} />}
    </>
  );
}

export function RawJson({ value }: { value: unknown }) {
  const text = JSON.stringify(value, null, 2);
  const [copied, copy] = useCopy(text);
  return (
    <div className="relative basis-full">
      <pre className="ch-mono max-h-80 overflow-auto rounded-ch-field border border-ch-line-soft bg-ch-sunken p-2.5 text-ch-micro leading-4 text-ch-ink-muted">{text}</pre>
      <button
        type="button"
        onClick={copy}
        className="ch-focus absolute top-1.5 right-1.5 cursor-pointer rounded-ch-badge bg-ch-surface px-1.5 text-ch-micro text-ch-ink-muted outline-none hover:text-ch-ink"
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}

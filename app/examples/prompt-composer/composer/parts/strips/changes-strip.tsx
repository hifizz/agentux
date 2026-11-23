"use client";

import { useState } from "react";
import { ChevronDownIcon } from "@/app/examples/_shared/ui/icons";
import { DiffIcon } from "@/app/examples/_shared/ui/code-icons";
import { DiffStat } from "@/app/examples/_shared/ui/diff-stat";
import { cx } from "@/app/examples/_shared/ui/cx";
import type { ChangesStrip } from "../../types";
import { StripRow } from "./strip-row";

export type ChangesStripViewProps = { strip: ChangesStrip };

export function ChangesStripView({ strip }: ChangesStripViewProps) {
  const [pinned, setPinned] = useState(false);
  const [hover, setHover] = useState(false);
  const open = pinned || hover;
  const add = strip.files.reduce((n, f) => n + f.add, 0);
  const del = strip.files.reduce((n, f) => n + f.del, 0);

  return (
    <div className="relative" onPointerEnter={(e) => e.pointerType === "mouse" && setHover(true)} onPointerLeave={() => setHover(false)} onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setPinned(false)}>
      {open && (
        <div className="absolute inset-x-0 bottom-full z-20 pb-1.5">
          <ul aria-label="Changed files" className="ch-anim-pop-in flex max-h-52 flex-col overflow-y-auto rounded-ch-card border border-ch-line bg-ch-popover p-1 shadow-ch-pop">
            {strip.files.map((f) => (
              <li key={f.path}>
                <button
                  type="button"
                  onClick={() => strip.onOpenFile?.(f.path)}
                  className="ch-color-ease ch-focus-inset flex h-7 w-full cursor-pointer items-center gap-2 rounded-ch-control px-2 text-left text-ch-body outline-none hover:bg-ch-ghost-hover"
                >
                  <span className="ch-mono min-w-0 flex-1 truncate text-ch-caption text-ch-ink">{f.path}</span>
                  <DiffStat add={f.add} del={f.del} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <StripRow icon={<DiffIcon className="size-3.5" />}>
        <button type="button" aria-expanded={open} onClick={() => setPinned((p) => !p)} className="ch-focus flex w-full cursor-pointer items-center gap-2 rounded-xs text-left outline-none">
          <span>
            {strip.files.length} {strip.files.length === 1 ? "file" : "files"} changed
          </span>
          <DiffStat add={add} del={del} />
          <ChevronDownIcon aria-hidden className={cx("ml-auto size-3.5 text-ch-ink-subtle transition-transform", open && "rotate-180")} />
        </button>
      </StripRow>
    </div>
  );
}

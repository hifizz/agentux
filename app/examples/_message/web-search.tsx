"use client";

import { useState } from "react";
import { Globe, Search } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cx } from "@/app/examples/_shared/ui/cx";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/base";
import { Collapse } from "./collapse";
import { DisclosureRow } from "./disclosure-row";

export type SearchSource = { id: string; title: string; url: string; snippet?: string; date?: string };

export type WebSearchProps = {
  queries: readonly string[];
  sources: readonly SearchSource[];
  status: "searching" | "done";
  defaultOpen?: boolean;
};

export const domainOf = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
};

const SHADES = ["bg-ch-ink text-ch-surface", "bg-ch-ink-muted text-ch-surface", "bg-ch-ink-subtle text-ch-surface", "bg-ch-ghost-press text-ch-ink"];

export function SiteIcon({ url, className }: { url: string; className?: string }) {
  const domain = domainOf(url);
  const shade = SHADES[[...domain].reduce((n, c) => n + c.charCodeAt(0), 0) % SHADES.length];
  return (
    <span aria-hidden className={cx("grid size-4 shrink-0 place-items-center rounded-full text-[9px] leading-none font-semibold uppercase ring-2 ring-card", shade, className)}>
      {domain[0]}
    </span>
  );
}

export function SiteStack({ sources, max = 4 }: { sources: readonly SearchSource[]; max?: number }) {
  const reduced = useReducedMotion();
  return (
    <span className="flex shrink-0 items-center -space-x-1">
      <AnimatePresence initial={false}>
        {sources.slice(0, max).map((s) => (
          <motion.span key={s.id} initial={reduced ? false : { opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2 }}>
            <SiteIcon url={s.url} />
          </motion.span>
        ))}
      </AnimatePresence>
    </span>
  );
}

export function WebSearch({ queries, sources, status, defaultOpen = false }: WebSearchProps) {
  const [open, setOpen] = useState(defaultOpen);
  const searching = status === "searching";
  const label = searching ? "Searching the web" : `Searched ${sources.length} ${sources.length === 1 ? "site" : "sites"}`;
  return (
    <div className="flex flex-col">
      <DisclosureRow
        icon={<Globe />}
        label={label}
        detail={queries.at(-1)}
        shimmer={searching}
        end={<SiteStack sources={sources} />}
        open={open}
        onToggle={() => setOpen((o) => !o)}
      />
      <Collapse open={open} className="mt-1 mb-2 flex flex-col gap-2 rounded-ch-field border border-ch-line-soft bg-ch-sunken p-2">
        <div className="flex flex-wrap gap-1">
          {queries.map((q) => (
            <span key={q} className="flex h-5 items-center gap-1 rounded-full border border-ch-line bg-ch-surface px-2 text-ch-caption text-ch-ink-muted">
              <Search className="size-3" />
              {q}
            </span>
          ))}
        </div>
        <ul className="flex flex-col">
          {sources.map((s) => (
            <li key={s.id}>
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="ch-focus ch-color-ease flex h-7 items-center gap-2 rounded-ch-badge px-1.5 hover:bg-ch-ghost-hover">
                <SiteIcon url={s.url} className="ring-0" />
                <span className="min-w-0 flex-1 truncate text-ch-caption text-ch-ink">{s.title}</span>
                <span className="shrink-0 text-ch-caption text-ch-ink-subtle">{domainOf(s.url)}</span>
              </a>
            </li>
          ))}
          {searching && <li className="tf-pulse flex h-7 items-center px-1.5 text-ch-caption text-ch-ink-subtle">Reading results</li>}
        </ul>
      </Collapse>
    </div>
  );
}

export function Citation({ index, source }: { index: number; source: SearchSource }) {
  return (
    <Popover>
      <PopoverTrigger
        openOnHover
        delay={120}
        className="ch-focus ch-color-ease mx-0.5 inline-grid h-4 min-w-4 cursor-pointer place-items-center rounded-full bg-ch-ghost-hover px-1 align-[0.1em] text-[10px] leading-none font-medium text-ch-ink-muted tabular-nums hover:bg-ch-ink hover:text-ch-surface"
        aria-label={`Source ${index}: ${source.title}`}
      >
        {index}
      </PopoverTrigger>
      <PopoverContent side="top" align="center" className="w-72 p-3">
        <a href={source.url} target="_blank" rel="noopener noreferrer" className="ch-focus flex flex-col gap-1.5 rounded-ch-badge">
          <span className="flex items-center gap-1.5 text-ch-caption text-ch-ink-subtle">
            <SiteIcon url={source.url} className="ring-0" />
            {domainOf(source.url)}
            {source.date && <span className="ml-auto">{source.date}</span>}
          </span>
          <span className="text-ch-body font-medium text-ch-ink">{source.title}</span>
          {source.snippet && <span className="line-clamp-3 text-ch-caption leading-5 text-ch-ink-muted">{source.snippet}</span>}
        </a>
      </PopoverContent>
    </Popover>
  );
}

export function SourceList({ sources }: { sources: readonly SearchSource[] }) {
  return (
    <ol className="flex flex-wrap gap-1.5">
      {sources.map((s, i) => (
        <li key={s.id}>
          <a
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="ch-focus ch-color-ease flex h-6 max-w-56 items-center gap-1.5 rounded-full border border-ch-line bg-ch-surface pr-2.5 pl-1 text-ch-caption text-ch-ink-muted hover:bg-ch-ghost-hover hover:text-ch-ink"
          >
            <span className="grid size-4 shrink-0 place-items-center rounded-full bg-ch-ghost-hover text-[10px] tabular-nums">{i + 1}</span>
            <span className="truncate">{s.title}</span>
          </a>
        </li>
      ))}
    </ol>
  );
}

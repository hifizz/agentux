const ROWS: { glyph: string; w: string; bars: readonly number[]; lit?: boolean; check?: boolean }[] = [
  { glyph: "V", w: "w-2/5", bars: [2, 5, 5], lit: true },
  { glyph: "V", w: "w-1/3", bars: [4, 4, 3], check: true },
  { glyph: "V", w: "w-1/4", bars: [5, 3, 1] },
];

export function ModelMenuPreview() {
  return (
    <div className="w-[min(80%,17rem)] translate-y-2 rounded-[20px] border border-foreground/10 bg-card p-3 shadow-[0_20px_65px_-18px_#0000002e] motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:-translate-y-1 sm:p-4">
      <div className="flex items-center gap-1.5">
        <span className="flex h-4.5 items-center gap-1 rounded-[5px] border border-foreground/10 px-1.5">
          <span className="size-2 rounded-[3px] bg-foreground/80" />
          <span className="h-1 w-8 rounded-full bg-foreground/60" />
          <svg viewBox="0 0 24 24" className="size-2 text-foreground/40" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </span>
        <span className="ml-auto size-4 rounded-[4px] bg-foreground/80" />
      </div>
      <div className="mt-1.5 rounded-lg border border-foreground/10 bg-card p-1 shadow-[0_10px_28px_-12px_#00000033]">
        <div className="flex items-center justify-between px-1.5 pb-1 pt-0.5">
          <span className="h-1 w-6 rounded-full bg-foreground/20" />
          <span className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <span key={i} className="h-1 w-4 rounded-full bg-foreground/15" />
            ))}
          </span>
        </div>
        {ROWS.map((r, i) => (
          <div key={i} className={`flex items-center gap-1.5 rounded-[4px] px-1.5 py-[5px] ${r.lit ? "bg-foreground/[0.06]" : "opacity-60"}`}>
            <span className="flex size-3.5 shrink-0 items-center justify-center rounded-[4px] bg-card text-[6px] font-medium text-foreground/80 ring-1 ring-foreground/10">{r.glyph}</span>
            <span className="grid min-w-0 flex-1 gap-1">
              <span className="flex items-center gap-1">
                <span className={`h-1.5 rounded-full bg-foreground/30 ${r.w}`} />
                {r.check && (
                  <svg viewBox="0 0 24 24" className="size-2 text-sky-500" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M4.6 12.8 9.2 17.4 19.4 7" />
                  </svg>
                )}
              </span>
              <span className="h-1 w-3/5 rounded-full bg-foreground/15" />
            </span>
            <span className="flex shrink-0 gap-1">
              {r.bars.map((v, c) => (
                <span key={c} className="flex gap-px">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <span key={s} className={`h-1 w-[3px] rounded-px ${s < v ? (r.lit ? "bg-sky-500/80" : "bg-foreground/25") : "bg-foreground/10"}`} />
                  ))}
                </span>
              ))}
            </span>
          </div>
        ))}
        <div className="mt-0.5 border-t border-foreground/[0.06] px-1.5 pb-0.5 pt-1.5">
          <div className="flex items-center gap-1.5">
            <svg viewBox="0 0 14 14" className="size-2.5 text-foreground/40" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5.4 10.5h3.2M5.9 12.2h2.2M7 1.8a3.85 3.85 0 0 0-2.2 7c.4.3.6.7.6 1.1v.1h3.2v-.1c0-.4.2-.8.6-1.1A3.85 3.85 0 0 0 7 1.8Z" />
            </svg>
            <span className="h-1 w-11 rounded-full bg-foreground/25" />
            <span className="ml-auto flex h-2.5 w-4 items-center rounded-[3px] bg-sky-500/80 p-px">
              <span className="ml-auto size-2 rounded-[2px] bg-card" />
            </span>
          </div>
          <div className="ml-[18px] mt-1 flex items-center gap-1.5">
            <span className="h-1 w-6 rounded-full bg-foreground/20" />
            <span className="ml-auto flex gap-0.5">
              <span className="h-2.5 w-4 rounded-[3px] bg-card ring-1 ring-foreground/10" />
              <span className="h-2.5 w-5 rounded-[3px] bg-foreground/[0.08]" />
              <span className="h-2.5 w-4 rounded-[3px] bg-card ring-1 ring-foreground/10" />
            </span>
          </div>
          <div className="mt-1.5 flex items-center gap-1.5">
            <svg viewBox="0 0 14 14" className="size-2.5 text-foreground/40" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="7" cy="7" r="5.25" />
              <path d="M1.95 7h10.1M7 1.75c1.35 1.45 1.95 3.25 1.95 5.25s-.6 3.8-1.95 5.25c-1.35-1.45-1.95-3.25-1.95-5.25S5.65 3.2 7 1.75Z" />
            </svg>
            <span className="h-1 w-8 rounded-full bg-foreground/25" />
            <span className="ml-auto flex h-2.5 w-4 items-center rounded-[3px] bg-foreground/15 p-px">
              <span className="size-2 rounded-[2px] bg-card" />
            </span>
          </div>
        </div>
        <div className="mt-1 flex items-center justify-between border-t border-foreground/[0.06] px-1.5 pb-0.5 pt-1.5">
          <span className="h-1 w-16 rounded-full bg-foreground/20" />
          <span className="flex gap-0.5">
            <span className="h-2.5 w-3 rounded-[3px] bg-card ring-1 ring-foreground/10" />
            <span className="h-2.5 w-3 rounded-[3px] bg-card ring-1 ring-foreground/10" />
          </span>
        </div>
      </div>
    </div>
  );
}

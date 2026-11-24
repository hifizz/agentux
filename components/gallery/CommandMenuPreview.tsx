const ITEMS = [
  { icon: "spark", w: "w-2/5", hint: "w-1/4", keys: 2 },
  { icon: "tile", w: "w-1/2", hint: "w-1/5", keys: 2, sel: true },
  { icon: "tile", w: "w-3/5", hint: "w-1/4", keys: 2 },
  { icon: "tile", w: "w-2/5", hint: "w-1/3", keys: 2 },
  { icon: "line", w: "w-1/3", keys: 1 },
  { icon: "line", w: "w-2/5", keys: 2 },
] as const;

export function CommandMenuPreview() {
  return (
    <div className="w-[min(80%,17rem)] translate-y-2 rounded-[20px] border border-foreground/10 bg-card p-2 shadow-[0_20px_65px_-18px_#0000002e] motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:-translate-y-1">
      <div className="flex items-center gap-1.5 border-b border-foreground/[0.06] px-1.5 pb-2 pt-1">
        <svg viewBox="0 0 16 16" className="size-3 text-foreground/40" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true">
          <circle cx="7" cy="7" r="4.5" />
          <path d="m13.2 13.2-2.75-2.75" />
        </svg>
        <span className="h-1.5 w-1/3 rounded-full bg-foreground/25" />
        <span className="ml-auto flex size-3 items-center justify-center rounded bg-foreground/[0.06]">
          <svg viewBox="0 0 16 16" className="size-2 text-foreground/40" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12.5 4v3a2 2 0 0 1-2 2h-7M6 6.5 3.5 9 6 11.5" />
          </svg>
        </span>
      </div>
      <span className="block px-1.5 pb-1 pt-2 text-[7px] font-medium uppercase tracking-wide text-muted-foreground">Agent</span>
      <div className="space-y-0.5">
        {ITEMS.map((it, i) => (
          <div key={i} className={`flex items-center gap-1.5 rounded-md px-1.5 py-1 ${"sel" in it ? "bg-foreground/[0.07]" : ""}`}>
            {it.icon === "spark" ? (
              <span className="flex size-3.5 shrink-0 items-center justify-center rounded-[4px] bg-card ring-1 ring-foreground/10">
                <svg viewBox="0 0 24 24" className="size-2 text-violet-500" fill="currentColor" aria-hidden="true">
                  <path d="M12 3l1.9 6.1L20 11l-6.1 1.9L12 19l-1.9-6.1L4 11l6.1-1.9z" />
                </svg>
              </span>
            ) : it.icon === "tile" ? (
              <span className="size-3.5 shrink-0 rounded-[4px] bg-card ring-1 ring-foreground/10" />
            ) : (
              <span className="size-3.5 shrink-0 rounded-full bg-foreground/20" />
            )}
            <span className={`h-1.5 rounded-full bg-foreground/25 ${it.w}`} />
            {"hint" in it && it.hint && <span className={`h-1.5 rounded-full bg-foreground/15 ${it.hint}`} />}
            <span className="ml-auto flex gap-0.5">
              {Array.from({ length: it.keys }).map((_, k) => (
                <span key={k} className="h-3 w-3 rounded-[3px] bg-card ring-1 ring-foreground/10" />
              ))}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-1.5 flex items-center justify-between border-t border-foreground/[0.06] px-1.5 pt-2">
        <span className="flex items-center gap-1">
          <span className="h-3 w-5 rounded-[3px] bg-card ring-1 ring-foreground/10" />
          <span className="h-1.5 w-12 rounded-full bg-foreground/15" />
        </span>
        <span className="flex items-center gap-0.5">
          <span className="h-3 w-3 rounded-[3px] bg-card ring-1 ring-foreground/10" />
          <span className="h-3 w-3 rounded-[3px] bg-card ring-1 ring-foreground/10" />
        </span>
      </div>
    </div>
  );
}

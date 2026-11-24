const ROWS = [
  { mark: "done", frac: 1, color: "text-sky-500", title: "w-2/5", meta: "steps" },
  { mark: "needs", frac: 0.34, color: "text-amber-500", title: "w-1/2", meta: "badge" },
  { mark: "run", frac: 0.6, color: "text-teal-500", title: "w-3/5", meta: "steps" },
  { mark: "run", frac: 0.17, color: "text-orange-500", title: "w-1/2", meta: "steps" },
  { mark: "pause", frac: 0.25, color: "text-foreground/30", title: "w-2/5", meta: "steps" },
] as const;

const PIE_C = 12.5664;

function Pie({ frac, className }: { frac: number; className: string }) {
  return (
    <svg viewBox="0 0 14 14" className={`size-3 shrink-0 ${className}`} aria-hidden="true">
      <circle cx="7" cy="7" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="7" cy="7" r="2" fill="none" stroke="currentColor" strokeWidth="4" transform="rotate(-90 7 7)" strokeDasharray={`${(frac * PIE_C).toFixed(4)} ${PIE_C}`} />
    </svg>
  );
}

export function RunningNowPreview() {
  return (
    <div className="w-[min(80%,17rem)] translate-y-2 rounded-[20px] border border-foreground/10 bg-card p-3 shadow-[0_20px_65px_-18px_#0000002e] motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:-translate-y-1 sm:p-4">
      <div className="flex items-center gap-1.5">
        <span className="size-2.5 rounded-[3px] bg-foreground/80" />
        <span className="h-1.5 w-9 rounded-full bg-foreground/20" />
        <span className="ml-auto flex h-4.5 items-center gap-1 rounded-[5px] border border-foreground/10 px-1.5">
          <span className="size-1 rounded-full border border-teal-500" />
          <span className="h-1 w-1.5 rounded-full bg-foreground/60" />
          <span className="h-1 w-5 rounded-full bg-foreground/20" />
          <span className="h-2 w-px bg-foreground/10" />
          <span className="size-1 rounded-full bg-amber-500" />
          <span className="h-1 w-1.5 rounded-full bg-foreground/60" />
          <svg viewBox="0 0 24 24" className="size-2 text-foreground/40" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </span>
      </div>
      <div className="ml-auto mt-1.5 w-[92%] rounded-lg border border-foreground/10 bg-card p-1 shadow-[0_10px_28px_-12px_#00000033]">
        <div className="flex items-center gap-1 px-1.5 pb-1 pt-0.5">
          <span className="h-1 w-10 rounded-full bg-foreground/20" />
          <span className="h-1 w-1.5 rounded-full bg-foreground/10" />
        </div>
        {ROWS.map((r, i) => (
          <div key={i} className="flex items-center gap-1.5 rounded-[4px] px-1.5 py-[5px]">
            <Pie frac={r.frac} className={r.color} />
            <span className="grid min-w-0 flex-1 gap-1">
              <span className={`h-1.5 rounded-full bg-foreground/30 ${r.title}`} />
              <span className="h-1 w-3/5 rounded-full bg-foreground/15" />
            </span>
            {r.meta === "badge" ? (
              <span className="rounded-[3px] bg-amber-500/15 px-1 text-[7px] font-medium leading-3.5 text-amber-600 dark:text-amber-400">Needs you</span>
            ) : (
              <span className="h-1 w-3 rounded-full bg-foreground/15" />
            )}
            <span className="w-3.5 shrink-0">
              {r.mark === "done" && (
                <svg viewBox="0 0 24 24" className="size-2.5 text-sky-500" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4.6 12.8 9.2 17.4 19.4 7" />
                </svg>
              )}
              {r.mark === "pause" && <span className="ml-auto block size-0 border-y-[3.5px] border-l-[5px] border-y-transparent border-l-foreground/30" />}
            </span>
          </div>
        ))}
        <div className="mt-0.5 flex items-center gap-1.5 border-t border-foreground/[0.06] px-1.5 pb-0.5 pt-1.5">
          <span className="size-2 rounded-[3px] bg-foreground/15" />
          <span className="h-1 w-9 rounded-full bg-foreground/25" />
          <svg viewBox="0 0 24 24" className="ml-auto size-2 text-foreground/40" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m9 6 6 6-6 6" />
          </svg>
        </div>
      </div>
    </div>
  );
}

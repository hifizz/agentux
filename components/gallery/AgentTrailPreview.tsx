const ROWS = [
  { mark: "done", w: "w-3/5", meta: "w-5" },
  { mark: "done", w: "w-1/2", meta: "w-6" },
  { mark: "run", w: "w-2/3", meta: "run" },
  { mark: "gate", w: "w-1/2", meta: "wait" },
] as const;

export function AgentTrailPreview() {
  return (
    <div className="w-[min(80%,17rem)] translate-y-2 rounded-[20px] border border-foreground/10 bg-card p-3 shadow-[0_20px_65px_-18px_#0000002e] motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:-translate-y-1 sm:p-4">
      <div className="flex items-center gap-1.5 pb-2">
        <span className="h-1.5 w-2/5 rounded-full bg-foreground/30" />
        <span className="ml-auto h-2.5 w-8 rounded bg-foreground/[0.06]" />
        <span className="h-1.5 w-4 rounded-full bg-foreground/15" />
      </div>
      <div className="space-y-2">
        {ROWS.map((r, i) => (
          <div key={i} className="flex items-center gap-1.5 pl-0.5">
            <span className="relative flex size-3.5 shrink-0 items-center justify-center">
              {i > 0 && <span className="absolute bottom-full left-1/2 h-2 w-px -translate-x-1/2 bg-sky-500/50" />}
              {r.mark === "done" && (
                <svg viewBox="0 0 16 16" className="size-3.5 text-sky-500">
                  <circle cx="8" cy="8" r="7" className="fill-sky-500/15" />
                  <path d="M5 8.3 7 10.2 11 6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              {r.mark === "run" && <span className="size-3.5 rounded-full border-[1.5px] border-sky-500/25 border-t-sky-500" />}
              {r.mark === "gate" && <span className="size-3.5 rounded-full border-[1.5px] border-dashed border-amber-500" />}
            </span>
            <span className={`h-1.5 rounded-full bg-foreground/25 ${r.w}`} />
            <span className="ml-auto">
              {r.meta === "run" ? (
                <span className="flex items-center gap-1">
                  <span className="h-1.5 w-6 rounded-full bg-sky-500/60" />
                  <span className="h-1.5 w-3 rounded-full bg-foreground/15" />
                </span>
              ) : r.meta === "wait" ? (
                <span className="rounded bg-amber-500/15 px-1 text-[8px] font-medium leading-4 text-amber-600 dark:text-amber-400">Needs you</span>
              ) : (
                <span className={`block h-1.5 rounded-full bg-foreground/15 ${r.meta}`} />
              )}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-end gap-1">
        <span className="h-3.5 w-9 rounded bg-card ring-1 ring-foreground/10" />
        <span className="h-3.5 w-9 rounded bg-foreground/80" />
      </div>
    </div>
  );
}

const AGENTS = [
  { dot: "bg-orange-400", tag: "bg-foreground/10 text-muted-foreground", label: "Busy" },
  { dot: "bg-orange-400", tag: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400", label: "Free" },
  { dot: "bg-foreground/70", tag: "bg-foreground/10 text-muted-foreground", label: "Busy" },
];

export function DelegateBoardPreview() {
  return (
    <div className="w-[min(80%,22rem)] translate-y-2 rounded-[20px] border border-foreground/10 bg-card p-3 shadow-[0_20px_65px_-18px_#0000002e] motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:-translate-y-1 sm:p-4">
      <div className="flex items-center gap-1.5">
        <span className="size-2.5 rotate-45 rounded-[2px] bg-sky-500" />
        <p className="text-xs font-semibold">Delegate</p>
        <span className="ml-auto flex h-3 w-5 items-center rounded-full bg-sky-500/80 px-px">
          <span className="ml-auto size-2 rounded-full bg-white" />
        </span>
      </div>
      <div className="mt-2.5 grid grid-cols-[2fr_3fr] gap-2">
        <div className="space-y-1 rounded-lg bg-foreground/[0.04] p-1.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-md bg-card px-1.5 py-1 shadow-sm">
              <div className="h-1.5 w-4/5 rounded-full bg-foreground/25" />
              <div className="mt-1 h-1 w-2/5 rounded-full bg-foreground/15" />
            </div>
          ))}
        </div>
        <div className="space-y-1.5 pt-0.5">
          {AGENTS.map((a, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span className={`size-3.5 shrink-0 rounded-[4px] ${a.dot}`} />
              <span className="h-1.5 w-1/3 rounded-full bg-foreground/25" />
              <span className={`ml-auto rounded px-1 py-px text-[8px] font-medium ${a.tag}`}>{a.label}</span>
            </div>
          ))}
          <div className="flex gap-1 pt-0.5">
            <span className="h-3.5 w-10 rounded bg-sky-500/15" />
            <span className="h-3.5 w-12 rounded bg-card shadow-sm ring-1 ring-foreground/10" />
          </div>
        </div>
      </div>
    </div>
  );
}

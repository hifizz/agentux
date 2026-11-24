const ROWS = [
  { lane: 0, w: "w-2/5", meta: "w-4", dim: false },
  { lane: 0, w: "w-1/2", meta: "w-5", dim: false },
  { lane: 0, w: "w-2/5", meta: "w-6", dim: false },
  { lane: 0, w: "w-1/2", meta: "w-5", dim: true },
  { lane: 0, w: "w-1/3", meta: "failed", dim: true },
  { lane: 1, w: "w-1/2", meta: "attempt", dim: false },
] as const;

export function AgentCheckpointsPreview() {
  return (
    <div className="w-[min(80%,17rem)] translate-y-2 rounded-[20px] border border-foreground/10 bg-card p-3 shadow-[0_20px_65px_-18px_#0000002e] motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:-translate-y-1 sm:p-4">
      <div className="flex items-center gap-1.5 pb-2">
        <span className="h-1.5 w-1/4 rounded-full bg-foreground/30" />
        <span className="h-1.5 w-1/3 rounded-full bg-foreground/15" />
        <span className="ml-auto h-1.5 w-9 rounded-full bg-foreground/15" />
      </div>
      <div className="relative">
        <svg className="absolute left-0 top-0 h-full w-[26px] overflow-visible" aria-hidden="true">
          <path d="M8 5.5V41.5" fill="none" stroke="rgb(1 144 254 / 0.5)" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M8 41.5V77.5" fill="none" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M8 41.5C8 54 18 51 18 62.5V95.5" fill="none" stroke="rgb(1 144 254 / 0.5)" strokeWidth="1.5" strokeLinecap="round" />
          {ROWS.map((r, i) => (
            <circle
              key={i}
              cx={r.lane === 0 ? 8 : 18}
              cy={5.5 + i * 18}
              r={r.meta === "attempt" ? 4 : 3}
              className={r.dim ? "fill-card stroke-foreground/20" : r.meta === "attempt" ? "fill-sky-600 stroke-card" : "fill-sky-400 stroke-card"}
              strokeWidth="1.5"
            />
          ))}
        </svg>
        <div className="space-y-[7px] pl-[30px]">
          {ROWS.map((r, i) => (
            <div key={i} className={`flex h-[11px] items-center gap-1.5 ${r.dim ? "opacity-50" : ""}`}>
              <span className={`h-1.5 rounded-full bg-foreground/25 ${r.w}`} />
              {r.meta === "failed" ? (
                <span className="rounded bg-red-500/10 px-1 text-[8px] font-medium leading-4 text-red-600 dark:text-red-400">Failed</span>
              ) : r.meta === "attempt" ? (
                <span className="rounded bg-foreground/[0.06] px-1 text-[8px] font-medium leading-4 text-foreground/60">Attempt 2</span>
              ) : (
                <span className={`ml-auto h-1.5 rounded-full bg-foreground/15 ${r.meta}`} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

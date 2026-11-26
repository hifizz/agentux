const CHIPS = ["w-8", "w-7", "w-9", "w-7"] as const;
const STEPS = [
  { w: "w-2/5", active: false },
  { w: "w-1/2", active: true },
  { w: "w-1/3", active: false },
] as const;

export function ThinkingStatePreview() {
  return (
    <div className="w-[min(80%,17rem)] translate-y-2 rounded-[20px] border border-foreground/10 bg-card p-3 shadow-[0_20px_65px_-18px_#0000002e] motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:-translate-y-1 sm:p-4">
      <div className="flex items-center gap-1.5 px-0.5">
        <span className="grid size-3 grid-cols-3 gap-px" aria-hidden="true">
          {Array.from({ length: 9 }).map((_, i) => (
            <span key={i} className={`rounded-[1px] bg-sky-500 ${[1, 4, 7].includes(i) ? "opacity-35" : ""}`} />
          ))}
        </span>
        <span className="h-1.5 w-10 rounded-full bg-foreground/30" />
        <span className="h-1.5 w-3 rounded-full bg-foreground/15" />
      </div>
      <div className="relative mt-2 pl-[15px]">
        <span className="absolute bottom-2 left-[5px] top-5 w-px bg-foreground/10" aria-hidden="true" />
        <div className="flex items-center gap-1.5">
          <svg viewBox="0 0 24 24" className="size-3 shrink-0 text-foreground/35" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21.8 12a9.8 9.8 0 1 0-9.8 9.8" />
            <path d="M19.7 5.8c-.9.1-2 .5-2.8 1.4-1.4 1.8-2.8 2-3.8 1.4-1.4-.9-.2-2.4-1.9-3.2-1-.5-1.2-1.9-.6-3" />
            <path d="M2.2 10.9c.7.7 1.7 1.3 2.9 1.3 2.4 0 2.9.5 2.9 2.3s0 1.9.5 3.2c.3.9.4 1.8-.2 2.5" />
            <path d="m18.9 18.9 2 2m-.8-4.7a3.8 3.8 0 1 1-7.6 0 3.8 3.8 0 0 1 7.6 0Z" />
          </svg>
          <span className="h-1.5 w-1/4 rounded-full bg-foreground/25" />
        </div>
        <div className="ml-[21px] mt-1.5 flex max-w-[92%] flex-wrap gap-1">
          {CHIPS.map((w, i) => (
            <span key={i} className="flex h-3.5 items-center gap-1 rounded-[4px] bg-card px-1 shadow-[0_0_0_0.5px] shadow-foreground/10">
              <span className={`size-2 rounded-[2px] ${i === 0 ? "bg-emerald-500/70" : i === 1 ? "bg-foreground/70" : i === 2 ? "bg-indigo-500/60" : "bg-orange-500/60"}`} />
              <span className={`h-1 rounded-full bg-foreground/25 ${w}`} />
            </span>
          ))}
          <span className="flex h-3.5 items-center rounded-[4px] px-1 text-[7px] font-medium leading-none text-foreground/50 ring-1 ring-foreground/10">+3</span>
        </div>
        <div className="mt-2 space-y-2">
          {STEPS.map((step, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span className={`shrink-0 ${step.active ? "size-[5px] rounded-[1.5px] bg-sky-500" : "size-1 rounded-full bg-foreground/20"}`} />
              <span className={`h-1.5 rounded-full ${step.w} ${step.active ? "bg-sky-500/45" : "bg-foreground/20"}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

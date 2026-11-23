const CELLS = [
  ...Array.from({ length: 6 }, () => "bg-violet-400"),
  ...Array.from({ length: 4 }, () => "bg-sky-400"),
  ...Array.from({ length: 10 }, () => "bg-emerald-400"),
  ...Array.from({ length: 26 }, () => "bg-indigo-400"),
  ...Array.from({ length: 14 }, () => "bg-foreground/10"),
];

export function ContextWindowPreview() {
  return (
    <div className="w-[min(80%,22rem)] translate-y-2 rounded-[20px] border border-foreground/10 bg-card p-3 shadow-[0_20px_65px_-18px_#0000002e] motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:-translate-y-1 sm:p-4">
      <p className="text-xs font-semibold">Context window</p>
      <p className="mt-2 text-xl font-semibold tabular-nums">546K <span className="text-xs font-normal text-muted-foreground">of 1M tokens</span></p>
      <div className="mt-2 grid grid-cols-10 gap-0.5">
        {CELLS.map((tone, i) => <span key={i} className={`aspect-square rounded-[2px] ${tone}`} />)}
      </div>
    </div>
  );
}

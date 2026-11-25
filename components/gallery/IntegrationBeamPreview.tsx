const TILE_COLORS = [
  ["#e01e5a", "#36c5f0", "#2eb67d"],
  ["#171717", "#171717", "#171717"],
  ["#ea4335", "#fbbc05", "#34a853"],
] as const;

const OUT_COLORS = [
  ["#5e6ad2", "#5e6ad2", "#5e6ad2"],
  ["#fabc05", "#34a853", "#4285f4"],
  ["#f24e1e", "#a259ff", "#0acf83"],
] as const;

function Tile({ colors, dark }: { colors: readonly string[]; dark?: boolean }) {
  return (
    <span className={`flex size-6 items-center justify-center rounded-lg shadow-sm ring-1 ${dark ? "bg-foreground/85 ring-foreground/20" : "bg-card ring-foreground/10"}`}>
      <span className="flex gap-px">
        {colors.map((c, i) => (
          <span key={i} className="size-1 rounded-full" style={{ background: c }} />
        ))}
      </span>
    </span>
  );
}

export function IntegrationBeamPreview() {
  return (
    <div className="w-[min(80%,19rem)] translate-y-2 rounded-[20px] border border-foreground/10 bg-card p-4 shadow-[0_20px_65px_-18px_#0000002e] motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:-translate-y-1">
      <div className="relative flex items-center justify-between">
        <svg viewBox="0 0 120 76" className="absolute inset-x-7 inset-y-0 h-full w-[calc(100%-3.5rem)] text-sky-500/45" fill="none" preserveAspectRatio="none" aria-hidden="true">
          <path d="M6 8 C 32 8 32 38 60 38" stroke="currentColor" strokeWidth="1.1" />
          <path d="M6 38 C 32 38 32 38 60 38" stroke="currentColor" strokeWidth="1.1" />
          <path d="M6 68 C 32 68 32 38 60 38" stroke="currentColor" strokeWidth="1.1" />
          <path d="M60 38 C 88 38 88 8 114 8" stroke="currentColor" strokeWidth="1.1" />
          <path d="M60 38 C 88 38 88 38 114 38" stroke="currentColor" strokeWidth="1.1" />
          <path d="M60 38 C 88 38 88 68 114 68" stroke="currentColor" strokeWidth="1.1" />
          <circle cx="24" cy="29" r="2.2" className="fill-sky-400/90" />
          <circle cx="24" cy="29" r="4.5" className="fill-sky-400/20" />
          <circle cx="95" cy="47" r="2.2" className="fill-sky-400/70" />
          <circle cx="95" cy="47" r="4.5" className="fill-sky-400/15" />
        </svg>
        <div className="relative flex flex-col gap-2.5">
          {TILE_COLORS.map((colors, i) => (
            <Tile key={i} colors={colors} />
          ))}
        </div>
        <div className="relative flex size-9 items-center justify-center rounded-xl bg-foreground/90 shadow-md">
          <svg viewBox="0 0 16 16" className="size-4 text-background" aria-hidden="true">
            <circle cx="6" cy="8" r="3.4" fill="none" stroke="currentColor" strokeWidth="1.7" opacity="0.55" />
            <circle cx="10" cy="8" r="3.4" fill="none" stroke="currentColor" strokeWidth="1.7" />
          </svg>
        </div>
        <div className="relative flex flex-col gap-2.5">
          {OUT_COLORS.map((colors, i) => (
            <Tile key={i} colors={colors} />
          ))}
        </div>
      </div>
      <div className="mt-3 flex justify-center">
        <span className="flex items-center gap-1 rounded-full bg-foreground/[0.05] px-2 py-0.5 ring-1 ring-foreground/10">
          <span className="size-1 rounded-full bg-sky-500" />
          <span className="h-1 w-7 rounded-full bg-foreground/25" />
        </span>
      </div>
    </div>
  );
}

import { ArrowUp, AudioLines } from "lucide-react";

export default function ComposerPreview() {
  return (
    <div className="w-[min(80%,22rem)] translate-y-2 rounded-[20px] border border-foreground/10 bg-card p-3 shadow-[0_20px_65px_-18px_#b74c2a50] motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:-translate-y-1 sm:p-4">
      <div className="border-b border-foreground/8 pb-3 text-sm font-medium sm:text-base">
        Sketch a plan for my next project
      </div>
      <div className="mt-3 flex items-center justify-between gap-4">
        <span className="flex min-w-0 items-center gap-2 text-xs font-medium text-muted-foreground">
          <AudioLines size={15} className="shrink-0" /> <span className="truncate">Opus 5 · Medium · Edit</span>
        </span>
        <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#ff6b35] text-[#22120c] sm:size-8">
          <ArrowUp size={16} />
        </span>
      </div>
    </div>
  );
}

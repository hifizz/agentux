import { ArrowUpRight, PanelTop } from "lucide-react";
import Link from "next/link";
import type { Example } from "@/lib/components";

export default function ComponentCard({ item }: { item: Example }) {
  const Preview = item.preview;

  return (
    <Link
      href={item.href}
      className="group flex flex-col rounded-[32px] border border-black/[0.04] bg-[#f7f3ee] p-2 transition-colors duration-200 ease-out hover:bg-[#f1ebe4] dark:border-transparent dark:border-apple dark:bg-[#151413] dark:hover:bg-[#1c1917]"
      style={{ cornerShape: "squircle" } as React.CSSProperties}
    >
      <div
        aria-hidden="true"
        className="example-cover relative grid aspect-[2/1] min-h-38 w-full place-items-center overflow-hidden rounded-3xl border border-foreground/[0.06] bg-[#fffaf6] dark:bg-[#110f0e]"
        style={{ cornerShape: "squircle" } as React.CSSProperties}
      >
        {Preview ? <Preview /> : <PanelTop className="text-muted-foreground" size={32} />}
      </div>

      <div className="flex items-center justify-between gap-3 px-3 pb-2 pt-3 sm:px-4 sm:pb-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-muted-foreground">{item.category}</p>
          <h3 className="mt-0.5 font-runde text-lg font-bold tracking-tight">{item.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
        </div>
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#ff6b35]/12 text-[#a53712] transition-colors group-hover:bg-[#ff6b35]/20 dark:text-[#ff8e61]">
          <ArrowUpRight size={18} />
        </span>
      </div>
    </Link>
  );
}

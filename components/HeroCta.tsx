import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { promptComposer } from "@/lib/components";

export default function HeroCta() {
  const base = "inline-flex h-12 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-bold transition-colors";

  return (
    <div className="mt-4 flex flex-wrap justify-center gap-2.5">
      <Link href="/examples/" className={`${base} bg-[#ff6b35] text-[#22120c] hover:bg-[#ff8357]`}>
        Browse examples <ArrowRight size={16} aria-hidden="true" />
      </Link>
      <Link href={promptComposer.href} className={`${base} border border-foreground/10 bg-white/45 hover:bg-white dark:bg-white/[0.05] dark:hover:bg-white/10`}>
        Open playground <ArrowUpRight size={15} aria-hidden="true" />
      </Link>
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="mx-auto flex w-[calc(100%-3rem)] max-w-6xl flex-wrap items-center justify-between gap-4 border-t border-foreground/10 py-7">
      <Link href="/" className="flex items-center gap-2 text-sm font-bold tracking-tight">
        <Image src={site.logo} alt="" width={20} height={20} />
        {site.name}
      </Link>
      <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
        <Link href="/examples/" className="hover:text-foreground">Examples</Link>
        <a href="https://rareui.com/" className="hover:text-foreground">Based on Rare UI</a>
      </nav>
    </footer>
  );
}

import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { promptComposer } from "@/lib/components";
import Demo from "./demo";

export const metadata: Metadata = { title: promptComposer.name, description: promptComposer.description };

export default function PromptComposer() {
  return (
    <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-5 pb-16 pt-28 sm:px-6 sm:pt-36">
      <div className="mx-auto max-w-4xl">
        <Link href="/examples/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft size={16} aria-hidden="true" /> All examples
        </Link>
        <h1 className="mt-4 font-runde text-4xl font-bold tracking-tight sm:text-5xl">{promptComposer.name}</h1>
        <p className="mt-3 text-muted-foreground">{promptComposer.description}</p>
        <section aria-label="Prompt Composer playground" className="demo-stage mt-7 rounded-[32px] border border-foreground/10 bg-[#f7f3ee] dark:bg-[#151413]">
          <Demo />
        </section>
        <div className="mt-4 flex flex-wrap justify-between gap-x-4 gap-y-2 text-xs leading-5 text-muted-foreground sm:text-sm">
          <p>Replies are simulated in this browser.</p>
          <p><kbd>Enter</kbd> to send <span aria-hidden="true">·</span> <kbd>Shift</kbd> + <kbd>Enter</kbd> for a new line</p>
        </div>
      </div>
    </main>
  );
}

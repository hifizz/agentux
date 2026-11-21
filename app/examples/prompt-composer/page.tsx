import type { Metadata } from "next";
import ExampleShell from "@/components/Description/ExampleShell";
import { promptComposer } from "@/lib/components";
import Demo from "./demo";

export const metadata: Metadata = { title: promptComposer.name, description: promptComposer.description };

export default function PromptComposer() {
  return (
    <main id="main" className="mx-auto w-full max-w-[1500px] flex-1 px-5 pb-16 pt-28 sm:px-6 sm:pt-32">
      <ExampleShell item={{ ...promptComposer, preview: undefined }}>
        <section aria-label="Prompt Composer playground" className="demo-stage overflow-hidden rounded-[32px] border border-foreground/10">
          <Demo />
        </section>
        <div className="flex flex-wrap justify-between gap-x-4 gap-y-2 text-xs leading-5 text-muted-foreground sm:text-sm">
          <p>Replies are simulated in this browser.</p>
          <p><kbd>Enter</kbd> to send <span aria-hidden="true">·</span> <kbd>Shift</kbd> + <kbd>Enter</kbd> for a new line</p>
        </div>
      </ExampleShell>
    </main>
  );
}

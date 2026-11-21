import ExampleShell from "@/components/Description/ExampleShell";
import type { Example } from "@/lib/components";

export default function ExamplePage({ item, note, children }: { item: Example; note?: React.ReactNode; children: React.ReactNode }) {
  return (
    <main id="main" className="mx-auto w-full max-w-[1500px] flex-1 px-5 pb-16 pt-28 sm:px-6 sm:pt-32">
      <ExampleShell item={{ ...item, preview: undefined }}>
        <section aria-label={`${item.name} playground`} className="demo-stage overflow-hidden rounded-[32px] border border-foreground/10">
          {children}
        </section>
        <div className="flex flex-wrap justify-between gap-x-4 gap-y-2 text-xs leading-5 text-muted-foreground sm:text-sm">
          <p>Everything here is simulated in this browser.</p>
          {note && <p>{note}</p>}
        </div>
      </ExampleShell>
    </main>
  );
}

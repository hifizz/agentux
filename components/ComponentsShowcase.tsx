import { examples, exampleGroups } from "@/lib/components";
import ComponentCard from "./gallery/ComponentCard";
import Link from "next/link";

export default function ComponentsShowcase({
  catalog = false,
}: {
  catalog?: boolean;
}) {
  if (catalog)
    return (
      <main
        id="main"
        className="mx-auto w-full max-w-6xl flex-1 px-5 pb-16 pt-32 sm:px-6 md:pt-40"
      >
        <header className="flex flex-col items-center gap-3 text-center">
          <h1 className="max-w-2xl text-balance font-runde text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
            {examples.length} Agent UX examples
          </h1>
          <p className="max-w-lg text-balance text-sm font-medium text-muted-foreground sm:text-base">
            Interactive patterns for prompts, conversations, and agent messages.
          </p>
        </header>

        {exampleGroups.map((section) => (
          <section
            key={section.label.toLowerCase()}
            id={section.label.toLowerCase()}
            className="mt-14 scroll-mt-28 first:mt-10"
          >
            <h2 className="font-runde text-lg font-semibold tracking-tight sm:text-xl">
              {section.label}{" "}
              <span className="text-muted-foreground">
                <span className="text-[#FC4C01]">[</span>
                {section.items.length}
                <span className="text-[#FC4C01]">]</span>
              </span>
            </h2>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {section.items.map((item) => (
                <ComponentCard key={item.href} item={item} />
              ))}
            </div>
          </section>
        ))}
      </main>
    );
  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-24 sm:px-6 md:py-32">
      <h2 className="text-center font-runde text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
        Explore the examples
      </h2>
      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {exampleGroups.map(({ items }, i) => (
          <ComponentCard
            key={items[0].href}
            item={items[0]}
            large={!i}
            className={!i ? "sm:col-span-2 lg:row-span-2" : ""}
          />
        ))}
        <Link
          href="/examples/"
          className="flex min-h-45 items-end rounded-[32px] bg-[#FC4C01] p-6 font-runde text-2xl font-bold tracking-tight text-white hover:bg-[#e04300] sm:col-span-2 lg:col-span-3"
        >
          View all {examples.length} examples ↗
        </Link>
      </div>
    </section>
  );
}

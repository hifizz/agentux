import { examples } from "@/lib/components";
import ComponentCard from "./gallery/ComponentCard";

export default function ComponentsShowcase({ catalog = false }: { catalog?: boolean }) {
  const Heading = catalog ? "h1" : "h2";
  const Container = catalog ? "main" : "section";

  return (
    <Container
      id={catalog ? "main" : undefined}
      aria-labelledby="examples-heading"
      className={`mx-auto flex w-full max-w-6xl flex-1 flex-col px-5 pb-20 sm:px-6 sm:pb-28 ${catalog ? "pt-32 sm:pt-40" : "pt-14 sm:pt-20"}`}
    >
      <header className="flex flex-col items-center gap-3 text-center">
        <Heading id="examples-heading" className="font-runde text-4xl font-bold tracking-tight sm:text-5xl">
          {catalog ? "Examples" : "Explore examples"}
        </Heading>
        <p className="max-w-lg text-balance text-sm font-medium text-muted-foreground sm:text-base">
          Interactive patterns for prompts and conversations.
        </p>
      </header>
      <div className="mx-auto mt-9 grid w-full max-w-2xl grid-cols-1 gap-4 sm:mt-11">
        {examples.map((example) => <ComponentCard key={example.href} item={example} />)}
      </div>
    </Container>
  );
}

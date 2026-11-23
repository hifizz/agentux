import type { Example } from "@/lib/components";

export default function ExamplePage({
  item,
  note,
  children,
}: {
  item: Example;
  note?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <main
      id="main"
      aria-label={`${item.name} playground`}
      className="relative h-full min-w-0"
    >
      {note && <p className="sr-only">{note}</p>}
      {children}
    </main>
  );
}

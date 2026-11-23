import Link from "next/link";
import type { Example } from "@/lib/components";
import { cn } from "@/lib/utils";

const ArrowIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    aria-hidden="true"
  >
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);

export default function ComponentCard({
  item,
  large = false,
  className,
}: {
  item: Example;
  large?: boolean;
  className?: string;
}) {
  const Preview = item.preview;

  return (
    <Link
      href={item.href}
      prefetch={false}
      className={cn(
        "group flex flex-col rounded-[32px] border border-black/[0.04] bg-[#F5F5F7] p-2 transition-colors duration-200 ease-out dark:border-transparent dark:border-apple dark:bg-[#121212] dark:hover:bg-muted",
        large && "lg:h-full",
        className,
      )}
      style={{ cornerShape: "squircle" } as React.CSSProperties}
    >
      <div
        className={cn(
          "relative aspect-4/3 w-full overflow-hidden rounded-3xl border border-black/[0.06] bg-white dark:border-neutral-500/15 dark:bg-neutral-950",
          large && "lg:aspect-auto lg:flex-1",
        )}
        style={{ cornerShape: "squircle" } as React.CSSProperties}
      >
        <div className="absolute inset-0 grid place-items-center">{Preview && <Preview />}</div>
      </div>

      <div className="flex items-center justify-between gap-3 px-3 pb-1 pt-2">
        <div className="min-w-0">
          <h3 className="flex items-center gap-2 font-runde text-base font-semibold tracking-tight">
            {item.name}
          </h3>
        </div>
        <span className="flex shrink-0 items-center justify-center text-[#FC4C01]">
          <ArrowIcon />
        </span>
      </div>
    </Link>
  );
}

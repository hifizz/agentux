"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { activeExample, type Example } from "@/lib/components";
import { cn } from "@/lib/utils";
import MobileSidebar from "./MobileSidebar";
import DescriptionContent from "../Description/DescriptionContent";
import { SourceFiles } from "../Description/CodeDrawer";
import ThemeToggle from "../ThemeToggle";

const CARD = "rounded-[32px] bg-card";

function MobileSource({ item }: { item: Example }) {
  const [hasOpened, setHasOpened] = useState(false);

  return (
    <details
      className={cn(CARD, "p-6")}
      onToggle={(event) => {
        if (event.currentTarget.open) setHasOpened(true);
      }}
    >
      <summary className="cursor-pointer text-sm font-medium">
        Source code
      </summary>
      {hasOpened && (
        <div className="mt-4 flex h-96 flex-col">
          <SourceFiles item={item} />
        </div>
      )}
    </details>
  );
}

export default function MobileShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const item = activeExample(pathname);

  return (
    <div className="no-scrollbar h-full overflow-y-auto">
      <div className="flex flex-col gap-2 pb-2">
        <div className={cn(CARD, "relative h-[88svh] shrink-0 p-4")}>
          <MobileSidebar />
          <ThemeToggle className="absolute right-4 top-4 z-10 rounded-full bg-popover" />
          {children}
        </div>

        {item && (
          <>
            <div className={cn(CARD, "p-6")}>
              <DescriptionContent item={item} />
            </div>
            <MobileSource key={item.href} item={item} />
          </>
        )}
      </div>
    </div>
  );
}

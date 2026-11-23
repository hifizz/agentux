"use client";

import { usePathname } from "next/navigation";
import { activeExample } from "@/lib/components";
import { cn } from "@/lib/utils";
import MobileSidebar from "./MobileSidebar";
import DescriptionContent from "../Description/DescriptionContent";
import { SourceFiles } from "../Description/CodeDrawer";
import ThemeToggle from "../ThemeToggle";

const CARD = "rounded-[32px] bg-card";

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
            <details key={item.href} className={cn(CARD, "p-6")}>
              <summary className="cursor-pointer text-sm font-medium">
                Source code
              </summary>
              <div className="mt-4 flex h-96 flex-col">
                <SourceFiles item={item} />
              </div>
            </details>
          </>
        )}
      </div>
    </div>
  );
}

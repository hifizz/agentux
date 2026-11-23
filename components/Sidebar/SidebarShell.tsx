"use client";

import { useIsMobile } from "@/lib/use-media-query";
import DesktopShell from "./DesktopShell";
import MobileShell from "./MobileShell";
import { MotionConfig } from "motion/react";

export default function SidebarShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const isMobile = useIsMobile();

  return (
    <MotionConfig reducedMotion="user">
      {isMobile ? (
        <MobileShell>{children}</MobileShell>
      ) : (
        <DesktopShell>{children}</DesktopShell>
      )}
    </MotionConfig>
  );
}

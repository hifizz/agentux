"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useMediaQuery } from "@/lib/use-media-query";
import Sidebar from "./Sidebar";
import { DescriptionPanel } from "../Description/DescriptionPanel";

export default function DesktopShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [navOpen, setNavOpen] = useState(true);
  const [infoOpen, setInfoOpen] = useState(false);
  const reduced = useReducedMotion();

  const compact = useMediaQuery("(max-width: 1199px)");

  const showNav = navOpen && !(compact && infoOpen);

  // ?record hides the floating controls so a demo can be screen recorded clean
  useEffect(() => {
    if (!new URLSearchParams(window.location.search).has("record")) return;
    document.documentElement.dataset.record = "";
    return () => {
      delete document.documentElement.dataset.record;
    };
  }, []);

  return (
    <div className="docs-desktop relative h-full">
      <Sidebar
        open={showNav}
        setOpen={(next) => {
          const open = typeof next === "function" ? next(showNav) : next;
          if (compact && open) setInfoOpen(false);
          setNavOpen(open);
        }}
      />
      <DescriptionPanel
        open={infoOpen}
        setOpen={(next) => {
          const open = typeof next === "function" ? next(infoOpen) : next;
          if (compact && open) setNavOpen(false);
          setInfoOpen(open);
        }}
      />

      <motion.div
        initial={false}
        animate={{
          "--nav-progress": showNav ? 1 : 0,
          "--info-progress": infoOpen ? 1 : 0,
        }}
        transition={
          reduced
            ? { duration: 0 }
            : { type: "spring", stiffness: 300, damping: 30 }
        }
        className="docs-canvas h-full"
      >
        <div
          className="relative z-0 h-full rounded-[45px] bg-card p-4"
          style={{ cornerShape: "squircle" } as React.CSSProperties}
        >
          {children}
        </div>
      </motion.div>
    </div>
  );
}

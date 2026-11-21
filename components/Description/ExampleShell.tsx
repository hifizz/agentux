"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft, PanelRightClose, PanelRightOpen } from "lucide-react";
import type { Example } from "@/lib/components";
import DescriptionContent from "./DescriptionContent";

const PANEL_WIDTH = 460;
const SPRING = { type: "spring", stiffness: 300, damping: 30 } as const;

export default function ExampleShell({ item, children }: { item: Example; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  const reduced = !!useReducedMotion();
  const transition = reduced ? { duration: 0 } : SPRING;

  return (
    <div className="flex gap-4">
      <section className="flex min-w-0 flex-1 flex-col gap-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Link href="/examples/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
              <ArrowLeft size={16} aria-hidden="true" /> All examples
            </Link>
            <h1 className="mt-3 font-runde text-4xl font-bold tracking-tight sm:text-5xl">{item.name}</h1>
          </div>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="example-details"
            className="hidden cursor-pointer items-center gap-2 rounded-full border border-foreground/10 bg-card px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground lg:inline-flex"
          >
            {open ? <PanelRightClose size={16} aria-hidden="true" /> : <PanelRightOpen size={16} aria-hidden="true" />}
            {open ? "Hide details" : "Show details"}
          </button>
        </div>
        {children}
        <DescriptionContent item={item} className="mt-8 rounded-[28px] bg-card p-6 lg:hidden" />
      </section>

      <motion.aside
        id="example-details"
        aria-label={`${item.name} details`}
        initial={false}
        animate={{ width: open ? PANEL_WIDTH : 0, opacity: open ? 1 : 0 }}
        transition={transition}
        inert={!open}
        className="sticky top-24 hidden h-[calc(100svh-7.5rem)] shrink-0 overflow-hidden lg:block"
      >
        <div className="relative h-full rounded-[28px] border border-foreground/10 bg-card" style={{ width: PANEL_WIDTH }}>
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-10 rounded-t-[28px] bg-gradient-to-b from-card to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-10 rounded-b-[28px] bg-gradient-to-t from-card to-transparent" />
          <div className="no-scrollbar h-full overflow-y-auto">
            <DescriptionContent item={item} className="p-8" />
          </div>
        </div>
      </motion.aside>
    </div>
  );
}

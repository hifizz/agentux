"use client";

import { Fragment, useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { CodeXml, Maximize, Minimize, X } from "lucide-react";
import { activeExample } from "@/lib/components";
import CodeDrawer from "./CodeDrawer";
import DescriptionContent from "./DescriptionContent";
import InstallBar from "./InstallBar";
import ThemeToggle from "../ThemeToggle";
import Tooltip from "../Tooltip";

const PANEL_SHIFT = 600;

type DescriptionPanelProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export function DescriptionPanel({ open, setOpen }: DescriptionPanelProps) {
  const pathname = usePathname();
  const item = activeExample(pathname);

  const [codeOpen, setCodeOpen] = useState(false);
  if (!item) return null;

  const toggleCode = () => {
    if (codeOpen) {
      setCodeOpen(false);
    } else {
      setOpen(true);
      setCodeOpen(true);
    }
  };

  return (
    <div className="pointer-events-none absolute right-0 top-0 z-40 h-full">
      <div
        data-chrome
        className="pointer-events-auto absolute right-4 top-4 z-50 flex items-stretch"
      >
        <InstallBar key={item.href} item={item} />

        <div className="flex items-center gap-2 rounded-r-2xl border border-l-0 border-black/[0.06] bg-muted p-2 shadow-sm dark:border-transparent dark:border-apple">
          <Tooltip label={open ? "Close description" : "Open description"}>
            <button
              type="button"
              onClick={() => {
                setCodeOpen(false);
                setOpen((v) => !v);
              }}
              aria-expanded={open}
              aria-label={open ? "Close description" : "Open description"}
              className="cursor-pointer rounded-full bg-popover p-1"
            >
              {open ? (
                <Maximize className="h-5 w-5" />
              ) : (
                <Minimize className="h-5 w-5" />
              )}
            </button>
          </Tooltip>

          <Tooltip label={codeOpen ? "Hide code" : "Get code"}>
            <button
              type="button"
              onClick={toggleCode}
              aria-label={codeOpen ? "Hide code" : "Get code"}
              className="cursor-pointer rounded-full bg-popover p-1"
            >
              {codeOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <CodeXml className="h-5 w-5" />
              )}
            </button>
          </Tooltip>

          <Tooltip label="Toggle theme" align="end">
            <ThemeToggle className="rounded-full p-1 bg-popover" />
          </Tooltip>
        </div>
      </div>

      <motion.div
        initial={false}
        inert={!open}
        aria-label={`${item.name} details`}
        role="complementary"
        animate={{ x: open ? 0 : PANEL_SHIFT }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="pointer-events-auto relative flex h-full w-[var(--info-width)] flex-col overflow-clip rounded-2xl bg-background"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-12 bg-gradient-to-b from-background to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-12 bg-gradient-to-t from-background to-transparent" />

        <Fragment key={item.href}>
          <div
            inert={codeOpen}
            className="no-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-y-contain"
          >
            <DescriptionContent item={item} className="p-8 pt-20" />
          </div>
          <CodeDrawer
            open={codeOpen}
            onClose={() => setCodeOpen(false)}
            item={item}
          />
        </Fragment>
      </motion.div>
    </div>
  );
}

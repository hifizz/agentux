"use client";

import { Fragment, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import ThemeToggle from "@/components/ThemeToggle";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

const links = [
  { label: "Home", href: "/" },
  { label: "Examples", href: "/examples/" },
];

const pill = "rounded-full border border-black/[0.06] bg-white/90 shadow-sm backdrop-blur-md dark:border-transparent dark:border-apple dark:bg-neutral-900/90";
const spring = { type: "spring", stiffness: 300, damping: 30 } as const;

export default function GooeyNavbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-5 z-50 flex justify-center px-4 sm:px-6 md:top-7">
      <motion.nav
        aria-label="Main navigation"
        layout={!reduceMotion}
        transition={spring}
        className={cn(
          "relative flex w-full max-w-3xl items-center justify-between gap-2",
          scrolled && "sm:w-auto",
        )}
      >
        <motion.div layout={!reduceMotion} transition={spring} className="pointer-events-auto">
          <Link href="/" className={cn(pill, "group flex h-10 items-center gap-2 px-2.5 sm:h-12 sm:px-4")}>
            <Image src={site.logo} alt="" width={22} height={22} className="motion-safe:transition-transform motion-safe:group-hover:-rotate-6" />
            <span className="text-sm font-bold tracking-tight text-foreground sm:text-base">{site.name}</span>
          </Link>
        </motion.div>

        <motion.div layout={!reduceMotion} transition={spring} className={cn(pill, "pointer-events-auto flex h-10 items-center px-1 sm:h-12 sm:px-2")}>
          {links.map((link, index) => {
            const active = link.href === "/" ? pathname === "/" : pathname.startsWith("/examples");
            return (
              <Fragment key={link.href}>
                {index > 0 && <span className="h-3 w-px bg-black/10 dark:bg-white/15" />}
                <Link
                  href={link.href}
                  aria-current={pathname === link.href ? "page" : active ? "location" : undefined}
                  className={cn("rounded-full px-2.5 py-2 text-xs font-medium transition-colors hover:text-foreground sm:px-3.5 sm:text-sm", active ? "text-foreground" : "text-muted-foreground")}
                >
                  {link.label}
                </Link>
              </Fragment>
            );
          })}
        </motion.div>

        <motion.div layout={!reduceMotion} transition={spring} className="pointer-events-auto">
          <ThemeToggle className={cn(pill, "grid size-10 place-items-center rounded-full p-0 hover:bg-neutral-100 sm:size-12 dark:hover:bg-neutral-800")} />
        </motion.div>
      </motion.nav>
    </header>
  );
}

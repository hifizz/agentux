import HeroCta from "@/components/HeroCta";
import HeroIntro from "@/components/HeroIntro";
import ComponentsShowcase from "@/components/ComponentsShowcase";
import { site } from "@/lib/site";

export default function Home() {
  return (
    <main id="main" className="flex-1">
      <section className="relative w-full p-1.5 md:p-2.5">
        <div
          className="turnframe-hero relative isolate flex min-h-[min(80svh,48rem)] w-full items-center justify-center overflow-hidden rounded-[40px] border border-foreground/[0.06] bg-[#f7f3ee] dark:border-transparent dark:border-apple dark:bg-[#151413] sm:min-h-[min(85svh,51rem)]"
          style={{ cornerShape: "squircle" } as React.CSSProperties}
        >
          <svg aria-hidden="true" className="hero-mark" viewBox="0 0 360 270" fill="none">
            <path d="M99 57h101a63 63 0 0 1 0 126h-45m0 0 36-36m-36 36 36 36M99 119v100" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="26" />
          </svg>
          <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center justify-center gap-4 px-5 pb-20 pt-28 text-center sm:gap-5 sm:px-6">
            <HeroIntro headline="UI for AI agents." sub={site.description}>
              <HeroCta />
            </HeroIntro>
          </div>
        </div>
      </section>
      <ComponentsShowcase />
    </main>
  );
}

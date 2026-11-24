"use client";

import Stage from "@/components/examples/Stage";
import { ModelMenu, SparkIcon } from "../_model-menu/model-menu";
import type { MenuModel } from "../_model-menu/types";
import { useModelMenuScript } from "../_model-menu/use-model-menu-script";
import { ArrowUpIcon } from "../_shared/ui/icons";

const MODELS: MenuModel[] = [
  {
    id: "vega-max",
    name: "Vega Max",
    tagline: "Toughest problems",
    stats: { speed: 2, quality: 5, cost: 5, price: 22, ttfb: { off: 2.4, low: 3.8, medium: 5.9, high: 9.2 } },
  },
  {
    id: "vega",
    name: "Vega",
    tagline: "Daily driver",
    stats: { speed: 4, quality: 4, cost: 3, price: 14, ttfb: { off: 1.0, low: 1.6, medium: 2.6, high: 4.1 } },
  },
  {
    id: "vega-air",
    name: "Vega Air",
    tagline: "Snappy and cheap",
    stats: { speed: 5, quality: 3, cost: 1, price: 3, ttfb: { off: 0.5, low: 0.7, medium: 1.2, high: 1.9 } },
  },
  { id: "auto", name: "Auto", tagline: "Routes each message", glyph: <SparkIcon /> },
];

export default function Demo() {
  const s = useModelMenuScript(MODELS, { value: "auto", thinking: false, effort: "medium", web: true });
  return (
    <Stage status="The menu loops on its own. Hover a row for its bars, flip extended thinking for the effort row, or pick a model." onReplay={s.replay}>
      <div className="mx-auto w-full max-w-[360px]">
        <div className="rounded-[10px] bg-card px-2.5 pb-2.5 pt-3.5 shadow-sm ring-1 ring-foreground/[0.06] dark:ring-white/10">
          <div className="px-1 pb-3.5 text-[13px] text-ch-ink-subtle">Ask anything…</div>
          <div className="flex items-center justify-between gap-2">
            <ModelMenu
              models={MODELS}
              value={s.value}
              onChange={s.change}
              open={s.open}
              onOpenChange={s.openChange}
              active={s.active}
              onActiveChange={s.activeChange}
              pointing={s.pointing}
              onPointingChange={s.pointingChange}
              thinking={s.thinking}
              onThinkingChange={s.thinkingChange}
              effort={s.effort}
              onEffortChange={s.effortChange}
              web={s.web}
              onWebChange={s.webChange}
            />
            <span className="grid size-7 shrink-0 place-items-center rounded-md bg-foreground/90 text-card" aria-hidden="true">
              <ArrowUpIcon />
            </span>
          </div>
        </div>
        <div className="h-[380px]" aria-hidden="true" />
      </div>
    </Stage>
  );
}

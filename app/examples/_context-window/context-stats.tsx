"use client";

import { useState } from "react";
import { cacheView, formatK, headroom, health, hitPct, hitTip, pct } from "./context-model";
import type { Prompt, PromptCache, SessionPoint } from "./types";
import { useRoll } from "./use-roll";

export function Rolled({ value, format = formatK, as: Tag = "span" }: { value: number; format?: (n: number) => string; as?: "span" | "b" }) {
  return <Tag>{format(useRoll(value))}</Tag>;
}

type StatsProps = {
  prompt: Prompt;
  live: boolean;
  cache?: PromptCache | null;
  liveCache?: PromptCache | null;
  points?: SessionPoint[];
};

export function ContextStats({ prompt, live, cache, liveCache, points }: StatsProps) {
  const window = prompt.window ?? 0;
  const full = window ? prompt.tokens / window : 0;
  const free = Math.max(0, window - prompt.tokens);
  const [tone, word] = health(full);
  const turns = window && points ? headroom(points, free) : null;
  const bits = window
    ? [`${pct(full)} full`, turns !== null ? (turns >= 999 ? "plenty of headroom" : `~${turns} requests of headroom`) : `${formatK(free)} free`]
    : [];
  const view = cacheView(cache, liveCache, prompt.counted !== false, live);
  const [cacheShown, setCacheShown] = useState(false);
  const showCache = !!(view.known || cacheShown || liveCache);
  if (showCache && !cacheShown) setCacheShown(true);
  const shown = view.shown;

  return (
    <div className="ctx-top">
      <div className="ctx-stat">
        <div className="ctx-k">
          <span>Context used</span>
          {window > 0 && <span className={`ctx-health ${tone}`}>{word}</span>}
        </div>
        <div className="ctx-big">
          <Rolled as="b" value={prompt.tokens} />
          <span>{window ? `/ ${formatK(window)} tokens` : "tokens"}</span>
        </div>
        <div className="ctx-sub">{window ? bits.join(" · ") : "the model's window isn't known"}</div>
      </div>
      {showCache && (
        <div className={`ctx-stat ctx-cache${view.tone ? ` ${view.tone}` : ""}`}>
          <div className="ctx-k">Prompt cache</div>
          <div className="ctx-big">
            <b title={hitTip(shown?.read, shown?.total)}>{shown ? hitPct(shown.read / shown.total) : "—"}</b>
            <span>hit</span>
          </div>
          <div className="ctx-bar"><i style={{ width: `${shown ? ((shown.read / shown.total) * 100).toFixed(1) : 0}%` }} /></div>
          <div className="ctx-sub">
            {view.known
              ? `${formatK(view.known.read)} cached · ${formatK(view.known.total - view.known.read)} new`
              : shown ? "The last request's · this one is on its way" : live ? "Read once the vendor answers" : "The vendor didn't say"}
          </div>
        </div>
      )}
    </div>
  );
}

export function ContextFigure({ prompt }: { prompt: Prompt }) {
  const window = prompt.window ?? 0;
  const [tone, word] = health(window ? prompt.tokens / window : 0);
  return (
    <div className="ctx-figure">
      <div className="ctx-big">
        <Rolled as="b" value={prompt.tokens} />
        <span>{window ? `of ${formatK(window)} tokens` : "tokens"}</span>
      </div>
      <span className="grow" />
      {window > 0 && <span className={`ctx-health ${tone}`} title={word}>{pct(prompt.tokens / window)}</span>}
    </div>
  );
}

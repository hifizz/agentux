"use client";

import { useMemo, useState, type ReactNode } from "react";
import { FocusContext } from "./context-focus";
import { PART_NAMES, PARTS, formatK, partOf, pct } from "./context-model";
import { ContextContents } from "./context-contents";
import { ContextLegend, ContextPartRows } from "./context-legend";
import { ContextFoot, ContextFree } from "./context-session";
import { ContextFigure, ContextStats, Rolled } from "./context-stats";
import { ContextViz } from "./context-viz";
import type { ContextLook, ContextTab, Focus, PartKind, Prompt, PromptCache, PromptItem, SessionPoint } from "./types";
import "./context-window.css";

export type ContextWindowProps = {
  prompt: Prompt;
  live?: boolean;
  layout?: "full" | "compact";
  title?: string;
  agent?: { name: string; icon?: ReactNode };
  model?: { id: string; icon?: ReactNode };
  cache?: PromptCache | null;
  liveCache?: PromptCache | null;
  session?: { points: SessionPoint[]; at?: string; crumbs?: string[]; onPoint?: (point: SessionPoint) => void };
  foldable?: boolean;
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  look?: ContextLook;
  defaultLook?: ContextLook;
  onLookChange?: (look: ContextLook) => void;
  tab?: ContextTab;
  defaultTab?: ContextTab;
  onTabChange?: (tab: ContextTab) => void;
  onSelectItem?: (part: PartKind, item?: PromptItem) => void;
  className?: string;
};

const STATE_WORDS = [["live", "Live"], ["counted", "Counted"], ["est", "Estimated"]] as const;

const STATE_TITLES = {
  live: "The request is on its way: the prompt is estimated from what the agent sent",
  counted: "As many tokens as the vendor counted; the parts are measured from the request and scaled to it",
  est: "Estimated from what the agent sent: the vendor didn't say how many tokens it read",
};

function StateRow({ state }: { state: keyof typeof STATE_TITLES }) {
  return (
    <span className={`ctx-state ${state}`} title={STATE_TITLES[state]}>
      <i />
      <span className="ctx-state-w">
        {STATE_WORDS.map(([id, word]) => <span key={id} className={id === state ? "on" : undefined} aria-hidden={id === state ? undefined : true}>{word}</span>)}
      </span>
    </span>
  );
}

function StackBar({ prompt }: { prompt: Prompt }) {
  const window = prompt.window ?? 0;
  const scale = Math.max(window, prompt.tokens, 1);
  return (
    <span className="ctx-stack" role="img" aria-label={`${formatK(prompt.tokens)} of ${formatK(window || prompt.tokens)} tokens used`}>
      {PARTS.map((kind) => (
        <i key={kind} className={`k-${kind}`} title={PART_NAMES[kind]} style={{ width: `${+((Math.max(0, partOf(prompt, kind)?.tokens ?? 0) / scale) * 100).toFixed(2)}%` }} />
      ))}
    </span>
  );
}

const CHEVRON = <svg viewBox="0 0 16 16" width="10" height="10" aria-hidden="true"><path d="m5.5 6.8 2.5 2.5 2.5-2.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>;

export function ContextWindow({
  prompt, live = false, layout = "full", title = "Context window", agent, model, cache, liveCache, session, foldable = false,
  collapsed, defaultCollapsed = false, onCollapsedChange, look, defaultLook = "map", onLookChange, tab, defaultTab = "all", onTabChange, onSelectItem, className,
}: ContextWindowProps) {
  const [innerCollapsed, setInnerCollapsed] = useState(defaultCollapsed);
  const [innerLook, setInnerLook] = useState<ContextLook>(defaultLook);
  const [innerTab, setInnerTab] = useState<ContextTab>(defaultTab);
  const [focus, setFocus] = useState<Focus>(null);
  const compact = layout === "compact";
  const shut = foldable && !compact && (collapsed === undefined ? innerCollapsed : collapsed);
  const currentLook = look === undefined ? innerLook : look;
  const wanted = tab === undefined ? innerTab : tab;
  const currentTab = wanted === "all" || (partOf(prompt, wanted)?.tokens ?? 0) > 0 ? wanted : "all";
  const state = live ? "live" : prompt.counted === false ? "est" : "counted";
  const window = prompt.window ?? 0;
  const focusValue = useMemo(() => ({ focus, setFocus }), [focus]);

  const fold = () => {
    const next = !shut;
    setInnerCollapsed(next);
    setFocus(null);
    onCollapsedChange?.(next);
  };
  const pickLook = (next: ContextLook) => {
    setInnerLook(next);
    setFocus(null);
    onLookChange?.(next);
  };
  const pickTab = (next: ContextTab) => {
    setInnerTab(next);
    onTabChange?.(next);
  };

  const root = `cw${className ? ` ${className}` : ""}`;

  if (compact) {
    const who = model ?? (agent && { id: agent.name, icon: agent.icon });
    return (
      <FocusContext.Provider value={focusValue}>
        <section className={`${root} cw-compact`} aria-label={title}>
          <div className="ctx-card">
            <div className="ctx-head">
              <span className="ctx-title">{title}</span>
              <span className="grow" />
              {who && (
                <span className="ctx-state ctx-model-pill">
                  {who.icon && <span className="ic">{who.icon}</span>}
                  <span className="ctx-model-id">{who.id}</span>
                </span>
              )}
            </div>
            <ContextFigure prompt={prompt} />
            <ContextViz prompt={prompt} look="grid" />
            <ContextPartRows prompt={prompt} />
            {window > 0 && <ContextFree prompt={prompt} />}
          </div>
        </section>
      </FocusContext.Provider>
    );
  }

  return (
    <FocusContext.Provider value={focusValue}>
      <section className={root} aria-label={title}>
        <div className={`ctx-card${shut ? " shut" : ""}`}>
          <div className="ctx-head">
            {foldable ? (
              <button type="button" className="ctx-fold" aria-expanded={!shut} onClick={fold}>
                <span className="tw">{CHEVRON}</span>
                <span className="ctx-title">{title}</span>
              </button>
            ) : <span className="ctx-title">{title}</span>}
            {foldable && (
              <>
                <span className="ctx-short">
                  <Rolled value={prompt.tokens} />{window ? ` / ${formatK(window)} · ${pct(prompt.tokens / window)}` : ""}
                </span>
                <StackBar prompt={prompt} />
              </>
            )}
            <span className="grow" />
            <span className="ctx-end">
              <span className="ctx-route">
                {agent && (
                  <span className="ctx-who">
                    {agent.icon && <span className="ic">{agent.icon}</span>}
                    <span className="ctx-who-n">{agent.name}</span>
                  </span>
                )}
                {model && (
                  <>
                    {agent && <span className="ctx-sep">›</span>}
                    <span className="ctx-what">
                      {model.icon && <span className="ic">{model.icon}</span>}
                      <code className="ctx-model">{model.id}</code>
                    </span>
                  </>
                )}
              </span>
              <StateRow state={state} />
            </span>
          </div>
          {!shut && (
            <>
              <ContextStats prompt={prompt} live={live} cache={cache} liveCache={liveCache} points={session?.points} />
              <ContextViz prompt={prompt} look={currentLook} onSelectItem={onSelectItem} />
              <ContextLegend prompt={prompt} look={currentLook} onLook={pickLook} onSelectItem={onSelectItem} />
              <ContextContents prompt={prompt} tab={currentTab} onTab={pickTab} onSelectItem={onSelectItem} />
              <ContextFoot prompt={prompt} session={session} agentName={agent?.name} />
            </>
          )}
        </div>
      </section>
    </FocusContext.Provider>
  );
}

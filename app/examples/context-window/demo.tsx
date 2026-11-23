"use client";

import { useState } from "react";
import Stage from "@/components/examples/Stage";
import { ContextWindow } from "../_context-window/context-window";
import { FINAL_CACHE, REQUESTS, REQUEST_CACHES, SESSION } from "../_context-window/script";
import { useContextScript } from "../_context-window/use-context-script";
import { ClaudeMark, PiMark } from "./marks";

type View = "full" | "collapsed" | "compact";

const VIEWS: { id: View; label: string }[] = [
  { id: "full", label: "Full" },
  { id: "collapsed", label: "Collapsed" },
  { id: "compact", label: "Compact" },
];

export default function Demo() {
  const [view, setView] = useState<View>("full");
  const { index, live, replay } = useContextScript();
  const prompt = { ...REQUESTS[index], counted: !live };
  const last = index === REQUESTS.length - 1 && !live;
  const cache = live ? null : last ? FINAL_CACHE : REQUEST_CACHES[index];
  const liveCache = index > 0 ? REQUEST_CACHES[index - 1] : null;
  const points = SESSION.slice(0, Math.max(2, Math.round((SESSION.length * (index + 1)) / REQUESTS.length)));

  return (
    <Stage
      wide
      status="Each request is estimated while it is live, then counted. Pick a presentation on the toolbar."
      onReplay={replay}
      actions={VIEWS.map(({ id, label }) => ({ label, pressed: view === id, onClick: () => setView(id) }))}
    >
      <div className={`mx-auto w-full ${view === "compact" ? "max-w-sm" : "max-w-3xl"}`}>
        <ContextWindow
          prompt={prompt}
          live={live}
          layout={view === "compact" ? "compact" : "full"}
          agent={{ name: "Pi", icon: <PiMark /> }}
          model={{ id: "claude-opus-5", icon: <ClaudeMark /> }}
          cache={cache}
          liveCache={liveCache}
          session={{ points, at: points[points.length - 1].id, crumbs: ["Pi", "reni"] }}
          foldable={view !== "compact"}
          collapsed={view === "collapsed"}
          onCollapsedChange={(next) => setView(next ? "collapsed" : "full")}
        />
      </div>
    </Stage>
  );
}

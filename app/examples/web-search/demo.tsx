"use client";

import { useEffect, useState } from "react";
import Stage from "@/components/examples/Stage";
import { Citation, SourceList, WebSearch, type SearchSource } from "../_message/web-search";

const SOURCES: SearchSource[] = [
  { id: "a", title: "Streaming text in React without jank", url: "https://react.dev/blog/streaming-text", snippet: "Batch incoming tokens and reveal them on animation frames to avoid layout thrash.", date: "Mar 2026" },
  { id: "b", title: "requestAnimationFrame timing", url: "https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame", snippet: "The callback receives a timestamp of when the frame started.", date: "Jan 2026" },
  { id: "c", title: "Designing chat interfaces for LLMs", url: "https://www.nngroup.com/articles/ai-chat-ui", snippet: "Users read streamed answers more comfortably when the pace is steady.", date: "Feb 2026" },
  { id: "d", title: "prefers-reduced-motion", url: "https://web.dev/articles/prefers-reduced-motion", snippet: "Respect the user preference by removing non-essential animation." },
  { id: "e", title: "Token buffering in AI SDKs", url: "https://sdk.vercel.ai/docs/smooth-stream", snippet: "Smooth streaming chunks text by word or line and delays between chunks." },
];
const QUERIES = ["smooth token streaming react", "requestAnimationFrame text reveal", "chat ui reading pace"];

export default function Demo() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (step >= SOURCES.length + 1) return;
    const t = window.setTimeout(() => setStep((s) => s + 1), 600);
    return () => window.clearTimeout(t);
  }, [step]);
  const done = step > SOURCES.length;
  const found = SOURCES.slice(0, Math.min(step, SOURCES.length));
  const queries = QUERIES.slice(0, Math.min(QUERIES.length, 1 + Math.floor(step / 2)));
  return (
    <Stage status={done ? "Hover a citation to preview the source" : "Searching"} onReplay={() => setStep(0)}>
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-6 py-8">
        <WebSearch queries={queries} sources={found} status={done ? "done" : "searching"} />
        {done && (
          <div className="flex flex-col gap-4">
            <p className="text-ch-body leading-7 text-ch-ink">
              Buffer incoming tokens and reveal them on each animation frame
              <Citation index={1} source={SOURCES[0]} />
              <Citation index={2} source={SOURCES[1]} />. A steady pace is easier to read than bursts
              <Citation index={3} source={SOURCES[2]} />, and with reduced motion the text should appear at once
              <Citation index={4} source={SOURCES[3]} />.
            </p>
            <SourceList sources={SOURCES} />
          </div>
        )}
      </div>
    </Stage>
  );
}

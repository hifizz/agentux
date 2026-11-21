"use client";

import { lazy, Suspense } from "react";

const PiMarkdown = lazy(() => import("../markdown"));

export function TextBlock({ text, streaming }: { text: string; streaming: boolean }) {
  return (
    <Suspense fallback={<p className="bubble-plain">{text}</p>}>
      <PiMarkdown text={text} streaming={streaming} />
    </Suspense>
  );
}

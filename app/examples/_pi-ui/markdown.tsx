"use client";

import { Markdown } from "@pierre/words/react";
import { createHighlightsPlugin } from "@pierre/words/highlights";
import dark from "@pierre/highlights/themes/pierre-dark";
import light from "@pierre/highlights/themes/pierre-light";
import "@pierre/words/styles.css";
import "./ai-message-bubble.markdown.css";

const PLUGINS = { code: createHighlightsPlugin({ themes: { light, dark }, defaultColor: "light-dark()" }) };

const COMPONENTS = { a: (html: string) => html.replace("<a ", '<a target="_blank" rel="noopener noreferrer" ') };

const BLOCKED = ["img"];
const CONTROLS = { code: { copy: true, download: false } };

export default function PiMarkdown({ text, streaming }: { text: string; streaming: boolean }) {
  return (
    <Markdown
      mode={streaming ? "streaming" : "static"}
      isAnimating={streaming}
      animated={streaming ? { animation: "fadeIn", duration: 180 } : false}
      plugins={PLUGINS}
      components={COMPONENTS}
      disallowedElements={BLOCKED}
      controls={CONTROLS}
      lineNumbers={false}
      cjk
    >
      {text}
    </Markdown>
  );
}

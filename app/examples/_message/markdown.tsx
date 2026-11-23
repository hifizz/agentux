"use client";

import { Markdown as Words } from "@pierre/words/react";
import { createHighlightsPlugin } from "@pierre/words/highlights";
import dark from "@pierre/highlights/themes/pierre-dark";
import light from "@pierre/highlights/themes/pierre-light";
import "@pierre/words/styles.css";
import "../_pi-ui/ai-message-bubble.css";
import "../_pi-ui/ai-message-bubble.markdown.css";
import "./message.css";
import { cx } from "@/app/examples/_shared/ui/cx";

const PLUGINS = { code: createHighlightsPlugin({ themes: { light, dark }, defaultColor: "light-dark()" }) };
const COMPONENTS = { a: (html: string) => html.replace("<a ", '<a target="_blank" rel="noopener noreferrer" ') };
const CONTROLS = { code: { copy: true, download: false } };

export type MarkdownProps = {
  children: string;
  streaming?: boolean;
  images?: boolean;
  size?: "body" | "small";
  className?: string;
};

export function Markdown({ children, streaming = false, images = false, size = "body", className }: MarkdownProps) {
  return (
    <div className={cx("ai-message-bubble tf-md", size === "small" && "tf-md-small", className)}>
      <Words
        mode={streaming ? "streaming" : "static"}
        isAnimating={streaming}
        animated={streaming ? { animation: "fadeIn", duration: 180 } : false}
        plugins={PLUGINS}
        components={COMPONENTS}
        disallowedElements={images ? [] : ["img"]}
        controls={CONTROLS}
        lineNumbers={false}
        cjk
      >
        {children}
      </Words>
    </div>
  );
}

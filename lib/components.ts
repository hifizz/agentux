import type { ReactNode } from "react";
import ComposerPreview from "@/components/gallery/ComposerPreview";

export type Example = {
  name: string;
  href: string;
  category: string;
  description: string;
  preview?: () => ReactNode;
};

export const promptComposer = {
  name: "Prompt Composer",
  href: "/examples/prompt-composer/",
  category: "Composer · Chat",
  description: "Compose a prompt, set the depth of a reply, and follow the conversation as it streams.",
  preview: ComposerPreview,
} satisfies Example;

export const examples: Example[] = [promptComposer];

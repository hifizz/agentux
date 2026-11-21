import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const merge = extendTailwindMerge({
  extend: {
    classGroups: {
      rounded: [{ rounded: ["ch-badge", "ch-control", "ch-field", "ch-card", "ch-panel"] }],
      "font-size": [{ text: ["ch-micro", "ch-caption", "ch-body", "ch-title", "ch-metric"] }],
      shadow: [{ shadow: ["ch-chip", "ch-card", "ch-pop", "ch-modal", "ch-bar"] }],
    },
  },
});

export const cx = (...inputs: ClassValue[]) => merge(clsx(inputs));

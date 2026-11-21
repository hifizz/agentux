import type { Transition } from "motion/react";

export const EASE_MORPH = [0.5, 0, 0.1, 1] as const;
export const EASE_OUT_STRONG = [0.23, 1, 0.32, 1] as const;

export const BLUR_IN = {
  from: { opacity: 0, filter: "blur(1.5px)" },
  to: { opacity: 1, filter: "blur(0px)" },
} as const;

export const STEP_STAGGER = 0.045;

export const TIMING = {
  afterParagraph: 320,
  stepsSpin: 700,
  stepWork: 520,
  stepMorph: 380,
  editWork: 380,
  runWork: 1500,
  handover: 420,
} as const;

export const instant: Transition = { duration: 0 };

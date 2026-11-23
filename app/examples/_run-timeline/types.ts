export type StepKind = "llm" | "tool" | "agent";

export type BarKind = StepKind | "error";

export type StepStatus = "running" | "done" | "failed";

export type Step = {
  id: string;
  label: string;
  kind: StepKind;
  start: number;
  duration: number;
  parentId?: string;
  tool?: string;
  failed?: boolean;
  mark?: { pattern: string; color: string };
};

export type StepView = {
  step: Step;
  depth: number;
  elapsed: number;
  status: StepStatus;
  bar: BarKind;
};

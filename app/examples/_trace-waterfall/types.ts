import type { Axis, TagSide } from "../_trace-kit/axis";

export type SpanKind = "agent" | "subagent" | "llm" | "tool";

export type SpanStatus = "running" | "done" | "failed";

export type IconKey = "bot" | "sparkle" | "search" | "database" | "file" | "chart" | "terminal" | "slides" | "message" | "folder";

export type Span = {
  id: string;
  parentId: string | null;
  kind: SpanKind;
  title: string;
  detail?: string;
  icon?: IconKey;
  start: number;
  duration: number;
  cost?: number;
  tokensIn?: number;
  tokensOut?: number;
  failed?: boolean;
  input?: string;
  error?: string;
};

export type SpanMark = {
  id: string;
  kind: SpanKind;
  start: number;
  duration: number;
};

export type SpanView = {
  span: Span;
  depth: number;
  status: SpanStatus;
  elapsed: number;
  cost: number;
  tokensIn: number;
  tokensOut: number;
  childCount: number;
  marks: SpanMark[];
  slowest: boolean;
  side: TagSide;
};

export type TraceTotals = {
  duration: number;
  cost: number;
  tokens: number;
  llmCalls: number;
  toolCalls: number;
  errors: number;
};

export type TraceView = {
  rows: SpanView[];
  totals: TraceTotals;
  axis: Axis;
  now: number;
  done: boolean;
};

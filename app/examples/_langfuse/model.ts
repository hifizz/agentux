export type NodeKind = "agent" | "generation" | "tool" | "span" | "chain" | "retriever" | "evaluator" | "embedding" | "guardrail" | "event";

export type NodeStatus = "running" | "ok" | "warning" | "error";

// input excludes cached tokens and total sums every bucket
export type Tokens = { input: number; output: number; total: number; cached?: number };

export type TraceNode = {
  id: string;
  parentId: string | null;
  childIds: string[];
  depth: number;
  kind: NodeKind;
  type: string;
  name: string;
  start: number;
  duration: number;
  status: NodeStatus;
  failure: "origin" | "propagated" | null;
  statusMessage?: string;
  model?: string;
  tokens?: Tokens;
  cost: number | null;
  ttft?: number;
  input?: string;
  output?: string;
};

export type TraceTotals = {
  nodes: number;
  generations: number;
  tools: number;
  errors: number;
  failedNodes: number;
  warnings: number;
  tokens: Tokens | null;
  cost: number | null;
  models: string[];
};

export type Trace = {
  id: string;
  name: string;
  startedAt: number;
  duration: number;
  running: boolean;
  environment?: string;
  userId?: string;
  sessionId?: string;
  release?: string;
  tags: string[];
  nodes: TraceNode[];
  rootIds: string[];
  totals: TraceTotals;
};

export type Session = {
  id: string | null;
  startedAt: number;
  duration: number;
  traces: Trace[];
  totals: TraceTotals;
};

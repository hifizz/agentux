export type AgentId = string;

export type Agent = {
  id: AgentId;
  name: string;
  model?: string;
  color?: string;
  pattern: string;
  you?: boolean;
};

export type Preview =
  | { type: "doc"; title: string; lines: string[] }
  | { type: "sheet"; title: string; head: string[]; rows: string[][] }
  | { type: "tree"; title: string; items: { name: string; depth: number; folder?: boolean }[] };

export type FileKind = "file" | "folder" | "frame" | "pr" | "tool";

export type FileRef = {
  id: string;
  label: string;
  kind: FileKind;
  preview?: Preview;
};

export type MessageDetails = {
  facts: [label: string, value: string][];
  items?: { label: string; detail: string; icon?: string }[];
};

export type Recipient = AgentId | "everyone";

export type Message = {
  kind: "message";
  id: string;
  from: AgentId;
  to: Recipient;
  quote?: string;
  text: string;
  time: string;
  status: "typing" | "done";
  tag?: string;
  needsYou?: boolean;
  files?: FileRef[];
  details?: MessageDetails;
};

export type SystemNote = {
  kind: "system";
  id: string;
  actor: AgentId;
  verb: string;
  target: AgentId;
};

export type StreamItem = Message | SystemNote;

export type StepStatus = "done" | "active" | "pending";

export type PlanStep = {
  id: string;
  title: string;
  status: StepStatus;
  seconds?: number;
  agents: AgentId[];
};

export type ContextSegment = {
  id: string;
  label: string;
  tokens: number;
  color: string;
};

export type ContextState = {
  window: number;
  model: string;
  segments: ContextSegment[];
};

export type SessionState = {
  visible: AgentId[];
  items: StreamItem[];
  steps: PlanStep[];
  context: ContextState;
};

export type Draft = {
  to: Recipient;
  text: string;
  quote?: string;
};

export type ScriptEvent = { at: number } & (
  | { type: "add"; item: StreamItem }
  | { type: "say"; id: string; patch?: Partial<Message> }
  | { type: "reveal"; agent: AgentId }
  | { type: "step"; id: string; status: StepStatus; seconds?: number }
  | { type: "tokens"; values: Record<string, number> }
);

type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;

export type EventBody = DistributiveOmit<ScriptEvent, "at">;

export type Script = {
  agents: Agent[];
  initial: SessionState;
  events: ScriptEvent[];
  duration: number;
  agentCount: number;
  startSeconds: number;
};

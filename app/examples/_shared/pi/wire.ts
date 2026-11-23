import type { ModelCard, ModelSelection } from "@/app/examples/_shared/models";
import type { PermissionMode } from "@/app/examples/_shared/permission";
import type { ConversationView, EntryId, EntryRecord, JsonObject, TaskGraph } from "@earendil-works/pi-durable";


export type PiSnapshot = ConversationView;

export const PI_API = {
  stream: "/api/pi/stream",
  submit: "/api/pi/submit",
  abort: "/api/pi/abort",
  reset: "/api/pi/reset",
  continue: "/api/pi/continue",
  respond: "/api/pi/respond",
  entries: "/api/pi/entries",
  models: "/api/pi/models",
  configure: "/api/pi/configure",
  permission: "/api/pi/permission",
  withdraw: "/api/pi/withdraw",
} as const;

export type PiTarget = { readonly conversationId?: number };

export type PiSubmitBody = PiTarget & {
  readonly text: string;
  readonly requestId: string;
  readonly whenBusy?: "steer" | "followUp";
};

export type PiConfigureBody = PiTarget & { readonly selection: ModelSelection };

export type PiPermissionBody = { readonly mode: PermissionMode };

export type PiWithdrawBody = PiTarget & { readonly submissionId: number };

export type PiModelsReply = { readonly ok: true; readonly models: readonly ModelCard[] } | { readonly ok: false; readonly error: string };

export type PiReply = { readonly ok: true } | { readonly ok: false; readonly error: string };

export type PiEntriesReply =
  | { readonly ok: true; readonly entries: readonly EntryRecord[]; readonly before?: EntryId }
  | { readonly ok: false; readonly error: string };


export type PiInteractionRequest =
  | { readonly kind: "approval"; readonly tool: string; readonly arguments: JsonObject }
  | { readonly kind: "question"; readonly question: string; readonly options: string[] };

export type PiApprovalRequest = Extract<PiInteractionRequest, { readonly kind: "approval" }>;

export type PiAnswer =
  | { readonly kind: "approval"; readonly allow: boolean;readonly always: boolean }
  | { readonly kind: "question"; readonly text: string };

export type PiInteraction = {
  readonly id: string;
  readonly conversationId: number;
  readonly callId: string;
  readonly taskId: number;
  readonly createdAt: number;
  readonly request: PiInteractionRequest;
  readonly state: { readonly status: "pending" } | { readonly status: "answered"; readonly answeredAt: number; readonly answer: PiAnswer };
};

export type PiRespondBody = { readonly id: string; readonly answer: PiAnswer };


export type PiAgent = {
  readonly id: number;
  readonly parent: number;
  readonly name: string;
  readonly task: string;
  readonly mode: "foreground" | "background";
  readonly status: "working" | "idle" | "failed" | "stopped";
  readonly createdAt: number;
};

export const PI_REPORT_KIND = "app.agent-report";
export type PiAgentReport = { readonly agentId: number; readonly name: string; readonly ok: boolean; readonly text: string };

export type PiOverview = {
  readonly agents: readonly PiAgent[];
  readonly tasks: TaskGraph;
  readonly labels: Readonly<Record<string, string>>;
  readonly interactions: readonly PiInteraction[];
  readonly permission: PermissionMode;
  readonly workspace?: string;
};

import type { AssistantMessage, JsonValue, ToolCall } from "@earendil-works/pi-ai";
import type { EntryRecord, ToolDiagnostic, ToolSlot } from "@earendil-works/pi-durable";
import type { ToolResultRef, TranscriptIndex } from "../_pi-ui/model";

const USAGE: AssistantMessage["usage"] = {
  input: 0,
  output: 0,
  cacheRead: 0,
  cacheWrite: 0,
  totalTokens: 0,
  cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 },
};

export function assistant(content: AssistantMessage["content"], extra: Partial<AssistantMessage> = {}): AssistantMessage {
  return { role: "assistant", content, api: "anthropic-messages", provider: "anthropic", model: "claude-opus-5", usage: USAGE, stopReason: "stop", timestamp: 0, ...extra };
}

export const usage = (totalTokens: number): AssistantMessage["usage"] => ({ ...USAGE, totalTokens });

export function call(id: string, name: string, args: ToolCall["arguments"]): ToolCall {
  return { type: "toolCall", id, name, arguments: args };
}

export function result(callId: string, toolName: string, text: string, extra: { details?: JsonValue; isError?: boolean; diagnostics?: ToolDiagnostic[] } = {}): ToolResultRef {
  const message = { role: "toolResult" as const, toolCallId: callId, toolName, content: [{ type: "text" as const, text }], details: extra.details, isError: extra.isError ?? false, timestamp: 0 };
  const entry = { id: 1, conversationId: 1, kind: "tool-result", model: [message], data: extra.diagnostics ? { diagnostics: extra.diagnostics } : undefined } as unknown as EntryRecord;
  return { entry, message };
}

export function slot(callId: string, name: string, status: ToolSlot["status"], output?: string): ToolSlot {
  return { callId, name, status, output };
}

export function index(results: readonly ToolResultRef[] = [], slots: readonly ToolSlot[] = []): TranscriptIndex {
  return {
    results: new Map(results.map((r) => [r.message.toolCallId, r])),
    calls: new Set([...results.map((r) => r.message.toolCallId), ...slots.map((s) => s.callId)]),
    slots: new Map(slots.map((s) => [s.callId, s])),
    nested: new Map(),
  };
}

import type { AssistantMessage, JsonObject, Message, ToolResultMessage } from "@earendil-works/pi-ai";
import type { AgentState, EntryRecord, InboxState, LiveState, NestedToolSlot, ToolSlot, UsageState } from "@earendil-works/pi-durable";
import type { ModelSelection } from "@/app/examples/_shared/models";
import type { PiSnapshot } from "@/app/examples/_shared/pi/wire";


function doc<T>(view: PiSnapshot, name: string): T | undefined {
  return view.docs[name] as unknown as T | undefined;
}
export const liveOf = (view: PiSnapshot) => doc<LiveState>(view, "pi.live") ?? {};
export const inboxOf = (view: PiSnapshot) => doc<InboxState>(view, "pi.inbox")?.items ?? [];
export const usageOf = (view: PiSnapshot) => doc<UsageState>(view, "pi.usage");
export const modelOf = (view: PiSnapshot) => doc<AgentState>(view, "pi.agent")?.model?.modelId;
export function selectionOf(view: PiSnapshot): ModelSelection | undefined {
  const agent = doc<AgentState>(view, "pi.agent");
  return agent?.model ? { key: `${agent.model.provider}/${agent.model.modelId}`, effort: agent.thinkingLevel ?? "off" } : undefined;
}

export type ToolResultRef = { readonly entry: EntryRecord; readonly message: ToolResultMessage };

export type TranscriptIndex = {
  readonly results: ReadonlyMap<string, ToolResultRef>;
  readonly calls: ReadonlySet<string>;
  readonly slots: ReadonlyMap<string, ToolSlot>;
  readonly nested: ReadonlyMap<string, readonly NestedToolSlot[]>;
};

export function indexTranscript(entries: readonly EntryRecord[], live: LiveState): TranscriptIndex {
  const results = new Map<string, ToolResultRef>();
  const calls = new Set<string>();
  for (const entry of entries) {
    for (const message of entry.model ?? []) {
      if (message.role === "toolResult") results.set(message.toolCallId, { entry, message });
      if (message.role === "assistant") for (const block of message.content) if (block.type === "toolCall") calls.add(block.id);
    }
  }
  const partial = live.generation?.message as unknown as AssistantMessage | undefined;
  for (const block of partial?.content ?? []) if (block.type === "toolCall") calls.add(block.id);
  const nested = new Map<string, NestedToolSlot[]>();
  for (const slot of live.nestedTools ?? []) nested.set(slot.parentCallId, [...(nested.get(slot.parentCallId) ?? []), slot]);
  return { results, calls, slots: new Map((live.tools ?? []).map((slot) => [slot.callId, slot])), nested };
}

export const partialOf = (live: LiveState) => live.generation?.message as unknown as AssistantMessage | undefined;

export function textOf(content: string | readonly { readonly type: string; readonly text?: string }[]): string {
  if (typeof content === "string") return content;
  return content.map((block) => (block.type === "text" ? block.text ?? "" : `[${block.type}]`)).join("");
}

export const formatTokens = (n: number) => (n < 1000 ? `${n}` : `${(n / 1000).toFixed(1)}k`);

export function isHiddenEntry(entry: EntryRecord, index: TranscriptIndex): boolean {
  if (entry.kind === "pi.system") return true;
  return entry.kind === "pi.tool-result" && (entry.model ?? []).every((m) => m.role === "toolResult" && index.calls.has(m.toolCallId));
}

export function totalTokens(usage: UsageState | undefined): number {
  return Object.values(usage?.models ?? {}).reduce((sum, u) => sum + u.totalTokens, 0);
}

export function isJsonObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export type { Message };

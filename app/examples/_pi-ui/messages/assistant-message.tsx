import type { AssistantMessage as Assistant, ToolCall } from "@earendil-works/pi-ai";
import "../ai-message-bubble.css";
import { ThinkingBlock } from "../blocks/thinking-block";
import { TextBlock } from "../blocks/text-block";
import { ToolStepList } from "../blocks/tool-steps";
import type { ToolView } from "../contracts";
import { formatTokens, type TranscriptIndex } from "../model";
import { MessageActions } from "./message-actions";

const NOTICE: Partial<Record<Assistant["stopReason"], string>> = {
  length: "Answer cut off at the output limit",
  aborted: "Stopped before finishing",
};

export function toolViewOf(block: ToolCall, index: TranscriptIndex): ToolView {
  return {
    callId: block.id,
    name: block.name,
    arguments: block.arguments,
    argumentsError: block.argumentsError,
    slot: index.slots.get(block.id),
    nested: index.nested.get(block.id),
    result: index.results.get(block.id),
  };
}

type Group = { kind: "block"; at: number } | { kind: "tools"; calls: ToolCall[] };
function groupBlocks(content: Assistant["content"]): Group[] {
  const groups: Group[] = [];
  content.forEach((block, at) => {
    if (block.type !== "toolCall") return void groups.push({ kind: "block", at });
    const last = groups.at(-1);
    if (last?.kind === "tools") last.calls.push(block);
    else groups.push({ kind: "tools", calls: [block] });
  });
  return groups;
}

export function AssistantMessage({ message, index, streaming }: { message: Assistant; index: TranscriptIndex; streaming: boolean }) {
  const notice = NOTICE[message.stopReason] ?? (message.stopReason === "error" ? (message.errorMessage ?? "Model error") : undefined);
  const last = message.content.length - 1;
  const showMeta = !streaming && message.durationMs !== undefined && message.stopReason !== "toolUse";
  const text = message.content.flatMap((block) => (block.type === "text" ? [block.text] : [])).join("\n\n");
  return (
    <div className="ai-message-bubble flex flex-col">
      {groupBlocks(message.content).map((group) => {
        if (group.kind === "tools") {
          return <ToolStepList key={group.calls[0].id} tools={group.calls.map((call) => toolViewOf(call, index))} streaming={streaming} />;
        }
        const block = message.content[group.at];
        if (block.type === "thinking") return <ThinkingBlock key={group.at} block={block} streaming={streaming && group.at === last} />;
        if (block.type === "text") return <TextBlock key={group.at} text={block.text} streaming={streaming && group.at === last} />;
        return null;
      })}
      {notice && <p className="bubble-notice">{notice}</p>}
      {showMeta && (
        <div className="bubble-footer">
          {text !== "" && <MessageActions text={text} />}
          <p className="bubble-meta ch-mono">
            {message.model} · {formatTokens(message.usage.totalTokens)} tokens · {((message.durationMs ?? 0) / 1000).toFixed(1)}s
          </p>
        </div>
      )}
    </div>
  );
}

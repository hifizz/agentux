"use client";

import { useContext, type ReactNode } from "react";
import { Bot, ChevronRight, Code, FileText, Globe, ListChecks, MessageCircleQuestion, Plug, SquareFunction, SquareTerminal, type LucideIcon } from "lucide-react";
import type { ImageContent, TextContent } from "@earendil-works/pi-ai";
import { cx } from "@/app/examples/_shared/ui/cx";
import type { PiRenderers, ToolCategory, ToolPresentation, ToolView } from "../contracts";
import { isJsonObject } from "../model";
import { RawToggle } from "../raw-inspector";
import { PanelHostContext, RenderersContext, ToolOpenContext } from "../renderers";
import { diagnosticsOf } from "../tools/decode";
import { BubbleCollapse } from "./bubble-collapse";


const ICON: Record<ToolCategory, LucideIcon> = {
  file: FileText,
  shell: SquareTerminal,
  script: Code,
  web: Globe,
  mcp: Plug,
  agent: Bot,
  ask: MessageCircleQuestion,
  plan: ListChecks,
  other: SquareFunction,
};

type Status = "pending" | "running" | "failed" | "done" | "cancelled" | "unknown";

function statusOf(tool: ToolView): Status {
  if (tool.result) return tool.result.message.isError ? "failed" : "done";
  if (tool.outcome) return tool.outcome === "ok" ? "done" : tool.outcome === "error" ? "failed" : tool.outcome;
  if (tool.slot) return tool.slot.status === "done" ? "done" : tool.slot.status === "running" ? "running" : "pending";
  return "unknown";
}

const KEYS = ["query", "q", "url", "path", "command", "prompt", "text", "name"];
function summary(tool: ToolView): string {
  const args = tool.arguments;
  if (!args) return tool.argsText ?? "";
  const values = Object.entries(args);
  const known = KEYS.map((key) => args[key]).find((value) => typeof value === "string");
  if (typeof known === "string") return known;
  const queries = queriesOf(args.queries);
  if (queries) return queries;
  const first = values.map(([, value]) => value).find((value) => typeof value === "string");
  if (typeof first === "string") return first;
  return values
    .filter(([, value]) => typeof value === "number" || typeof value === "boolean")
    .map(([key, value]) => `${key}: ${value}`)
    .join(" ");
}

function queriesOf(value: unknown): string | undefined {
  if (!Array.isArray(value)) return undefined;
  const texts = value.flatMap((item): string[] => (typeof item === "string" ? [item] : isJsonObject(item) && typeof item.query === "string" ? [item.query] : []));
  return texts.length > 0 ? texts.join(" · ") : undefined;
}

function Output({ content }: { content: readonly (TextContent | ImageContent)[] }) {
  return (
    <div className="flex flex-col gap-1.5">
      {content.map((block, i) =>
        block.type === "text" ? (
          <pre key={i} className="bubble-code bubble-code-output">
            {block.text}
          </pre>
        ) : (
          <img key={i} alt="Tool output" src={`data:${block.mimeType};base64,${block.data}`} className="max-h-60 w-fit rounded-ch-field border border-ch-line-soft" />
        ),
      )}
    </div>
  );
}

function Detail({ tool, special }: { tool: ToolView; special: ReactNode }) {
  const diagnostics = diagnosticsOf(tool);
  const live = tool.slot?.output;
  return (
    <div className="bubble-box">
      <div className="bubble-box-body">
        {tool.argumentsError && <p className="bubble-caption" data-tone="danger">Invalid arguments: {tool.argumentsError}</p>}
        {special ?? (
          <>
            {tool.arguments ? (
              <pre className="bubble-code">{JSON.stringify(tool.arguments, null, 2)}</pre>
            ) : (
              tool.argsText && <pre className="bubble-code">{tool.argsText}</pre>
            )}
            {tool.result ? <Output content={tool.result.message.content} /> : live ? <Output content={[{ type: "text", text: live }]} /> : null}
          </>
        )}
        {tool.error && <p className="bubble-caption" data-tone="danger">{tool.error}</p>}
        {tool.slot?.droppedBytes ? <p className="bubble-caption">Output truncated: {tool.slot.droppedBytes} bytes dropped</p> : null}
        {diagnostics.map((d, i) => (
          <p key={i} className="bubble-caption" data-tone={d.severity === "error" ? "danger" : "muted"}>
            {d.severity}: {d.message}
          </p>
        ))}
      </div>
      <RawToggle label={`Tool ${tool.name}`} value={{ arguments: tool.arguments, slot: tool.slot, result: tool.result?.message, entry: tool.result?.entry }} />
    </div>
  );
}

type Row = { readonly tool: ToolView; readonly presentation: ToolPresentation | undefined };

function presentationOf(renderers: PiRenderers, tool: ToolView): ToolPresentation | undefined {
  return renderers.tools?.map((render) => render(tool)).find((p) => p !== undefined);
}

function Step({ row, streaming }: { row: Row; streaming: boolean }) {
  const { tool, presentation } = row;
  const status = statusOf(tool);
  const { isOpen, toggle } = useContext(ToolOpenContext);
  const open = isOpen(tool.callId);
  const needsReply = useContext(PanelHostContext).waiting.has(tool.callId);
  const working = (status === "running" || status === "pending") && !needsReply;
  const action = presentation?.action ?? { active: `Using ${tool.name}`, done: `Used ${tool.name}` };
  const verb = status === "running" || status === "pending" ? action.active : action.done;
  const Icon = ICON[presentation?.category ?? "other"];
  const note = needsReply ? "Waiting for you" : status === "failed" ? "Failed" : status === "cancelled" ? "Cancelled" : status === "unknown" ? "No result loaded" : undefined;
  return (
    <li className={cx("flex flex-col", streaming && "ch-anim-fade-in")}>
      <button type="button" aria-expanded={open} data-status={status} onClick={() => toggle(tool.callId)} className="bubble-row ch-color-ease ch-focus">
        <Icon aria-hidden className="bubble-row-icon" />
        <span className={cx("bubble-row-text", working && "ch-anim-shimmer")}>
          <span className="bubble-row-verb">{verb}</span>
          <span className="bubble-row-object">{presentation?.summary ?? summary(tool)}</span>
        </span>
        {note && <span className="bubble-row-note">{note}</span>}
        <ChevronRight aria-hidden className="bubble-row-chevron" />
      </button>
      <BubbleCollapse open={open}>
        <Detail tool={tool} special={presentation?.body} />
      </BubbleCollapse>
    </li>
  );
}

export function ToolStepList({ tools, streaming }: { tools: readonly ToolView[]; streaming: boolean }) {
  const renderers = useContext(RenderersContext);
  return (
    <ol className="bubble-rows flex flex-col">
      {tools.map((tool) => (
        <Step key={tool.callId} row={{ tool, presentation: presentationOf(renderers, tool) }} streaming={streaming} />
      ))}
    </ol>
  );
}

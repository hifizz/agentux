import type { JsonObject } from "@earendil-works/pi-ai";
import type { ToolDiagnostic } from "@earendil-works/pi-durable";
import type { CodemodeToolDetails } from "@earendil-works/pi-durable/codemode";
import type { BashToolInput, EditToolDetails, EditToolInput, ReadToolDetails, ReadToolInput, WriteToolInput } from "@earendil-works/pi-durable/tools";
import type { ToolView } from "../contracts";
import { isJsonObject } from "../model";


const optionalNumber = (value: unknown) => value === undefined || typeof value === "number";

export function readInput(args: JsonObject | undefined): ReadToolInput | undefined {
  if (!args || typeof args.path !== "string" || !optionalNumber(args.offset) || !optionalNumber(args.limit)) return undefined;
  return args as ReadToolInput;
}

export function editInput(args: JsonObject | undefined): EditToolInput | undefined {
  if (!args || typeof args.path !== "string" || !Array.isArray(args.edits)) return undefined;
  return args as EditToolInput;
}

export function writeInput(args: JsonObject | undefined): WriteToolInput | undefined {
  if (!args || typeof args.path !== "string" || typeof args.content !== "string") return undefined;
  return args as WriteToolInput;
}

export function codemodeInput(args: JsonObject | undefined): { readonly code: string } | undefined {
  if (!args || typeof args.code !== "string") return undefined;
  return { code: args.code };
}

export function codemodeDetails(tool: ToolView): CodemodeToolDetails | undefined {
  const d = detailsOf(tool);
  if (!d || !Array.isArray(d.calls)) return undefined;
  const valid = d.calls.every((c) => isJsonObject(c) && typeof c.name === "string" && typeof c.args === "string" && typeof c.status === "string");
  return valid ? (d as unknown as CodemodeToolDetails) : undefined;
}

export function bashInput(args: JsonObject | undefined): BashToolInput | undefined {
  if (!args || typeof args.command !== "string" || !optionalNumber(args.timeout)) return undefined;
  return args as BashToolInput;
}

function detailsOf(tool: ToolView): JsonObject | undefined {
  const details: unknown = tool.result?.message.details;
  return isJsonObject(details) ? details : undefined;
}

export function editDetails(tool: ToolView): EditToolDetails | undefined {
  const d = detailsOf(tool);
  if (!d || typeof d.patch !== "string" || typeof d.diff !== "string") return undefined;
  return d as EditToolDetails;
}

export function readDetails(tool: ToolView): ReadToolDetails | undefined {
  const t = detailsOf(tool)?.truncation;
  return isJsonObject(t) ? { truncation: t as unknown as NonNullable<ReadToolDetails["truncation"]> } : undefined;
}

const HARNESS_NOTE = /\n?<harness>[\s\S]*?<\/harness>\s*$/;

export function resultText(tool: ToolView): string | undefined {
  const content = tool.result?.message.content;
  if (!content || content.some((block) => block.type !== "text")) return undefined;
  return content.map((block) => (block.type === "text" ? block.text : "")).join("").replace(HARNESS_NOTE, "");
}

export function diagnosticsOf(tool: ToolView): readonly ToolDiagnostic[] {
  const fromEntry = tool.result && isJsonObject(tool.result.entry.data) ? tool.result.entry.data.diagnostics : undefined;
  return [...(Array.isArray(fromEntry) ? (fromEntry as ToolDiagnostic[]) : []), ...(tool.slot?.diagnostics ?? [])];
}

export function exitCodeOf(tool: ToolView): number | undefined {
  for (const d of diagnosticsOf(tool)) {
    const match = d.code === "exit_code" ? /code (-?\d+)/.exec(d.message) : null;
    if (match) return Number(match[1]);
  }
  return undefined;
}

const ANSI = new RegExp(String.raw`\u001b\[[0-?]*[ -/]*[@-~]|\u001b\][^\u0007\u001b]*(?:\u0007|\u001b\\)`, "g");
export const stripAnsi = (text: string) => text.replace(ANSI, "");

export function agentIdOf(tool: ToolView): number | undefined {
  for (const details of [tool.result?.message.details, tool.slot?.details]) {
    if (isJsonObject(details) && typeof details.conversationId === "number") return details.conversationId;
  }
  const id = tool.arguments?.id;
  return typeof id === "number" ? id : undefined;
}

import type { ReactNode } from "react";
import type { ToolResultRef } from "./model";
import type { NestedToolSlot, ToolSlot } from "@earendil-works/pi-durable";
import type { JsonObject } from "@earendil-works/pi-ai";
import type { ModelSelection } from "@/app/examples/_shared/models";
import type { PermissionMode } from "@/app/examples/_shared/permission";
import type { PiAnswer } from "@/app/examples/_shared/pi/wire";

export type PiCommands = {
  submit(text: string, whenBusy: "steer" | "followUp"): Promise<void>;
  abort(): Promise<void>;
  continueRun(): Promise<void>;
  respond(id: string, answer: PiAnswer): Promise<void>;
  selectModel(selection: ModelSelection): Promise<void>;
  setPermission(mode: PermissionMode): Promise<void>;
  withdraw(submissionId: number): Promise<void>;
  loadEarlier(): Promise<void>;
};

export type PiConnection =
  | { readonly status: "connecting" }
  | { readonly status: "connected" }
  | { readonly status: "reconnecting" }
  | { readonly status: "failed"; readonly message: string };

export type ToolView = {
  readonly callId: string;
  readonly name: string;
  readonly arguments?: JsonObject;
  readonly argumentsError?: string;
  readonly slot?: ToolSlot;
  readonly nested?: readonly NestedToolSlot[];
  readonly result?: ToolResultRef;
  readonly outcome?: "running" | "ok" | "error" | "cancelled";
  readonly error?: string;
  readonly durationMs?: number;
  readonly argsText?: string;
};

export type ToolCategory = "file" | "shell" | "script" | "web" | "mcp" | "agent" | "ask" | "plan" | "other";

export type ToolAction = { readonly active: string; readonly done: string };

export type ToolPresentation = { readonly category?: ToolCategory; readonly action?: ToolAction; readonly summary?: ReactNode; readonly body?: ReactNode };
export type ToolRenderer = (tool: ToolView) => ToolPresentation | undefined;
export type PiRenderers = { readonly tools?: readonly ToolRenderer[] };

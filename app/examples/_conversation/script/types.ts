import type { MarkId } from "@/app/examples/_shared/ui/app-mark";

export type SayBeat = { kind: "say"; text: string };

export type Step = { id: string; label: string; mark?: MarkId; icon?: "file" | "search" };
export type StepsBeat = { kind: "steps"; steps: Step[] };

export type AskOption = { id: string; label: string; then: Beat[] };
export type Question = { id: string; question: string; options: AskOption[]; other?: false };
export type AskBeat = { kind: "ask"; questions: Question[]; onSkip?: Beat[] };

export type ConnectBeat = {
  kind: "connect";
  integrationId: string;
  onConnected: Beat[];
  skip: { label: string; then: Beat[] };
};

export type AgentDraft = { name: string; schedule: string; tools: MarkId[]; does: string[] };
export type AgentOption = { id: string; label: string; chosenLabel?: string; then: Beat[] };
export type AgentBeat = { kind: "agent"; draft: AgentDraft; options: AgentOption[] };

export type EditedFile = { path: string; add: number; del: number };
export type EditsBeat = { kind: "edits"; files: EditedFile[] };
export type RunBeat = { kind: "run"; command: string; output: string[];result: string;ok?: boolean; effect?: "commit" | "push" };
export type PrBeat = { kind: "pr"; number: number; title: string; branch: string;state?: "draft" | "open" | "merged" };

export type PanelTarget = { tab: "changes"; file?: string } | { tab: "terminal" } | { tab: "browser" } | { tab: "computer" } | { tab: "side-chat" } | { tab: "pr" };

export type Beat = SayBeat | StepsBeat | EditsBeat | RunBeat | PrBeat | AskBeat | ConnectBeat | AgentBeat;
export type InteractiveBeat = AskBeat | ConnectBeat | AgentBeat;

export type Reply = { beats: Beat[] };
export type Turn = { id: number; prompt: string; reply: Reply };

export type SuggestionPart = string | { tools: { mark: MarkId; label: string }[] };
export type Suggestion = {
  id: string;
  icon: "file" | "file-search" | "refresh";
  parts: SuggestionPart[];
  prompt: string;
  reply: Reply;
};

export type AskChoice = { option: string } | { other: string };
export type AskAnswer = { choices: Record<string, AskChoice> } | { skipped: true };
export type ConnectAnswer = "connected" | "skipped";
export type Answer = AskAnswer | ConnectAnswer | string;

"use client";

import Stage from "@/components/examples/Stage";
import { DelegateBoard } from "../_delegate-board/delegate-board";
import type { BoardAgent, BoardTask } from "../_delegate-board/types";
import { useDelegateScript } from "../_delegate-board/use-delegate-script";
import { AnthropicMark, FigmaMark, GitHubMark, GongMark, NotionMark, OpenAIMark, SlackMark, ZendeskMark } from "../_shared/ui/icons";
import { CardMark, OpsMark } from "./marks";

const NOW = new Date(2000, 0, 1, 14, 37).getTime();

const PILE: BoardTask[] = [
  { id: "notes", title: "Write release notes", minutes: 12, tools: [{ name: "Notion", icon: <NotionMark /> }, { name: "GitHub", icon: <GitHubMark /> }] },
  { id: "flaky", title: "Fix flaky checkout test", minutes: 20, tools: [{ name: "GitHub", icon: <GitHubMark /> }] },
  { id: "churn", title: "Summarize churn calls", minutes: 15, tools: [{ name: "Slack", icon: <SlackMark /> }, { name: "Gong", icon: <GongMark /> }] },
  { id: "pricing", title: "Update pricing page", minutes: 10, tools: [{ name: "Figma", icon: <FigmaMark /> }] },
  { id: "crm", title: "Clean up CRM duplicates", minutes: 18, tools: [{ name: "Zendesk", icon: <ZendeskMark /> }] },
];

const AGENTS: BoardAgent[] = [
  { id: "research", name: "Researcher", model: "Opus 5.5", rate: 0.08, mark: <AnthropicMark />, queue: [{ id: "scan", title: "Competitor scan", minutes: 6, estimate: "~10 min" }] },
  { id: "writer", name: "Writer", model: "Sonnet 5.5", rate: 0.03, mark: <AnthropicMark />, queue: [] },
  {
    id: "coder",
    name: "Coder",
    model: "GPT-6 Sol",
    rate: 0.06,
    mark: <OpenAIMark />,
    queue: [
      { id: "auth", title: "Refactor auth", minutes: 14, estimate: "~20 min" },
      { id: "sdk", title: "Upgrade Stripe SDK", minutes: 8, tools: [{ name: "Payments", icon: <CardMark /> }, { name: "GitHub", icon: <GitHubMark /> }] },
    ],
  },
  { id: "ops", name: "Ops", model: "Gemini 3.8 Flash", rate: 0.01, mark: <OpsMark />, queue: [] },
];

const BOARD = { tasks: PILE, agents: AGENTS };

export default function Demo() {
  const s = useDelegateScript(BOARD);
  return (
    <Stage wide status="Drag a task onto an agent, or focus it and press Enter. The demo replays the hand-off on a loop." onReplay={s.replay}>
      <div className="mx-auto w-full max-w-[720px]">
        <DelegateBoard tasks={s.tasks} agents={s.agents} now={NOW} auto={s.auto} onAutoChange={s.setAuto} onAssign={s.assign} drag={s.drag} />
      </div>
    </Stage>
  );
}

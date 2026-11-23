"use client";

import { useState } from "react";
import Stage from "@/components/examples/Stage";
import type { Suggestion } from "../_conversation/script/types";
import { SuggestionRow } from "../_conversation/suggestion";
import { UserMessage } from "../_pi-ui/messages/user-message";

const SUGGESTIONS: Suggestion[] = [
  {
    id: "tickets",
    icon: "file",
    parts: ["Summarise this week's support tickets", { tools: [{ mark: "zendesk", label: "Zendesk" }, { mark: "slack", label: "Slack" }] }],
    prompt: "Summarise this week's support tickets from Zendesk and post the summary to Slack.",
    reply: { beats: [] },
  },
  {
    id: "design",
    icon: "file-search",
    parts: ["Review a design", { tools: [{ mark: "figma", label: "Figma" }] }, "before handoff", { tools: [{ mark: "clickup", label: "ClickUp" }] }],
    prompt: "Review the Figma file for the composer and open ClickUp tasks for what is missing.",
    reply: { beats: [] },
  },
  {
    id: "chore",
    icon: "refresh",
    parts: ["Turn a weekly chore", { tools: [{ mark: "metabase", label: "Metabase" }, { mark: "notion", label: "Notion" }] }, "into an agent"],
    prompt: "Every Monday, read the Metabase dashboard and write the numbers into the Notion weekly page.",
    reply: { beats: [] },
  },
];

export default function Demo() {
  const [picked, setPicked] = useState<Suggestion>();
  return (
    <Stage align="center" status={picked ? "The row's prompt was sent as the first message" : "Pick an opener"} replayLabel="Reset" onReplay={() => setPicked(undefined)}>
      {picked ? (
        <UserMessage message={{ role: "user", content: picked.prompt, timestamp: 0 }} />
      ) : (
        <div className="flex flex-col gap-3">
          <h2 id="openers" className="text-ch-caption text-ch-ink-subtle">
            Try one of these
          </h2>
          <ul aria-labelledby="openers" className="flex flex-col gap-3">
            {SUGGESTIONS.map((s) => (
              <SuggestionRow key={s.id} suggestion={s} onPress={() => setPicked(s)} />
            ))}
          </ul>
        </div>
      )}
    </Stage>
  );
}

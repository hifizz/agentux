"use client";

import { useState } from "react";
import Stage from "@/components/examples/Stage";
import { DEFAULT_DEMO_SELECTION, DEMO_MODELS, type ModelSelection } from "@/app/examples/_shared/models";
import { AiStatus, type AiStatusState } from "../prompt-composer/ai-status";
import { PromptComposer, type PermissionMode, type PromptComposerProps } from "../prompt-composer/composer";
import { CHANGED, CONTEXT, QUEUED, useDirectory, useHost, useRepo } from "../prompt-composer/fixtures";

const AI_STATES: readonly AiStatusState[] = ["thinking", "researching", "analyzing", "writing", "done", "error"];

type Case = { id: string; label: string; note: string; props: Partial<PromptComposerProps> };

const fail = () => Promise.reject(new Error("The agent is offline. Your message was kept."));

const CASES: readonly Case[] = [
  { id: "idle", label: "Idle", note: "Empty input, send is disabled", props: {} },
  { id: "draft", label: "Draft", note: "Text in the input, ready to send", props: { defaultValue: "Split the composer into Base UI parts" } },
  { id: "busy-queue", label: "Busy · queue", note: "Running, a new message waits in the queue", props: { busy: true, busyPolicy: "queue", strips: [{ kind: "queue", messages: QUEUED, onRemove: () => {} }] } },
  { id: "busy-steer", label: "Busy · steerable", note: "Running, the toggle sends into the current turn", props: { busy: true, busyPolicy: "steerable", defaultValue: "Use neutral colors" } },
  { id: "busy-block", label: "Busy · stop", note: "Running with an empty input, send turns into Stop", props: { busy: true, busyPolicy: "block", onStop: () => {} } },
  { id: "error", label: "Error", note: "Press Enter, the send fails and the text stays", props: { defaultValue: "Deploy the preview", onSubmit: fail } },
  { id: "usage", label: "Near the limit", note: "Usage strip with a nearly full context", props: { strips: [{ kind: "usage", percent: 92 }], context: { ...CONTEXT, segments: CONTEXT.segments.map((s) => (s.id === "messages" ? { ...s, tokens: 140_000 } : s)) } } },
  { id: "changes", label: "With changes", note: "Changes strip after the agent edited files", props: { strips: [{ kind: "changes", files: CHANGED }] } },
  { id: "disabled", label: "Disabled", note: "No model available, every control is off", props: { disabled: true, defaultValue: "Waiting for a model" } },
  { id: "compact", label: "Compact", note: "Side panel density, no tray", props: { density: "compact" } },
];

function Sample({ item }: { item: Case }) {
  const [model, setModel] = useState<ModelSelection>(DEFAULT_DEMO_SELECTION);
  const [permission, setPermission] = useState<PermissionMode>("edit");
  const directory = useDirectory();
  const repo = useRepo();
  const host = useHost(item.props.busy ? "running" : "ready");
  return (
    <section aria-label={item.label} className="flex flex-col gap-2">
      <header className="flex items-baseline justify-between gap-2 px-1">
        <h3 className="text-ch-body font-medium text-ch-ink">{item.label}</h3>
        <p className="truncate text-ch-caption text-ch-ink-subtle">{item.note}</p>
      </header>
      <PromptComposer
        placeholder="Ask the agent to build something"
        onSubmit={() => {}}
        attach={{}}
        model={{ catalog: DEMO_MODELS, value: model, onChange: setModel }}
        permission={{ value: permission, onChange: setPermission }}
        context={CONTEXT}
        tray={item.props.density === "compact" ? undefined : { directory, repo, host }}
        {...item.props}
      />
    </section>
  );
}

export default function Demo() {
  return (
    <Stage status={`${CASES.length} composer states and ${AI_STATES.length} run states`}>
      <div className="flex flex-wrap gap-x-5 gap-y-3 rounded-ch-card border border-ch-line bg-ch-surface p-4">
        {AI_STATES.map((s) => (
          <AiStatus key={s} state={s} />
        ))}
      </div>
      <div className="flex flex-col gap-8">
        {CASES.map((c) => (
          <Sample key={c.id} item={c} />
        ))}
      </div>
    </Stage>
  );
}

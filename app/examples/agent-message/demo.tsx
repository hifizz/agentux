"use client";

import { useEffect, useState } from "react";
import { FileText } from "lucide-react";
import Stage from "@/components/examples/Stage";
import { useStream } from "@/components/examples/use-script";
import { useBurstStream } from "../_message/fixtures";
import { Markdown } from "../_message/markdown";
import { Plan } from "../_message/plan";
import { planSnapshot } from "../_fixtures/plan";
import { feedbackActions, MessageActions, MetaDot, retryAction, useCopyAction, type Feedback } from "../_message/message-actions";
import { Message, MessageAttachments, MessageAvatar, MessageError, TypingDots } from "../_message/message";
import { ShadowScroll } from "../_message/shadow-scroll";
import { Thinking } from "../_message/thinking";
import { ToolCall, ToolInput, ToolOutput } from "../_message/tool-call";
import { SourceList, WebSearch, type SearchSource } from "../_message/web-search";
import { useSmoothStream } from "../_message/use-smooth-stream";

const PROMPT = "Compare these two specs and tell me what changed in the streaming section.";
const STEPS = ["Read both specifications", "Check the streaming guidance", "Summarize the differences"];
const THOUGHT = "Two files are attached. I should read both, then check whether the new pacing numbers match current guidance before summarizing.";
const SOURCES: SearchSource[] = [
  { id: "a", title: "Smooth streaming in AI SDKs", url: "https://sdk.vercel.ai/docs/smooth-stream" },
  { id: "b", title: "requestAnimationFrame", url: "https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame" },
];
const ANSWER = `The streaming section changed in three places.

| | v1 | v2 |
| :-- | :-- | :-- |
| Reveal | per chunk | per animation frame |
| Floor rate | none | 60 chars/s |
| Catch up | instant | within 0.6s |

- **Pacing** now follows the backlog instead of the network.
- **Reduced motion** shows the full text at once.

\`\`\`ts
const rate = Math.max(60, backlog / 0.6);
\`\`\`

Both numbers match current SDK guidance.`;

function Assistant({ fail, onRetry }: { fail: boolean; onRetry: () => void }) {
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [phase, setPhase] = useState(0);
  const thought = useStream(THOUGHT, phase >= 1, 3, 26);
  const raw = useBurstStream(ANSWER, phase >= 4 && !fail);
  const answer = useSmoothStream(raw.text);
  const copy = useCopyAction(ANSWER);

  useEffect(() => {
    const delays = [600, 0, 900, 1200];
    if (phase >= delays.length || (phase === 1 && !thought.done)) return;
    const t = window.setTimeout(() => setPhase((p) => p + 1), delays[phase]);
    return () => window.clearTimeout(t);
  }, [phase, thought.done]);

  const done = raw.done && answer.caughtUp;
  return (
    <Message
      role="assistant"
      name="reni"
      avatar={<MessageAvatar label="r" className="normal-case" />}
      time="now"
      footer={
        done && (
          <div className="flex flex-col gap-3 pt-2">
            <SourceList sources={SOURCES} />
            <MessageActions
              actions={[copy, ...feedbackActions(feedback, setFeedback), retryAction(onRetry)]}
              meta={
                <>
                  <span>Sonnet 4.5</span>
                  <MetaDot />
                  <span>2.1k tokens</span>
                </>
              }
            />
          </div>
        )
      }
    >
      {phase === 0 && <TypingDots label="Starting" />}
      {phase >= 1 && <Thinking streaming={!thought.done}>{thought.text}</Thinking>}
      {phase >= 2 && <Plan plan={planSnapshot(STEPS, done ? STEPS.length : phase - 2, !(fail && phase >= 4))} />}
      {phase >= 2 && (
        <ToolCall name="read" status={phase >= 3 ? "done" : "running"} icon={<FileText />} verb={{ active: "Reading", done: "Read" }} summary="2 files" duration={0.2}>
          <ToolInput value={{ paths: ["spec-v1.md", "spec-v2.md"] }} />
          <ToolOutput value="spec-v1.md  148 lines\nspec-v2.md  171 lines" />
        </ToolCall>
      )}
      {phase >= 3 && <WebSearch queries={["smooth token streaming rate"]} sources={phase >= 4 ? SOURCES : SOURCES.slice(0, 1)} status={phase >= 4 ? "done" : "searching"} />}
      {phase >= 4 && fail && <MessageError title="The model request failed" detail="The provider returned 529 overloaded. Nothing was charged." onRetry={onRetry} />}
      {phase >= 4 && !fail && answer.text && (
        <div className="pt-1">
          <Markdown streaming={!done}>{answer.text}</Markdown>
        </div>
      )}
    </Message>
  );
}

export default function Demo() {
  const [run, setRun] = useState(0);
  const [fail, setFail] = useState(false);
  return (
    <Stage
      status={fail ? "The run fails after the tools. Retry starts it again." : "One assistant turn built from the message parts"}
      actions={[{ label: "Fail", pressed: fail, onClick: () => { setFail((f) => !f); setRun((r) => r + 1); } }]}
      onReplay={() => setRun((r) => r + 1)}
    >
      <ShadowScroll follow className="absolute inset-0" contentClassName="mx-auto flex w-full max-w-2xl flex-col gap-6 px-6 py-8">
        <Message role="system">Earlier messages were summarized</Message>
        <Message role="user" attachments={<MessageAttachments files={[{ name: "spec-v1.md", size: "6 KB" }, { name: "spec-v2.md", size: "7 KB" }]} />}>
          {PROMPT}
        </Message>
        <Assistant key={run} fail={fail} onRetry={() => { setFail(false); setRun((r) => r + 1); }} />
      </ShadowScroll>
    </Stage>
  );
}

"use client";

import { useEffect, useState } from "react";
import { FilePen, FileText, Plug, SquareTerminal } from "lucide-react";
import Stage from "@/components/examples/Stage";
import { ToolCall, ToolGroup, ToolInput, ToolOutput, ToolTerminal, type ToolStatus } from "../_message/tool-call";

const READ_OUT = `export function drain(queue: Queue) {
  const [next, ...rest] = queue;
  return { next, rest };
}`;
const TEST_OUT = ` PASS  composer/queue.test.ts
  ✓ drains in order (4 ms)
  ✓ keeps steer items first (2 ms)

Tests: 2 passed, 2 total`;

const STEPS: ToolStatus[][] = [
  ["running", "pending", "pending"],
  ["done", "running", "pending"],
  ["done", "done", "running"],
  ["done", "done", "done"],
];

export default function Demo() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (step >= STEPS.length - 1) return;
    const t = window.setTimeout(() => setStep((s) => s + 1), 1300);
    return () => window.clearTimeout(t);
  }, [step]);
  const [read, test, write] = STEPS[step];
  return (
    <Stage status={step < STEPS.length - 1 ? "Tools run one after another" : "Click any row to see input and output"} onReplay={() => setStep(0)}>
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-6 py-8">
        <ToolGroup label={step < STEPS.length - 1 ? "Working" : "Ran 3 tools"}>
          <ToolCall name="read" status={read} icon={<FileText />} verb={{ active: "Reading", done: "Read" }} summary={<span className="ch-mono">composer/queue.ts</span>} duration={0.08}>
            <ToolInput value={{ path: "composer/queue.ts", offset: 1, limit: 4 }} />
            {read === "done" && <ToolOutput value={READ_OUT} />}
          </ToolCall>
          <ToolCall name="bash" status={test} icon={<SquareTerminal />} verb={{ active: "Running", done: "Ran" }} summary={<span className="ch-mono">npm test queue</span>} duration={2.4} defaultOpen>
            <ToolTerminal command="npm test queue" output={test === "done" ? TEST_OUT : test === "running" ? " RUNS  composer/queue.test.ts" : undefined} exitCode={test === "done" ? 0 : undefined} running={test === "running"} />
          </ToolCall>
          <ToolCall name="edit" status={write} icon={<FilePen />} verb={{ active: "Editing", done: "Edited" }} summary={<span className="ch-mono">composer/strip.tsx</span>} duration={0.3}>
            <ToolInput value={{ path: "composer/strip.tsx", find: "if (!queue.length) return null;", replace: "if (!busy && !queue.length) return null;" }} />
          </ToolCall>
        </ToolGroup>
        <section className="flex flex-col gap-1">
          <h3 className="text-ch-caption text-ch-ink-subtle">Failed call</h3>
          <ToolCall name="linear.create_issue" status="error" icon={<Plug />} summary="Linear · create issue" duration={1.2}>
            <ToolInput value={{ team: "AGX", title: "Queue strip flickers" }} />
            <ToolOutput error value="401 Unauthorized: the Linear token has expired." />
          </ToolCall>
        </section>
        <section className="flex flex-col gap-1">
          <h3 className="text-ch-caption text-ch-ink-subtle">Waiting for its turn</h3>
          <ToolCall name="deploy" status="pending" verb={{ active: "Deploying", done: "Deployed" }} summary="preview" />
        </section>
      </div>
    </Stage>
  );
}

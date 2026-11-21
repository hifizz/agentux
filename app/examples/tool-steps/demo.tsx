"use client";

import { useMemo, useState } from "react";
import Stage from "@/components/examples/Stage";
import { useSteps } from "@/components/examples/use-script";
import { result, slot } from "../_fixtures/pi";
import { ToolHost } from "../_fixtures/tool-host";
import "../_pi-ui/ai-message-bubble.css";
import { ToolStepList } from "../_pi-ui/blocks/tool-steps";
import type { ToolView } from "../_pi-ui/contracts";

const PATCH = `@@ -64,6 +64,5 @@
-  useEffect(() => {
-    if (busy || queue.length === 0) return;
-    const [next, ...rest] = queue;
-    setQueue(rest);
-    send(next.text);
-  }, [busy, queue]);
+  const drain = useCallback(() => {
+    const [next, ...rest] = queueRef.current;
+    if (!next) return;
+    setQueue(rest);
+    send(next.text);
+  }, [send]);`;

const LINT_OUT = `> turnframe@0.1.0 lint
> eslint

app/examples/prompt-composer/demo.tsx
  70:5  error  Avoid calling setState() directly within an effect

1 problem (1 error, 0 warnings)`;

type Spec = { id: string; name: string; args: NonNullable<ToolView["arguments"]>; live?: string; done: (id: string, name: string) => ToolView["result"] };

const SPECS: Spec[] = [
  {
    id: "s-read",
    name: "read",
    args: { path: "app/examples/prompt-composer/demo.tsx", offset: 64, limit: 6 },
    done: (id, name) => result(id, name, "  useEffect(() => {\n    if (busy || queue.length === 0) return;\n    const [next, ...rest] = queue;\n    setQueue(rest);\n    send(next.text);\n  }, [busy, queue]);"),
  },
  {
    id: "s-search",
    name: "mcp__exa__web_search",
    args: { query: "react setState in effect lint rule" },
    done: (id, name) => result(id, name, "1. react.dev/learn/you-might-not-need-an-effect\n2. react.dev/reference/eslint-plugin-react-hooks"),
  },
  {
    id: "s-lint",
    name: "bash",
    args: { command: "npm run lint", timeout: 120 },
    live: "> turnframe@0.1.0 lint\n> eslint\n",
    done: (id, name) => result(id, name, LINT_OUT, { isError: true, diagnostics: [{ severity: "error", code: "exit_code", message: "Command exited with code 1" }] }),
  },
  {
    id: "s-edit",
    name: "edit",
    args: { path: "app/examples/prompt-composer/demo.tsx", edits: [{ oldText: "useEffect(() => {", newText: "const drain = useCallback(() => {" }] },
    done: (id, name) => result(id, name, "Edited 1 block", { details: { diff: PATCH, patch: PATCH, firstChangedLine: 64 } }),
  },
  {
    id: "s-check",
    name: "bash",
    args: { command: "npm run lint && npm run typecheck" },
    live: "> eslint\n",
    done: (id, name) => result(id, name, "> eslint\n\n> tsc --noEmit\n"),
  },
  {
    id: "s-ask",
    name: "ask_user",
    args: { question: "Commit this fix to the current branch?", options: ["Commit", "Open a new branch"] },
    done: (id, name) => result(id, name, "Commit"),
  },
];
const ASK = SPECS[SPECS.length - 1].id;
const DELAYS = [1100, 1300, 1700, 1200, 1500];
const WAITING: ReadonlySet<string> = new Set([ASK]);
const NOBODY: ReadonlySet<string> = new Set();

function Steps({ answered }: { answered: boolean }) {
  const at = useSteps(DELAYS);
  const tools = useMemo(
    () =>
      SPECS.slice(0, at + 1).map((spec, i): ToolView => {
        const finished = i < at || (spec.id === ASK && answered);
        return { callId: spec.id, name: spec.name, arguments: spec.args, result: finished ? spec.done(spec.id, spec.name) : undefined, slot: finished ? undefined : slot(spec.id, spec.name, "running", spec.live) };
      }),
    [at, answered],
  );
  const asking = at >= SPECS.length - 1 && !answered;
  return (
    <ToolHost waiting={asking ? WAITING : NOBODY}>
      <div className="ai-message-bubble flex flex-col">
        <ToolStepList tools={tools} streaming={at < SPECS.length - 1} />
      </div>
    </ToolHost>
  );
}

export default function Demo() {
  const [run, setRun] = useState(0);
  const [answered, setAnswered] = useState(false);
  return (
    <Stage
      status="Click a row for its arguments, output and raw JSON"
      actions={[{ label: "Answer the question", onClick: () => setAnswered(true) }]}
      onReplay={() => {
        setAnswered(false);
        setRun((n) => n + 1);
      }}
    >
      <Steps key={run} answered={answered} />
    </Stage>
  );
}

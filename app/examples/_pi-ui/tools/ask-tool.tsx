import type { ToolRenderer } from "../contracts";
import { resultText } from "./decode";

export const askTool: ToolRenderer = (tool) => {
  if (tool.name !== "ask_user") return undefined;
  const question = tool.arguments?.question;
  if (typeof question !== "string") return undefined;
  const options = Array.isArray(tool.arguments?.options) ? tool.arguments.options.filter((o): o is string => typeof o === "string") : [];
  const answer = tool.result?.message.isError ? undefined : resultText(tool);
  return {
    category: "ask",
    action: { active: "Asking you", done: "Asked you" },
    summary: <span className="text-ch-ink-subtle">{question}</span>,
    body: (
      <div className="flex flex-col gap-1.5 text-ch-caption leading-5">
        <p className="text-ch-ink">{question}</p>
        {options.length > 0 && <p className="text-ch-ink-subtle">Options: {options.join(" · ")}</p>}
        {answer !== undefined ? <p className="text-ch-ink-muted">Answer: {answer}</p> : <p className="text-ch-ink-subtle">Waiting for your answer…</p>}
      </div>
    ),
  };
};

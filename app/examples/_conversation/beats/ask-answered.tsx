import type { AskAnswer, Question } from "../script/types";
import { CheckIcon, QuestionIcon } from "@/app/examples/_shared/ui/icons";
import { Glyph } from "@/app/examples/_shared/ui/tag";

function AnswerRow({ question, label, chosen = false }: { question: string; label: string; chosen?: boolean }) {
  return (
    <p className="flex min-h-6 flex-wrap items-center gap-x-2 gap-y-1 text-ch-body leading-[22px] text-ch-ink">
      <Glyph className="text-ch-ink">
        <QuestionIcon className="size-3" />
      </Glyph>
      <span>{question}</span>
      <span className="inline-flex h-5 items-center gap-1 rounded-full bg-ch-tonal pr-1.5 pl-1 text-ch-caption text-ch-ink">
        {chosen && (
          <span className="grid size-3.5 place-items-center rounded-full bg-ch-accent text-ch-on-accent">
            <CheckIcon className="size-2.5" />
          </span>
        )}
        {label}
      </span>
    </p>
  );
}

export function AskAnswered({ questions, answer }: { questions: Question[]; answer: AskAnswer }) {
  if ("skipped" in answer) return <AnswerRow question={questions[0].question} label="Skipped" />;
  return (
    <div className="flex flex-col gap-2">
      {questions.map((q) => {
        const choice = answer.choices[q.id];
        if (!choice) return null;
        const label = "option" in choice ? (q.options.find((o) => o.id === choice.option)?.label ?? "") : choice.other;
        return <AnswerRow key={q.id} question={q.question} label={label} chosen />;
      })}
    </div>
  );
}

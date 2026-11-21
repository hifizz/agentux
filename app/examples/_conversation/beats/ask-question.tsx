"use client";

import { useRef, useState } from "react";
import type { AskChoice, Question } from "../script/types";
import { ChoiceBadge } from "./choice-badge";
import { cx } from "@/app/examples/_shared/ui/cx";

const LETTERS = "ABCDEFGH";

const ROW =
  "ch-color-ease flex h-9 cursor-pointer items-center gap-3 rounded-ch-control border border-ch-line bg-ch-surface px-2 outline-none " +
  "has-[:enabled]:hover:border-ch-line-hover has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50";

const RADIO_FOCUS = "has-[:focus-visible]:outline-2 has-[:focus-visible]:-outline-offset-2 has-[:focus-visible]:outline-ch-focus";

export function AskQuestion({
  question,
  choice,
  locked,
  onChange,
  onSubmit,
}: {
  question: Question;
  choice: AskChoice | undefined;
  locked: boolean;
  onChange: (choice: AskChoice) => void;
  onSubmit: () => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [other, setOther] = useState(() => (choice && "other" in choice ? choice.other : ""));
  const otherActive = choice !== undefined && "other" in choice;
  const selected = choice !== undefined && "option" in choice ? choice.option : null;

  return (
    <div
      className="flex flex-col gap-2"
      onKeyDownCapture={(e) => {
        if (e.key === "Enter" && !e.nativeEvent.isComposing) {
          e.preventDefault();
          onSubmit();
        }
      }}
    >
      <div role="radiogroup" aria-label={question.question} className="flex flex-col gap-2">
        {question.options.map((option, i) => (
          <label key={option.id} className={cx(ROW, RADIO_FOCUS)}>
            <input
              type="radio"
              name={question.id}
              value={option.id}
              checked={selected === option.id}
              disabled={locked}
              onChange={() => onChange({ option: option.id })}
              className="sr-only"
            />
            <ChoiceBadge chosen={selected === option.id}>{LETTERS[i]}</ChoiceBadge>
            <span className="min-w-0 flex-1 truncate text-ch-body text-ch-ink">{option.label}</span>
          </label>
        ))}
      </div>
      {question.other !== false && (
        <label
          className={cx(ROW, "cursor-text", otherActive && "border-ch-line-hover")}
          onPointerDown={(e) => {
            if (e.target !== input.current) {
              e.preventDefault();
              input.current?.focus();
            }
          }}
        >
          <ChoiceBadge chosen={otherActive}>{LETTERS[question.options.length]}</ChoiceBadge>
          <input
            ref={input}
            aria-label="Something else"
            placeholder="Something else..."
            value={other}
            disabled={locked}
            onChange={(e) => {
              setOther(e.target.value);
              onChange({ other: e.target.value });
            }}
            onFocus={() => onChange({ other })}
            className="h-full min-w-0 flex-1 bg-transparent text-ch-body text-ch-ink outline-none placeholder:text-ch-ink-subtle"
          />
        </label>
      )}
    </div>
  );
}

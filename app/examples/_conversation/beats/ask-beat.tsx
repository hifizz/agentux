"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "motion/react";
import type { AskAnswer, AskChoice, Question } from "../script/types";
import { ChevronDownIcon, QuestionIcon } from "@/app/examples/_shared/ui/icons";
import { AutoHeight } from "@/app/examples/_shared/ui/auto-height";
import { Button } from "@/app/examples/_shared/ui/button";
import { cx } from "@/app/examples/_shared/ui/cx";
import { BLUR_IN, EASE_MORPH } from "@/app/examples/_shared/ui/motion";
import { Reveal } from "@/app/examples/_shared/ui/reveal";
import { Roll } from "@/app/examples/_shared/ui/roll";
import { Glyph } from "@/app/examples/_shared/ui/tag";
import { AskAnswered } from "./ask-answered";
import { AskQuestion } from "./ask-question";

const SLIDE_IN = { duration: 0.16, ease: EASE_MORPH, delay: 0.08 } as const;
const SLIDE_OUT = { duration: 0.1, ease: EASE_MORPH } as const;

const SLIDE: Variants = {
  enter: (dir: number) => ({ y: dir * 16, opacity: 0 }),
  center: { y: 0, opacity: 1 },
  exit: (dir: number) => ({ y: dir * -16, opacity: 0, transition: SLIDE_OUT }),
};

type Props = {
  questions: Question[];
  answer: AskAnswer | undefined;
  locked: boolean;
  onAnswer: (answer: AskAnswer) => void;
};

export function AskBeat({ questions, answer, locked, onAnswer }: Props) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [choices, setChoices] = useState<Record<string, AskChoice>>({});
  const multi = questions.length > 1;
  const current = questions[index];
  const choice = choices[current.id];
  const ready = !locked && choice !== undefined && ("option" in choice || choice.other.trim() !== "");

  const goto = (next: number) => {
    setDirection(next > index ? 1 : -1);
    setIndex(next);
  };
  const advance = () => {
    if (!ready) return;
    if (index < questions.length - 1) goto(index + 1);
    else onAnswer({ choices });
  };

  const card = (
    <>
      <div className="flex min-h-6 items-start gap-2">
        <Glyph className="mt-1 text-ch-ink">
          <QuestionIcon className="size-3" />
        </Glyph>
        <Roll value={current.question} direction={direction} wrap className="min-w-0 flex-1 text-ch-body leading-6 font-medium text-ch-ink" />
        {multi && (
          <div className="flex h-6 shrink-0 items-center gap-1">
            <span className="flex text-ch-caption text-ch-ink-subtle tabular-nums" aria-label={`Question ${index + 1} of ${questions.length}`}>
              <Roll value={index + 1} direction={direction} className="h-[15px] leading-[15px]" />/{questions.length}
            </span>
            <Button variant="icon" aria-label="Previous question" disabled={locked || index === 0} onClick={() => goto(index - 1)}>
              <ChevronDownIcon className="size-3.5 rotate-180" />
            </Button>
            <Button variant="icon" aria-label="Next question" disabled={locked || index === questions.length - 1} onClick={() => goto(index + 1)}>
              <ChevronDownIcon className="size-3.5" />
            </Button>
          </div>
        )}
      </div>

      <AutoHeight className="-m-1 overflow-hidden p-1">
        <div className="relative">
          <AnimatePresence initial={false} mode="popLayout" custom={direction}>
            <motion.div
              key={current.id}
              custom={direction}
              variants={SLIDE}
              initial="enter"
              animate="center"
              exit={reduced ? { opacity: 0, transition: { duration: 0 } } : "exit"}
              transition={reduced ? { duration: 0 } : SLIDE_IN}
            >
              <AskQuestion
                question={current}
                choice={choice}
                locked={locked}
                onChange={(next) => setChoices((prev) => ({ ...prev, [current.id]: next }))}
                onSubmit={advance}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </AutoHeight>

      <div className="flex items-center gap-2">
        <Button variant={ready ? "solid" : "tonal"} disabled={!ready} onClick={advance} className={cx("border px-2", ready && "border-transparent")}>
          Continue
        </Button>
        <Button disabled={locked} onClick={() => onAnswer({ skipped: true })} className="px-2">
          Skip
        </Button>
      </div>
    </>
  );

  return (
    <Reveal>
      <AutoHeight className="-m-1 overflow-hidden p-1">
        <div className="relative">
          <AnimatePresence initial={false} mode="popLayout">
            {answer === undefined ? (
              <motion.div
                key="card"
                className="flex flex-col gap-2 rounded-ch-card border border-ch-line bg-ch-surface p-2"
                exit={{ opacity: 0, transition: { duration: reduced ? 0 : 0.12, ease: EASE_MORPH } }}
              >
                {card}
              </motion.div>
            ) : (
              <motion.div
                key="answered"
                initial={reduced ? { opacity: 0 } : BLUR_IN.from}
                animate={BLUR_IN.to}
                transition={reduced ? { duration: 0 } : { duration: 0.24, ease: EASE_MORPH, delay: 0.1 }}
              >
                <AskAnswered questions={questions} answer={answer} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </AutoHeight>
    </Reveal>
  );
}

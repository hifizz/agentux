"use client";

import { useState } from "react";
import Stage from "@/components/examples/Stage";
import { AskBeat } from "../_conversation/beats/ask-beat";
import type { AskAnswer, Question } from "../_conversation/script/types";

const QUESTIONS: Question[] = [
  {
    id: "scope",
    question: "What should this agent watch?",
    options: [
      { id: "tickets", label: "New support tickets", then: [] },
      { id: "reviews", label: "Pull requests waiting for review", then: [] },
      { id: "alerts", label: "Production alerts", then: [] },
    ],
  },
  {
    id: "cadence",
    question: "How often should it report?",
    options: [
      { id: "live", label: "As soon as something happens", then: [] },
      { id: "daily", label: "One summary every morning", then: [] },
      { id: "weekly", label: "One summary every Monday", then: [] },
    ],
  },
  {
    id: "channel",
    question: "Where should the report go?",
    other: false,
    options: [
      { id: "slack", label: "A Slack channel", then: [] },
      { id: "email", label: "Email", then: [] },
    ],
  },
];

function Card({ onAnswer }: { onAnswer: (answer: AskAnswer) => void }) {
  const [answer, setAnswer] = useState<AskAnswer>();
  return (
    <AskBeat
      questions={QUESTIONS}
      answer={answer}
      locked={answer !== undefined}
      onAnswer={(next) => {
        setAnswer(next);
        onAnswer(next);
      }}
    />
  );
}

export default function Demo() {
  const [run, setRun] = useState(0);
  const [status, setStatus] = useState("Three questions in one card");
  return (
    <Stage
      align="center"
      status={status}
      replayLabel="Reset"
      onReplay={() => {
        setStatus("Three questions in one card");
        setRun((n) => n + 1);
      }}
    >
      <Card key={run} onAnswer={(answer) => setStatus("skipped" in answer ? "Skipped: the agent continues with defaults" : "Answered: the card folds into a summary")} />
    </Stage>
  );
}

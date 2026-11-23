"use client";

import { useState } from "react";
import Stage from "@/components/examples/Stage";
import { DEMO_MODELS, selectModel, type EffortLevel } from "@/app/examples/_shared/models";
import { EFFORT_LABEL, EffortPicker } from "../prompt-composer/composer";

export default function Demo() {
  const [modelKey, setModelKey] = useState(DEMO_MODELS[0].key);
  const model = DEMO_MODELS.find((m) => m.key === modelKey) ?? DEMO_MODELS[0];
  const [effort, setEffort] = useState<EffortLevel>(model.effort.default);
  const pick = (key: string) => {
    const next = DEMO_MODELS.find((m) => m.key === key) ?? DEMO_MODELS[0];
    setModelKey(key);
    setEffort(selectModel(next, effort).effort);
  };
  const hidden = model.effort.levels.length < 2;
  return (
    <Stage
      align="center"
      status={hidden ? `${model.name} has no effort levels, so the picker hides` : `${model.name} · ${EFFORT_LABEL[effort]}`}
      actions={DEMO_MODELS.slice(2, 5).concat(DEMO_MODELS[0]).map((m) => ({ label: m.name, pressed: m.key === modelKey, onClick: () => pick(m.key) }))}
    >
      <div className="@container mx-auto flex min-h-13 w-full max-w-md items-center justify-center">
        {hidden ? <span className="text-ch-caption text-ch-ink-subtle">Nothing to pick</span> : <EffortPicker model={model} value={effort} onChange={setEffort} />}
      </div>
    </Stage>
  );
}

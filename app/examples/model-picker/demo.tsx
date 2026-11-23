"use client";

import { useState } from "react";
import Stage from "@/components/examples/Stage";
import { DEFAULT_DEMO_SELECTION, DEMO_MODELS, findModel, type ModelSelection } from "@/app/examples/_shared/models";
import { EFFORT_LABEL, ModelPicker } from "../prompt-composer/composer";

export default function Demo() {
  const [value, setValue] = useState<ModelSelection>(DEFAULT_DEMO_SELECTION);
  const [single, setSingle] = useState(false);
  const card = findModel(DEMO_MODELS, value.key);
  const catalog = single ? DEMO_MODELS.slice(0, 1) : DEMO_MODELS;
  return (
    <Stage
      align="center"
      status={`${card?.name ?? "Model"} · effort ${EFFORT_LABEL[value.effort]}`}
      actions={[{ label: "One model", pressed: single, onClick: () => { setSingle((v) => !v); setValue(DEFAULT_DEMO_SELECTION); } }]}
    >
      <div className="@container mx-auto flex w-full max-w-md items-center justify-center">
        <ModelPicker catalog={catalog} value={value} onChange={setValue} />
      </div>
    </Stage>
  );
}

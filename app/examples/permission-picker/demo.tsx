"use client";

import { useState } from "react";
import Stage from "@/components/examples/Stage";
import { PERMISSION_MODES, PermissionPicker, type PermissionMode } from "../prompt-composer/composer";

const SAFE: readonly PermissionMode[] = ["ask", "edit", "auto"];

export default function Demo() {
  const [value, setValue] = useState<PermissionMode>("edit");
  const [safe, setSafe] = useState(false);
  const info = PERMISSION_MODES[value];
  return (
    <Stage
      align="center"
      status={`${info.label}: ${info.hint}`}
      actions={[{ label: "Hide Bypass", pressed: safe, onClick: () => { setSafe((v) => !v); if (value === "bypass") setValue("auto"); } }]}
    >
      <div className="@container mx-auto flex w-full max-w-md items-center justify-center rounded-ch-card border border-ch-line bg-ch-surface p-3 shadow-ch-bar">
        <PermissionPicker value={value} onChange={setValue} modes={safe ? SAFE : undefined} />
      </div>
    </Stage>
  );
}

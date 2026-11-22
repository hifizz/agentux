"use client";

import { useState } from "react";
import Stage from "@/components/examples/Stage";
import { DirectoryPicker } from "../prompt-composer/composer";
import { useDirectory } from "../prompt-composer/fixtures";

export default function Demo() {
  const [scratch, setScratch] = useState(true);
  const directory = useDirectory(undefined, scratch);
  return (
    <Stage align="center" status={directory.value ? `Working in ${directory.value}` : "Scratch sandbox, no folder"} actions={[{ label: "Allow Scratch", pressed: scratch, onClick: () => setScratch((v) => !v) }]}>
      <div className="@container mx-auto flex w-full max-w-md items-center justify-center rounded-ch-card border border-ch-line bg-ch-surface p-3 shadow-ch-bar">
        <DirectoryPicker {...directory} />
      </div>
    </Stage>
  );
}

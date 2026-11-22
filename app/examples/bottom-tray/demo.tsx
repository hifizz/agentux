"use client";

import { useState } from "react";
import Stage from "@/components/examples/Stage";
import { BottomTray, DirectoryPicker, HostPicker, PromptInput, RepoBranchPicker, SendButton, type HostStatus } from "../prompt-composer/composer";
import { useDirectory, useHost, useRepo } from "../prompt-composer/fixtures";

const STATUSES: readonly HostStatus[] = ["ready", "starting", "running", "offline"];

export default function Demo() {
  const [text, setText] = useState("");
  const [status, setStatus] = useState<HostStatus>("ready");
  const directory = useDirectory();
  const repo = useRepo();
  const host = useHost(status);
  return (
    <Stage
      align="center"
      status={`${directory.value ?? "Scratch"} · ${repo.value.repo}@${repo.value.branch}`}
      actions={STATUSES.map((s) => ({ label: s[0].toUpperCase() + s.slice(1), pressed: status === s, onClick: () => setStatus(s) }))}
    >
      <div className="@container flex flex-col">
        <PromptInput value={text} onChange={setText} placeholder="Start a task in this workspace" end={<SendButton canSend={!!text.trim()} onSend={() => setText("")} />} />
        <BottomTray
          start={
            <>
              <DirectoryPicker {...directory} />
              <RepoBranchPicker {...repo} />
            </>
          }
          end={<HostPicker {...host} />}
        />
      </div>
    </Stage>
  );
}

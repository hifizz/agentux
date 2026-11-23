"use client";

import { useState } from "react";
import Stage from "@/components/examples/Stage";
import { AGENT_SESSION } from "../_langfuse/fixtures/agent-session";
import { loadSampleIo } from "../_langfuse/fixtures/sample-io";
import { spreadRows } from "../_langfuse/fixtures/spread-session";
import { SessionView } from "../_langfuse/session-view";
import { toSession } from "../_langfuse/to-trace";

const PICKS = [
  { label: "Two minutes", session: toSession(AGENT_SESSION) },
  { label: "Across two days", session: toSession(spreadRows(AGENT_SESSION)) },
];

export default function Demo() {
  const [pick, setPick] = useState(0);
  return (
    <Stage
      wide
      align="top"
      status="Click a block above or a turn below to open its trace."
      actions={PICKS.map((item, index) => ({ label: item.label, pressed: pick === index, onClick: () => setPick(index) }))}
    >
      <div className="mx-auto w-full max-w-6xl">
        <SessionView key={pick} session={PICKS[pick].session} loadIo={loadSampleIo} />
      </div>
    </Stage>
  );
}

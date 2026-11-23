"use client";

import { useState } from "react";
import Stage from "@/components/examples/Stage";
import { AGENT_SESSION } from "../_langfuse/fixtures/agent-session";
import { loadSampleIo } from "../_langfuse/fixtures/sample-io";
import { toSession } from "../_langfuse/to-trace";
import { TraceView } from "../_langfuse/trace-view";

const traces = toSession(AGENT_SESSION).traces;
const PICKS = [
  { label: "Long run", trace: traces.find((trace) => trace.nodes.length > 20) ?? traces[0] },
  { label: "Failed run", trace: traces.find((trace) => trace.totals.errors > 0) ?? traces[0] },
  { label: "Priced run", trace: traces.find((trace) => trace.totals.cost !== null) ?? traces[0] },
];

export default function Demo() {
  const [pick, setPick] = useState(0);
  return (
    <Stage
      wide
      align="top"
      status="Click a step for its details. Use the arrow keys to move and fold."
      actions={PICKS.map((item, index) => ({ label: item.label, pressed: pick === index, onClick: () => setPick(index) }))}
    >
      <div className="mx-auto w-full max-w-6xl">
        <TraceView key={PICKS[pick].trace.id} trace={PICKS[pick].trace} loadIo={loadSampleIo} />
      </div>
    </Stage>
  );
}

"use client";

import Stage from "@/components/examples/Stage";
import { LiveSession } from "../_live-session/live-session";
import { SCRIPT } from "../_live-session/script";
import { useLiveSession } from "../_live-session/use-live-session";

export default function Demo() {
  const { state, elapsed, send, replay } = useLiveSession(SCRIPT);
  return (
    <Stage wide status="Click an agent to follow its steps. Type @ to name one." onReplay={replay}>
      <LiveSession agents={SCRIPT.agents} session={state} agentCount={SCRIPT.agentCount} elapsed={elapsed} onSend={send} />
    </Stage>
  );
}

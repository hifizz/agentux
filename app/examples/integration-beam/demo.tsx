"use client";

import { useCallback, useState } from "react";
import Stage from "@/components/examples/Stage";
import { IntegrationBeam } from "../_integration-beam/integration-beam";
import type { BeamTool } from "../_integration-beam/types";
import { FigmaMark, GmailMark, GoogleDriveMark, LinearMark, NotionMark, SlackMark } from "../_shared/ui/icons";

const LEFT: BeamTool[] = [
  { name: "Slack", logo: <SlackMark /> },
  { name: "Notion", logo: <NotionMark /> },
  { name: "Gmail", logo: <GmailMark /> },
];

const RIGHT: BeamTool[] = [
  { name: "Linear", logo: <LinearMark style={{ color: "#5e6ad2" }} /> },
  { name: "Google Drive", logo: <GoogleDriveMark /> },
  { name: "Figma", logo: <FigmaMark /> },
];

export default function Demo() {
  const [run, setRun] = useState(0);
  const replay = useCallback(() => setRun((r) => r + 1), []);
  return (
    <Stage status="Pulses flow on their own. Hover a tool to focus its beam, click or press Enter to pause it." onReplay={replay}>
      <div className="mx-auto w-full max-w-[640px] rounded-3xl px-4 py-10 [background-image:radial-gradient(circle,rgba(0,0,0,0.075)_1px,transparent_1.4px)] [background-size:18px_18px] [background-position:50%_center] dark:[background-image:radial-gradient(circle,rgba(255,255,255,0.06)_1px,transparent_1.4px)]">
        <IntegrationBeam key={run} center={{ name: "Merge" }} left={LEFT} right={RIGHT} />
      </div>
    </Stage>
  );
}

import type { Metadata } from "next";
import ExamplePage from "@/components/examples/ExamplePage";
import { agentCheckpoints } from "@/lib/components";
import Demo from "./demo";

export const metadata: Metadata = { title: agentCheckpoints.name, description: agentCheckpoints.description };

export default function AgentCheckpointsPage() {
  return (
    <ExamplePage item={agentCheckpoints}>
      <Demo />
    </ExamplePage>
  );
}

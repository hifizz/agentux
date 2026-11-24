import type { Metadata } from "next";
import ExamplePage from "@/components/examples/ExamplePage";
import { agentTrail } from "@/lib/components";
import Demo from "./demo";

export const metadata: Metadata = { title: agentTrail.name, description: agentTrail.description };

export default function AgentTrailPage() {
  return (
    <ExamplePage item={agentTrail}>
      <Demo />
    </ExamplePage>
  );
}

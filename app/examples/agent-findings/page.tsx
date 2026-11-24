import type { Metadata } from "next";
import ExamplePage from "@/components/examples/ExamplePage";
import { agentFindings } from "@/lib/components";
import Demo from "./demo";

export const metadata: Metadata = { title: agentFindings.name, description: agentFindings.description };

export default function AgentFindingsPage() {
  return <ExamplePage item={agentFindings}><Demo /></ExamplePage>;
}

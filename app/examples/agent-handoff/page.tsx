import type { Metadata } from "next";
import ExamplePage from "@/components/examples/ExamplePage";
import { agentHandoff } from "@/lib/components";
import Demo from "./demo";

export const metadata: Metadata = { title: agentHandoff.name, description: agentHandoff.description };

export default function AgentHandoffPage() {
  return <ExamplePage item={agentHandoff}><Demo /></ExamplePage>;
}

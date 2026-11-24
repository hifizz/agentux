import type { Metadata } from "next";
import ExamplePage from "@/components/examples/ExamplePage";
import { agentCrew } from "@/lib/components";
import Demo from "./demo";

export const metadata: Metadata = { title: agentCrew.name, description: agentCrew.description };

export default function AgentCrewPage() {
  return <ExamplePage item={agentCrew}><Demo /></ExamplePage>;
}

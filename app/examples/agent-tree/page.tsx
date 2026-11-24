import type { Metadata } from "next";
import ExamplePage from "@/components/examples/ExamplePage";
import { agentTree } from "@/lib/components";
import Demo from "./demo";

export const metadata: Metadata = { title: agentTree.name, description: agentTree.description };

export default function AgentTreePage() {
  return <ExamplePage item={agentTree}><Demo /></ExamplePage>;
}

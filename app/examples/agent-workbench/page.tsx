import type { Metadata } from "next";
import ExamplePage from "@/components/examples/ExamplePage";
import { agentWorkbench } from "@/lib/components";
import Demo from "./demo";

export const metadata: Metadata = { title: agentWorkbench.name, description: agentWorkbench.description };

export default function AgentWorkbenchPage() {
  return <ExamplePage item={agentWorkbench}><Demo /></ExamplePage>;
}

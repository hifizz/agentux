import type { Metadata } from "next";
import ExamplePage from "@/components/examples/ExamplePage";
import { agentMonitor } from "@/lib/components";
import Demo from "./demo";

export const metadata: Metadata = { title: agentMonitor.name, description: agentMonitor.description };

export default function AgentMonitorPage() {
  return <ExamplePage item={agentMonitor}><Demo /></ExamplePage>;
}

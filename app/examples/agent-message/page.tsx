import type { Metadata } from "next";
import ExamplePage from "@/components/examples/ExamplePage";
import { agentMessage } from "@/lib/components";
import Demo from "./demo";

export const metadata: Metadata = { title: agentMessage.name, description: agentMessage.description };

export default function AgentMessage() {
  return (
    <ExamplePage item={agentMessage}>
      <Demo />
    </ExamplePage>
  );
}

import type { Metadata } from "next";
import ExamplePage from "@/components/examples/ExamplePage";
import { subagentSwarm } from "@/lib/components";
import Demo from "./demo";

export const metadata: Metadata = { title: subagentSwarm.name, description: subagentSwarm.description };

export default function SubagentSwarm() {
  return (
    <ExamplePage item={subagentSwarm}>
      <Demo />
    </ExamplePage>
  );
}

import type { Metadata } from "next";
import ExamplePage from "@/components/examples/ExamplePage";
import { toolSteps } from "@/lib/components";
import Demo from "./demo";

export const metadata: Metadata = { title: toolSteps.name, description: toolSteps.description };

export default function ToolSteps() {
  return (
    <ExamplePage item={toolSteps} note="Click a row to expand it">
      <Demo />
    </ExamplePage>
  );
}

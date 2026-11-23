import type { Metadata } from "next";
import ExamplePage from "@/components/examples/ExamplePage";
import { toolOutput } from "@/lib/components";
import Demo from "./demo";

export const metadata: Metadata = { title: toolOutput.name, description: toolOutput.description };

export default function ToolOutputExample() {
  return (
    <ExamplePage item={toolOutput}>
      <Demo />
    </ExamplePage>
  );
}

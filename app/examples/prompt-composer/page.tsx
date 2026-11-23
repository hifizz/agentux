import type { Metadata } from "next";
import ExamplePage from "@/components/examples/ExamplePage";
import { promptComposer } from "@/lib/components";
import Demo from "./demo";

export const metadata: Metadata = { title: promptComposer.name, description: promptComposer.description };

export default function PromptComposerExample() {
  return (
    <ExamplePage item={promptComposer}>
      <Demo />
    </ExamplePage>
  );
}

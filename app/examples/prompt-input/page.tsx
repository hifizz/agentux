import type { Metadata } from "next";
import ExamplePage from "@/components/examples/ExamplePage";
import { promptInput } from "@/lib/components";
import Demo from "./demo";

export const metadata: Metadata = { title: promptInput.name, description: promptInput.description };

export default function PromptInputPage() {
  return (
    <ExamplePage item={promptInput} note="Press Enter to send, Shift + Enter for a new line">
      <Demo />
    </ExamplePage>
  );
}

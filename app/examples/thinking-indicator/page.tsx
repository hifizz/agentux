import type { Metadata } from "next";
import ExamplePage from "@/components/examples/ExamplePage";
import { thinkingIndicator } from "@/lib/components";
import Demo from "./demo";

export const metadata: Metadata = { title: thinkingIndicator.name, description: thinkingIndicator.description };

export default function ThinkingIndicator() {
  return (
    <ExamplePage item={thinkingIndicator}>
      <Demo />
    </ExamplePage>
  );
}

import type { Metadata } from "next";
import ExamplePage from "@/components/examples/ExamplePage";
import { thinkingState } from "@/lib/components";
import Demo from "./demo";

export const metadata: Metadata = { title: thinkingState.name, description: thinkingState.description };

export default function ThinkingStatePage() {
  return (
    <ExamplePage item={thinkingState}>
      <Demo />
    </ExamplePage>
  );
}

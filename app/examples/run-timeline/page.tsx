import type { Metadata } from "next";
import ExamplePage from "@/components/examples/ExamplePage";
import { runTimeline } from "@/lib/components";
import Demo from "./demo";

export const metadata: Metadata = { title: runTimeline.name, description: runTimeline.description };

export default function RunTimelinePage() {
  return (
    <ExamplePage item={runTimeline} note="Click a step to select it">
      <Demo />
    </ExamplePage>
  );
}

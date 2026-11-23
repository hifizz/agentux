import type { Metadata } from "next";
import ExamplePage from "@/components/examples/ExamplePage";
import { traceWaterfall } from "@/lib/components";
import Demo from "./demo";

export const metadata: Metadata = { title: traceWaterfall.name, description: traceWaterfall.description };

export default function TraceWaterfallPage() {
  return (
    <ExamplePage item={traceWaterfall} note="Click a row for its details">
      <Demo />
    </ExamplePage>
  );
}

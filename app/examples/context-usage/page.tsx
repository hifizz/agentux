import type { Metadata } from "next";
import ExamplePage from "@/components/examples/ExamplePage";
import { contextUsage } from "@/lib/components";
import Demo from "./demo";

export const metadata: Metadata = { title: contextUsage.name, description: contextUsage.description };

export default function ContextUsagePage() {
  return (
    <ExamplePage item={contextUsage} note="Hover the ring for the breakdown">
      <Demo />
    </ExamplePage>
  );
}

import type { Metadata } from "next";
import ExamplePage from "@/components/examples/ExamplePage";
import { contextWindow } from "@/lib/components";
import Demo from "./demo";

export const metadata: Metadata = { title: contextWindow.name, description: contextWindow.description };

export default function ContextWindowPage() {
  return (
    <ExamplePage item={contextWindow} note="Pick a presentation on the toolbar">
      <Demo />
    </ExamplePage>
  );
}

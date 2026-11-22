import type { Metadata } from "next";
import ExamplePage from "@/components/examples/ExamplePage";
import { markdownRenderer } from "@/lib/components";
import Demo from "./demo";

export const metadata: Metadata = { title: markdownRenderer.name, description: markdownRenderer.description };

export default function MarkdownExample() {
  return (
    <ExamplePage item={markdownRenderer}>
      <Demo />
    </ExamplePage>
  );
}

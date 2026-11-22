import type { Metadata } from "next";
import ExamplePage from "@/components/examples/ExamplePage";
import { thinkingBlock } from "@/lib/components";
import Demo from "./demo";

export const metadata: Metadata = { title: thinkingBlock.name, description: thinkingBlock.description };

export default function ThinkingExample() {
  return (
    <ExamplePage item={thinkingBlock}>
      <Demo />
    </ExamplePage>
  );
}

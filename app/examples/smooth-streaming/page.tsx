import type { Metadata } from "next";
import ExamplePage from "@/components/examples/ExamplePage";
import { smoothStreaming } from "@/lib/components";
import Demo from "./demo";

export const metadata: Metadata = { title: smoothStreaming.name, description: smoothStreaming.description };

export default function SmoothStreaming() {
  return (
    <ExamplePage item={smoothStreaming}>
      <Demo />
    </ExamplePage>
  );
}

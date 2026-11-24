import type { Metadata } from "next";
import ExamplePage from "@/components/examples/ExamplePage";
import { runningNow } from "@/lib/components";
import Demo from "./demo";

export const metadata: Metadata = { title: runningNow.name, description: runningNow.description };

export default function RunningNowPage() {
  return (
    <ExamplePage item={runningNow}>
      <Demo />
    </ExamplePage>
  );
}

import type { Metadata } from "next";
import ExamplePage from "@/components/examples/ExamplePage";
import { queueSteer } from "@/lib/components";
import Demo from "./demo";

export const metadata: Metadata = { title: queueSteer.name, description: queueSteer.description };

export default function QueueSteerPage() {
  return (
    <ExamplePage item={queueSteer} note="Send while the run is going">
      <Demo />
    </ExamplePage>
  );
}

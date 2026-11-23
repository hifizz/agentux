import type { Metadata } from "next";
import ExamplePage from "@/components/examples/ExamplePage";
import { liveSession } from "@/lib/components";
import Demo from "./demo";

export const metadata: Metadata = { title: liveSession.name, description: liveSession.description };

export default function LiveSessionPage() {
  return (
    <ExamplePage item={liveSession} note="Click an agent tab to follow its steps">
      <Demo />
    </ExamplePage>
  );
}

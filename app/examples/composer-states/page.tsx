import type { Metadata } from "next";
import ExamplePage from "@/components/examples/ExamplePage";
import { composerStates } from "@/lib/components";
import Demo from "./demo";

export const metadata: Metadata = { title: composerStates.name, description: composerStates.description };

export default function ComposerStatesPage() {
  return (
    <ExamplePage item={composerStates} note="Every sample is live">
      <Demo />
    </ExamplePage>
  );
}

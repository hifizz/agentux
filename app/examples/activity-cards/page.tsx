import type { Metadata } from "next";
import ExamplePage from "@/components/examples/ExamplePage";
import { activityCards } from "@/lib/components";
import Demo from "./demo";

export const metadata: Metadata = { title: activityCards.name, description: activityCards.description };

export default function ActivityCards() {
  return (
    <ExamplePage item={activityCards} note="Click a file or a card">
      <Demo />
    </ExamplePage>
  );
}

import type { Metadata } from "next";
import ExamplePage from "@/components/examples/ExamplePage";
import { suggestions } from "@/lib/components";
import Demo from "./demo";

export const metadata: Metadata = { title: suggestions.name, description: suggestions.description };

export default function Suggestions() {
  return (
    <ExamplePage item={suggestions} note="Hover a tool mark for its name">
      <Demo />
    </ExamplePage>
  );
}

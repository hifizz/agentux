import type { Metadata } from "next";
import ExamplePage from "@/components/examples/ExamplePage";
import { webSearch } from "@/lib/components";
import Demo from "./demo";

export const metadata: Metadata = { title: webSearch.name, description: webSearch.description };

export default function WebSearchExample() {
  return (
    <ExamplePage item={webSearch}>
      <Demo />
    </ExamplePage>
  );
}

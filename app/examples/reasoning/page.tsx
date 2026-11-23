import type { Metadata } from "next";
import ExamplePage from "@/components/examples/ExamplePage";
import { reasoning } from "@/lib/components";
import Demo from "./demo";

export const metadata: Metadata = { title: reasoning.name, description: reasoning.description };

export default function Reasoning() {
  return (
    <ExamplePage item={reasoning} note="Click a row to open or close it">
      <Demo />
    </ExamplePage>
  );
}

import type { Metadata } from "next";
import ExamplePage from "@/components/examples/ExamplePage";
import { modelMenu } from "@/lib/components";
import Demo from "./demo";

export const metadata: Metadata = { title: modelMenu.name, description: modelMenu.description };

export default function ModelMenuPage() {
  return (
    <ExamplePage item={modelMenu}>
      <Demo />
    </ExamplePage>
  );
}

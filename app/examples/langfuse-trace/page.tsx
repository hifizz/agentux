import type { Metadata } from "next";
import ExamplePage from "@/components/examples/ExamplePage";
import { langfuseTrace } from "@/lib/components";
import Demo from "./demo";

export const metadata: Metadata = { title: langfuseTrace.name, description: langfuseTrace.description };

export default function LangfuseTracePage() {
  return (
    <ExamplePage item={langfuseTrace} note="Click a step for its details">
      <Demo />
    </ExamplePage>
  );
}

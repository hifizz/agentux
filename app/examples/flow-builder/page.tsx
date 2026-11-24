import type { Metadata } from "next";
import ExamplePage from "@/components/examples/ExamplePage";
import { flowBuilder } from "@/lib/components";
import Demo from "./demo";

export const metadata: Metadata = { title: flowBuilder.name, description: flowBuilder.description };

export default function FlowBuilderPage() {
  return <ExamplePage item={flowBuilder}><Demo /></ExamplePage>;
}

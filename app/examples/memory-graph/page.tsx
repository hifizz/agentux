import type { Metadata } from "next";
import ExamplePage from "@/components/examples/ExamplePage";
import { memoryGraph } from "@/lib/components";
import Demo from "./demo";

export const metadata: Metadata = { title: memoryGraph.name, description: memoryGraph.description };

export default function MemoryGraphPage() {
  return <ExamplePage item={memoryGraph}><Demo /></ExamplePage>;
}

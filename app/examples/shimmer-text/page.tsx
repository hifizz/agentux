import type { Metadata } from "next";
import ExamplePage from "@/components/examples/ExamplePage";
import { shimmerText } from "@/lib/components";
import Demo from "./demo";

export const metadata: Metadata = { title: shimmerText.name, description: shimmerText.description };

export default function ShimmerTextExample() {
  return (
    <ExamplePage item={shimmerText}>
      <Demo />
    </ExamplePage>
  );
}

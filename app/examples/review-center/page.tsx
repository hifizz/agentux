import type { Metadata } from "next";
import ExamplePage from "@/components/examples/ExamplePage";
import { reviewCenter } from "@/lib/components";
import Demo from "./demo";

export const metadata: Metadata = { title: reviewCenter.name, description: reviewCenter.description };

export default function ReviewCenterPage() {
  return <ExamplePage item={reviewCenter}><Demo /></ExamplePage>;
}

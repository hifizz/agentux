import type { Metadata } from "next";
import ExamplePage from "@/components/examples/ExamplePage";
import { plan } from "@/lib/components";
import Demo from "./demo";

export const metadata: Metadata = { title: plan.name, description: plan.description };

export default function PlanExample() {
  return <ExamplePage item={plan}><Demo /></ExamplePage>;
}

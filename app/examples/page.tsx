import type { Metadata } from "next";
import ComponentsShowcase from "@/components/ComponentsShowcase";

export const metadata: Metadata = { title: "Examples" };

export default function Examples() {
  return <ComponentsShowcase catalog />;
}

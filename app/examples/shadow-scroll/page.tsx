import type { Metadata } from "next";
import ExamplePage from "@/components/examples/ExamplePage";
import { shadowScroll } from "@/lib/components";
import Demo from "./demo";

export const metadata: Metadata = { title: shadowScroll.name, description: shadowScroll.description };

export default function ShadowScrollExample() {
  return (
    <ExamplePage item={shadowScroll}>
      <Demo />
    </ExamplePage>
  );
}

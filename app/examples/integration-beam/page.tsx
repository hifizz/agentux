import type { Metadata } from "next";
import ExamplePage from "@/components/examples/ExamplePage";
import { integrationBeam } from "@/lib/components";
import Demo from "./demo";

export const metadata: Metadata = { title: integrationBeam.name, description: integrationBeam.description };

export default function IntegrationBeamPage() {
  return (
    <ExamplePage item={integrationBeam}>
      <Demo />
    </ExamplePage>
  );
}

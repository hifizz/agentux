import type { Metadata } from "next";
import ExamplePage from "@/components/examples/ExamplePage";
import { approvals } from "@/lib/components";
import Demo from "./demo";

export const metadata: Metadata = { title: approvals.name, description: approvals.description };

export default function Approvals() {
  return (
    <ExamplePage item={approvals} note="Reset brings the requests back">
      <Demo />
    </ExamplePage>
  );
}

import type { Metadata } from "next";
import ExamplePage from "@/components/examples/ExamplePage";
import { topTray } from "@/lib/components";
import Demo from "./demo";

export const metadata: Metadata = { title: topTray.name, description: topTray.description };

export default function TopTrayPage() {
  return (
    <ExamplePage item={topTray} note="Pick a strip above">
      <Demo />
    </ExamplePage>
  );
}

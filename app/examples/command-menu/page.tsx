import type { Metadata } from "next";
import ExamplePage from "@/components/examples/ExamplePage";
import { commandMenu } from "@/lib/components";
import Demo from "./demo";

export const metadata: Metadata = { title: commandMenu.name, description: commandMenu.description };

export default function CommandMenuPage() {
  return (
    <ExamplePage item={commandMenu}>
      <Demo />
    </ExamplePage>
  );
}

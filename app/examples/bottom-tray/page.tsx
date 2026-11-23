import type { Metadata } from "next";
import ExamplePage from "@/components/examples/ExamplePage";
import { bottomTray } from "@/lib/components";
import Demo from "./demo";

export const metadata: Metadata = { title: bottomTray.name, description: bottomTray.description };

export default function BottomTrayPage() {
  return (
    <ExamplePage item={bottomTray} note="Every chip opens a Base UI popup">
      <Demo />
    </ExamplePage>
  );
}

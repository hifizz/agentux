import type { Metadata } from "next";
import ExamplePage from "@/components/examples/ExamplePage";
import { delegateBoard } from "@/lib/components";
import Demo from "./demo";

export const metadata: Metadata = { title: delegateBoard.name, description: delegateBoard.description };

export default function DelegateBoardPage() {
  return (
    <ExamplePage item={delegateBoard}>
      <Demo />
    </ExamplePage>
  );
}

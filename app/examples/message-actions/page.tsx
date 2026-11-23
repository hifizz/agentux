import type { Metadata } from "next";
import ExamplePage from "@/components/examples/ExamplePage";
import { messageActions } from "@/lib/components";
import Demo from "./demo";

export const metadata: Metadata = { title: messageActions.name, description: messageActions.description };

export default function MessageActionsExample() {
  return (
    <ExamplePage item={messageActions}>
      <Demo />
    </ExamplePage>
  );
}

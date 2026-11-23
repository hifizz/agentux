import type { Metadata } from "next";
import ExamplePage from "@/components/examples/ExamplePage";
import { langfuseSession } from "@/lib/components";
import Demo from "./demo";

export const metadata: Metadata = { title: langfuseSession.name, description: langfuseSession.description };

export default function LangfuseSessionPage() {
  return (
    <ExamplePage item={langfuseSession} note="Click a turn to open its trace">
      <Demo />
    </ExamplePage>
  );
}

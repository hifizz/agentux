import type { Metadata } from "next";
import ExamplePage from "@/components/examples/ExamplePage";
import { workLog } from "@/lib/components";
import Demo from "./demo";

export const metadata: Metadata = { title: workLog.name, description: workLog.description };

export default function WorkLogExample() {
  return (
    <ExamplePage item={workLog}>
      <Demo />
    </ExamplePage>
  );
}

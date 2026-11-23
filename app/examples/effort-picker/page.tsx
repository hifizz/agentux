import type { Metadata } from "next";
import ExamplePage from "@/components/examples/ExamplePage";
import { effortPicker } from "@/lib/components";
import Demo from "./demo";

export const metadata: Metadata = { title: effortPicker.name, description: effortPicker.description };

export default function EffortPickerPage() {
  return (
    <ExamplePage item={effortPicker} note="Pick a model above to change the levels">
      <Demo />
    </ExamplePage>
  );
}

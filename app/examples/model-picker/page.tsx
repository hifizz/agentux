import type { Metadata } from "next";
import ExamplePage from "@/components/examples/ExamplePage";
import { modelPicker } from "@/lib/components";
import Demo from "./demo";

export const metadata: Metadata = { title: modelPicker.name, description: modelPicker.description };

export default function ModelPickerPage() {
  return (
    <ExamplePage item={modelPicker} note="Type to filter, arrow keys preview a model">
      <Demo />
    </ExamplePage>
  );
}

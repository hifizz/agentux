import type { Metadata } from "next";
import ExamplePage from "@/components/examples/ExamplePage";
import { directoryPicker } from "@/lib/components";
import Demo from "./demo";

export const metadata: Metadata = { title: directoryPicker.name, description: directoryPicker.description };

export default function DirectoryPickerPage() {
  return (
    <ExamplePage item={directoryPicker} note="Type a path that starts with / or ~ to open it">
      <Demo />
    </ExamplePage>
  );
}

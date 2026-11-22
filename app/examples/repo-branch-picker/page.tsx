import type { Metadata } from "next";
import ExamplePage from "@/components/examples/ExamplePage";
import { repoBranchPicker } from "@/lib/components";
import Demo from "./demo";

export const metadata: Metadata = { title: repoBranchPicker.name, description: repoBranchPicker.description };

export default function RepoBranchPickerPage() {
  return (
    <ExamplePage item={repoBranchPicker} note="Type a new branch name to create it">
      <Demo />
    </ExamplePage>
  );
}

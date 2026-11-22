import type { Metadata } from "next";
import ExamplePage from "@/components/examples/ExamplePage";
import { permissionPicker } from "@/lib/components";
import Demo from "./demo";

export const metadata: Metadata = { title: permissionPicker.name, description: permissionPicker.description };

export default function PermissionPickerPage() {
  return (
    <ExamplePage item={permissionPicker} note="Arrow keys move, Enter picks">
      <Demo />
    </ExamplePage>
  );
}

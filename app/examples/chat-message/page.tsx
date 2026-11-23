import type { Metadata } from "next";
import ExamplePage from "@/components/examples/ExamplePage";
import { chatMessage } from "@/lib/components";
import Demo from "./demo";

export const metadata: Metadata = { title: chatMessage.name, description: chatMessage.description };

export default function ChatMessage() {
  return (
    <ExamplePage item={chatMessage} note="Click Replay to stream the turn again">
      <Demo />
    </ExamplePage>
  );
}

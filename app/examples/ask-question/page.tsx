import type { Metadata } from "next";
import ExamplePage from "@/components/examples/ExamplePage";
import { askQuestion } from "@/lib/components";
import Demo from "./demo";

export const metadata: Metadata = { title: askQuestion.name, description: askQuestion.description };

export default function AskQuestion() {
  return (
    <ExamplePage item={askQuestion} note="Enter continues to the next question">
      <Demo />
    </ExamplePage>
  );
}

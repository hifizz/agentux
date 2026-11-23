import type { TraceNode } from "../model";
import type { NodeIo } from "../use-node-io";

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

export async function loadSampleIo(node: TraceNode): Promise<NodeIo> {
  await wait(450);
  if (node.kind === "generation") {
    return {
      input: JSON.stringify(
        [
          { role: "system", content: "You are a research assistant. Cite every source you use." },
          { role: "user", content: "Compare the free tiers of three project tools and summarize the limits." },
        ],
        null,
        2,
      ),
      output: node.status === "error" ? undefined : "All three keep a free tier. Two of them cap guests or issues; none cap seats.\n\nSources: the pricing pages read in the previous steps.",
    };
  }
  if (node.kind === "tool") return { input: JSON.stringify({ url: "https://example.com/pricing" }, null, 2), output: "Fetched 18 KB. Title: Pricing. Sections: Free, Pro, Team." };
  return { input: JSON.stringify({ step: node.name }, null, 2) };
}

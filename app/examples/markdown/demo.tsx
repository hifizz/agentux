"use client";

import { useState } from "react";
import Stage from "@/components/examples/Stage";
import { useStream } from "@/components/examples/use-script";
import { Markdown } from "../_message/markdown";

export const SAMPLE = `# Heading one
## Heading two
### Heading three
#### Heading four

A paragraph with **bold**, *italic*, ***both***, ~~strikethrough~~, \`inline code\` and a [link](https://example.com). Line one
continues on the same line, and a hard break ends here.

> A blockquote keeps its own color.
>
> > Nested quotes work too.

- An unordered item
- Another item
  - A nested item
  - With \`code\`
1. Ordered first
2. Ordered second
   1. Nested ordered

- [x] Write the renderer
- [ ] Add citations
- [ ] Ship it

| Part | Status | Owner |
| :--- | :----: | ----: |
| Markdown | done | Ada |
| Tool output | in review | Lin |
| Swarm | queued | Sam |

\`\`\`tsx
export function Greeting({ name }: { name: string }) {
  return <p className="text-ch-ink">Hello, {name}</p>;
}
\`\`\`

\`\`\`bash
npm run lint && npm run build
\`\`\`

---

Footnotes and autolinks: https://github.com/hifizz/agentux reads as a link.[^1]

[^1]: A footnote at the end of the message.

中文排版也要正常：模型输出可能混排 English 和中文，标点不该被拆开。`;

export default function Demo() {
  const [streaming, setStreaming] = useState(false);
  const [run, setRun] = useState(0);
  return (
    <Stage
      status={streaming ? "Streaming the same text with unfinished syntax closed on the fly" : "Static render of every supported format"}
      actions={[
        { label: "Static", pressed: !streaming, onClick: () => setStreaming(false) },
        { label: "Streaming", pressed: streaming, onClick: () => { setStreaming(true); setRun((r) => r + 1); } },
      ]}
    >
      <div className="mx-auto w-full max-w-2xl px-6 py-8">
        {streaming ? <Live key={run} /> : <Markdown>{SAMPLE}</Markdown>}
      </div>
    </Stage>
  );
}

function Live() {
  const s = useStream(SAMPLE, true, 6, 24);
  return <Markdown streaming={!s.done}>{s.text}</Markdown>;
}

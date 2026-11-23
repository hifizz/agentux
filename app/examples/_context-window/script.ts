import type { Prompt, PromptCache, PromptPart, SessionPoint } from "./types";

export const WINDOW = 1_000_000;

const small = (prefix: string, count: number, total: number, tag?: string) =>
  Array.from({ length: count }, (_, i) => ({ name: `${prefix}${i + 1}`, tag, tokens: Math.round(total / count) }));

const FILES = [
  { name: "Image", tag: "image", tokens: 56_800 },
  { name: "CLAUDE.md", tag: "project", tokens: 2_100 },
  ...Array.from({ length: 32 }, (_, i) => ({ name: `src/api/route-${i + 1}.ts`, tag: "read", tokens: 100 })),
];

const TURNS = [[14, 71_900], [3, 62_200], [7, 49_300], [9, 26_800], [6, 24_300], [2, 14_500], [13, 14_500], [1, 5_500]]
  .map(([n, tokens]) => ({ name: String(n), tag: "turn", tokens }))
  .concat([4, 5, 8, 10, 11, 12].map((n, i) => ({ name: String(n), tag: "turn", tokens: [2_100, 1_900, 1_700, 1_800, 1_300, 1_300][i] })));

const FINAL_PARTS: PromptPart[] = [
  { kind: "system", tokens: 25_200, items: [{ name: "prompt", tokens: 25_200 }] },
  { kind: "tools", tokens: 10_300, items: small("tool_", 8, 10_300, "namespace") },
  { kind: "files", tokens: 62_000, items: FILES },
  { kind: "results", tokens: 169_000, items: [{ name: "bash", tag: "result", n: 154, tokens: 169_000 }] },
  { kind: "chat", tokens: 279_100, items: TURNS },
];

export const FINAL: Prompt = { window: WINDOW, tokens: 545_600, counted: true, turns: 14, parts: FINAL_PARTS };

export const FINAL_CACHE: PromptCache = { read: 544_000, total: 545_600 };

const SHARES = [0.52, 0.64, 0.74, 0.83, 0.92, 1];

function scaled(share: number): Prompt {
  const parts = FINAL_PARTS.map((part) => ({
    ...part,
    tokens: Math.round(part.tokens * share),
    items: part.items?.map((item) => ({ ...item, tokens: Math.round(item.tokens * share) })),
  }));
  return { ...FINAL, tokens: parts.reduce((sum, part) => sum + part.tokens, 0), parts };
}

export const REQUESTS = SHARES.map(scaled);

export const REQUEST_CACHES: PromptCache[] = REQUESTS.map((prompt) => ({ read: Math.round(prompt.tokens * 0.995), total: prompt.tokens }));

const PER_TURN = [2, 2, 3, 2, 4, 3, 5, 4, 6, 6, 5, 7, 7, 4];
const STEP = 2_336;
const START = 40_000;
const JUMP = (545_600 - START - (PER_TURN.reduce((a, b) => a + b, 0) - PER_TURN.length) * STEP) / (PER_TURN.length - 1);

export const SESSION: SessionPoint[] = (() => {
  const points: SessionPoint[] = [];
  PER_TURN.forEach((count, turn) => {
    const base = Math.round(START + turn * JUMP + PER_TURN.slice(0, turn).reduce((s, n) => s + n - 1, 0) * STEP);
    for (let k = 0; k < count; k++) points.push({ id: `r${points.length + 1}`, tokens: base + k * STEP });
  });
  return points;
})();

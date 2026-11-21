
export const EFFORT_LEVELS = ["off", "minimal", "low", "medium", "high", "xhigh", "max"] as const;
export type EffortLevel = (typeof EFFORT_LEVELS)[number];

export type ModelVendor = "anthropic" | "openai" | "other";

export type ModelCost = { input: number; output: number; cacheRead: number; cacheWrite: number };

export type ModelCard = {
  key: string;
  provider: string;
  id: string;
  name: string;
  vendor: ModelVendor;
  contextWindow: number;
  maxOutput: number;
  inputs: readonly ("text" | "image")[];
  effort: { levels: readonly [EffortLevel, ...EffortLevel[]]; default: EffortLevel };
  cost: ModelCost | null;
  recommended?: boolean;
};

export type ModelSelection = { key: string; effort: EffortLevel };

export function findModel(catalog: readonly ModelCard[], key: string): ModelCard | undefined {
  return catalog.find((m) => m.key === key);
}

export function selectModel(card: ModelCard, previous?: EffortLevel): ModelSelection {
  const effort = previous && (previous === "off" || card.effort.levels.includes(previous)) ? previous : card.effort.default;
  return { key: card.key, effort };
}

export function modelCardFromId(provider: string, id: string): ModelCard {
  return { key: `${provider}/${id}`, provider, id, name: id, vendor: "other", contextWindow: 0, maxOutput: 0, inputs: ["text"], effort: { levels: ["off"], default: "off" }, cost: null };
}

const DEMO_PROVIDER = "demo";
const demo = (m: Omit<ModelCard, "key" | "provider" | "inputs"> & { inputs?: ModelCard["inputs"] }): ModelCard => ({
  ...m,
  key: `${DEMO_PROVIDER}/${m.id}`,
  provider: DEMO_PROVIDER,
  inputs: m.inputs ?? ["text", "image"],
});

const FULL: ModelCard["effort"] = { levels: ["low", "medium", "high", "xhigh", "max"], default: "medium" };
const STANDARD: ModelCard["effort"] = { levels: ["low", "medium", "high"], default: "medium" };

export const DEMO_MODELS: readonly ModelCard[] = [
  demo({ id: "fable-5", name: "Fable 5", vendor: "anthropic", contextWindow: 1_000_000, maxOutput: 64_000, effort: FULL, cost: { input: 10, output: 50, cacheRead: 1, cacheWrite: 12.5 }, recommended: true }),
  demo({ id: "opus-5", name: "Opus 5", vendor: "anthropic", contextWindow: 1_000_000, maxOutput: 64_000, effort: FULL, cost: { input: 5, output: 25, cacheRead: 0.5, cacheWrite: 6.25 }, recommended: true }),
  demo({ id: "sonnet-5", name: "Sonnet 5", vendor: "anthropic", contextWindow: 1_000_000, maxOutput: 64_000, effort: STANDARD, cost: { input: 3, output: 15, cacheRead: 0.3, cacheWrite: 3.75 }, recommended: true }),
  demo({ id: "haiku-4-5", name: "Haiku 4.5", vendor: "anthropic", contextWindow: 200_000, maxOutput: 64_000, effort: { levels: ["off"], default: "off" }, cost: { input: 1, output: 5, cacheRead: 0.1, cacheWrite: 1.25 } }),
  demo({ id: "gpt-5", name: "GPT-5", vendor: "openai", contextWindow: 400_000, maxOutput: 128_000, effort: STANDARD, cost: { input: 1.25, output: 10, cacheRead: 0.125, cacheWrite: 0 } }),
];

export const DEFAULT_DEMO_SELECTION: ModelSelection = selectModel(DEMO_MODELS[0]);

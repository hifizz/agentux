import type { Finding } from "./findings";

const reviewers = [
  { id: "audit", name: "Auditor", model: "Opus 5.5", total: 24, duration: 25000, steps: ["Reviewing the export contract", "Checking required columns", "Reading migration notes", "Comparing output with the spec"] },
  { id: "test", name: "Test runner", model: "GPT-6 Sol", total: 18, duration: 24000, steps: ["Sampling 10k input rows", "Replaying incomplete records", "Reducing a failing example", "Trying alternate locales"] },
  { id: "verify", name: "Verifier", model: "Gemini 3.8 Flash", total: 12, duration: 26000, steps: ["Verifying row count totals", "Checking summary calculations", "Comparing rounded amounts"] },
  { id: "perf", name: "Cost review", model: "Sonnet 5.5", total: 10, duration: 17000, steps: ["Measuring batch reads", "Profiling the preview cache", "Checking repeated queries"] },
] as const;

const report: Finding[] = [
  { id: "cache", agentId: "perf", severity: "note", title: "Column labels can be cached", location: "labels.ts:12", at: -40000 },
  { id: "column", agentId: "audit", severity: "critical", title: "Required column missing from export", location: "export.ts:142", at: 2000 },
  { id: "date", agentId: "test", severity: "warning", title: "Blank date rendered as midnight", location: "format.ts:88", at: 4500 },
  { id: "lookup", agentId: "perf", severity: "note", title: "Batch repeats the same lookup", location: "batch.ts:61", at: 7000 },
  { id: "label", agentId: "audit", severity: "warning", title: "Legacy field still uses the old label", location: "schema.ts:31", at: 9500 },
  { id: "subtotal", agentId: "verify", severity: "critical", title: "Subtotal differs from the sum of the rows", location: "totals.ts:204", at: 12000 },
  { id: "locale", agentId: "test", severity: "warning", title: "Currency label ignores the selected locale", location: "money.ts:57", at: 15000 },
  { id: "round", agentId: "verify", severity: "note", title: "Preview rounds values before grouping", location: "preview.ts:96", at: 18500 },
];

export const cycleMs = 26000;

export function snapshot(now: number) {
  const agents = reviewers.map(({ duration, steps, ...a }) => {
    const ratio = Math.min(1, now / duration);
    const done = Math.floor(a.total * ratio);
    return { ...a, done, step: done === a.total ? "All checks done" : steps[Math.floor(steps.length * ratio)] };
  });
  return { agents, findings: report.filter(f => f.at <= now) };
}

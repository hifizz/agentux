export type Axis = { range: number; ticks: number[] };

export type TagSide = "after" | "inside" | "before";

const NICE_STEPS = [1, 2, 5, 10, 15, 20, 30, 60, 120, 300, 600];

export const percent = (value: number, range: number) => (value / range) * 100;

export function autoAxis(durationMs: number): Axis {
  const raw = Math.max(durationMs * 1.25, 10_000) / 1000;
  const step = NICE_STEPS.find((s) => raw / s <= 5.5) ?? 600;
  const range = Math.ceil(raw / step) * step;
  const ticks: number[] = [];
  for (let v = 0; v < range; v += step) ticks.push(v * 1000);
  return { range: range * 1000, ticks };
}

export function fixedAxis(range: number, every = 10): Axis {
  const ticks: number[] = [];
  for (let value = 0; value <= range; value += every) ticks.push(value);
  return { range, ticks };
}

export function tagSide(start: number, elapsed: number, range: number): TagSide {
  if ((start + elapsed) / range < 0.8) return "after";
  return elapsed / range > 0.28 ? "inside" : "before";
}

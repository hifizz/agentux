import type { Checkpoint, CpLabels } from "./types";

export const ROW_H = 30;
export const RAIL_X = 22;
export const LANE_DX = 14;
export const LIST_MAX = 420;

const indexOf = (rows: Checkpoint[]) => new Map(rows.map((r, i) => [r.id, i]));

// a fork takes the leftmost lane that has no dot below its parent row
export function lanesOf(rows: Checkpoint[]): number[] {
  const idx = indexOf(rows);
  const lanes: number[] = [];
  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    if (i === 0) {
      lanes.push(0);
      continue;
    }
    const p = r.forkOf !== undefined ? idx.get(r.forkOf) : undefined;
    if (r.forkOf !== undefined && p !== undefined) {
      let l = 0;
      while (lanes.some((lane, j) => lane === l && j > p && j < i)) l++;
      lanes.push(l);
    } else {
      lanes.push(lanes[i - 1]);
    }
  }
  return lanes;
}

// live rows are the head row plus its ancestor chain
export function liveIds(rows: Checkpoint[]): Set<string> {
  const idx = indexOf(rows);
  const live = new Set<string>();
  for (let i = rows.length - 1; i >= 0; ) {
    const r = rows[i];
    live.add(r.id);
    if (r.forkOf !== undefined) {
      const p = idx.get(r.forkOf);
      i = p !== undefined && p < i ? p : i - 1;
    } else {
      i--;
    }
  }
  return live;
}

export type RailSeg = { row: string; d: string; live: boolean; fork: boolean };

export function railSegs(rows: Checkpoint[], lanes: number[], live: Set<string>): RailSeg[] {
  const idx = indexOf(rows);
  const segs: RailSeg[] = [];
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    const p = r.forkOf !== undefined ? (idx.get(r.forkOf) ?? i - 1) : i - 1;
    const x1 = RAIL_X + lanes[p] * LANE_DX;
    const x2 = RAIL_X + lanes[i] * LANE_DX;
    const y1 = 15 + p * ROW_H;
    const y2 = 15 + i * ROW_H;
    const fork = r.forkOf !== undefined;
    const d = x1 === x2 ? `M${x1} ${y1}V${y2}` : `M${x1} ${y1}C${x1} ${y1 + 15} ${x2} ${y1 + 12} ${x2} ${y1 + 25.5}V${y2}`;
    segs.push({ row: r.id, d, live: live.has(r.id), fork });
  }
  return segs;
}

export function railWidth(maxLane: number): number {
  return RAIL_X + (maxLane + 1) * LANE_DX;
}

export function ariaOf(row: Checkpoint, isLive: boolean, isHead: boolean, interactive: boolean, L: CpLabels): string {
  const parts = [row.title || L.untitled];
  if (row.attempt !== undefined && row.attempt > 1) parts.push(L.attempt.replace("{n}", String(row.attempt)));
  if (row.status !== "done") parts.push(L[row.status]);
  if (isHead) {
    parts.push(L.current);
    return parts.join(", ");
  }
  if (!isLive) parts.push(L.leftBehind);
  return interactive ? `${parts.join(", ")} – ${L.rewindHint}` : parts.join(", ");
}

export const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function sumOf(rows: Checkpoint[], L: CpLabels): string {
  const n = rows.length;
  const attempts = rows.reduce((m, r) => Math.max(m, r.attempt ?? 1), 1);
  const cost = rows.reduce((s, r) => s + (r.cost ?? 0), 0);
  const cps = n === 1 ? L.checkpoint : L.checkpoints;
  const mid = attempts > 1 ? ` · ${attempts} ${L.attempts}` : "";
  return `${n} ${cps}${mid} · $${cost.toFixed(2)}`;
}

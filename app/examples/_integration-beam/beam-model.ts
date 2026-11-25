export const PULSE_LEN = 84;
export const TRAVEL = 1500;
export const STAGGER = 280;
export const PERIOD = 6000;
export const FIRST_WAVE = 1000;
export const MORPH = 460;
export const FLASH = 640;
export const FIRE_WINDOW = 120;

export type Pt = { x: number; y: number };

export type BeamGeo = { sx: number; sy: number; c1x: number; c1y: number; c2x: number; c2y: number; ex: number; ey: number };

const r2 = (n: number) => Math.round(n * 100) / 100;

export function beamD(g: BeamGeo): string {
  return `M${r2(g.sx)} ${r2(g.sy)}C${r2(g.c1x)} ${r2(g.c1y)} ${r2(g.c2x)} ${r2(g.c2y)} ${r2(g.ex)} ${r2(g.ey)}`;
}

export function beamGeo(a: Pt, b: Pt): BeamGeo {
  if (Math.abs(b.x - a.x) >= Math.abs(b.y - a.y)) {
    const mx = (a.x + b.x) / 2;
    return { sx: a.x, sy: a.y, c1x: mx, c1y: a.y, c2x: mx, c2y: b.y, ex: b.x, ey: b.y };
  }
  const my = (a.y + b.y) / 2;
  return { sx: a.x, sy: a.y, c1x: a.x, c1y: my, c2x: b.x, c2y: my, ex: b.x, ey: b.y };
}

export function lerpGeo(from: BeamGeo, to: BeamGeo, x: number): BeamGeo {
  const l = (u: number, v: number) => u + (v - u) * x;
  return {
    sx: l(from.sx, to.sx),
    sy: l(from.sy, to.sy),
    c1x: l(from.c1x, to.c1x),
    c1y: l(from.c1y, to.c1y),
    c2x: l(from.c2x, to.c2x),
    c2y: l(from.c2y, to.c2y),
    ex: l(from.ex, to.ex),
    ey: l(from.ey, to.ey),
  };
}

export const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export const easeInOutSine = (x: number) => (1 - Math.cos(Math.PI * x)) / 2;

export const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);

export function flashOpacity(elapsed: number): number {
  if (elapsed >= FLASH) return 0;
  return 0.95 * Math.pow(1 - elapsed / FLASH, 1.5);
}

export const fill = (template: string, vars: Record<string, string | number>) =>
  Object.entries(vars).reduce((text, [k, v]) => text.replaceAll(`{${k}}`, String(v)), template);

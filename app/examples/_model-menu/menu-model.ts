import { MM_LABELS, type MenuEffort, type MenuModel, type MmLabels } from "./types";

export const SEGS = 5;
export const METERS = 3;

export const ttfbOf = (m: MenuModel, thinking: boolean, effort: MenuEffort) => (m.stats ? (thinking ? m.stats.ttfb[effort] : m.stats.ttfb.off) : 0);

export const statsOf = (m: MenuModel, thinking: boolean, effort: MenuEffort) =>
  m.stats ? { ttfb: ttfbOf(m, thinking, effort), price: m.stats.price } : null;

export const ariaOf = (m: MenuModel, L: MmLabels = MM_LABELS) =>
  m.stats
    ? `${m.name}, ${m.tagline}. ${L.speed} ${m.stats.speed}, ${L.quality.toLowerCase()} ${m.stats.quality}, ${L.cost.toLowerCase()} ${m.stats.cost} of ${SEGS}`
    : `${m.name}, ${m.tagline}`;

export const speakOf = (m: MenuModel, thinking: boolean, effort: MenuEffort) =>
  m.stats
    ? `${m.name}: about ${ttfbOf(m, thinking, effort).toFixed(1)}s to the first token, $${m.stats.price} per million tokens`
    : `${m.name}: ${m.tagline}`;

export const moveIndex = (count: number, i: number, dir: 1 | -1) => (count ? (i + dir + count) % count : 0);

export const moveEffort = (order: MenuEffort[], cur: MenuEffort, dir: 1 | -1) => order[moveIndex(order.length, Math.max(0, order.indexOf(cur)), dir)];

export const fmtTtfb = (v: number) => `${v.toFixed(1)}s`;

export const fmtPrice = (v: number) => `$${Math.round(v)}`;

import type { Cell, PartKind, Prompt, PromptCache, PromptItem, PromptPart, SessionPoint, Tile } from "./types";

export const PARTS: PartKind[] = ["system", "tools", "skills", "memory", "files", "results", "chat"];

export const PART_NAMES: Record<PartKind, string> = {
  system: "System prompt",
  tools: "Tools",
  skills: "Skills",
  memory: "Memory",
  files: "Files",
  results: "Tool results",
  chat: "Conversation",
};

export const PART_NOTES: Record<PartKind, string> = {
  system: "The agent's own instructions",
  tools: "The definitions of the tools it can call",
  skills: "The skills it can load, by name and what each is for",
  memory: "Instruction files, memory and reminders",
  files: "Files it read, and images",
  results: "What the other tools it called returned",
  chat: "What you and the model said, turn by turn",
};

const ITEM_NAMES: Record<string, string> = {
  prompt: "Agent prompt",
  harness: "Harness messages",
  billing: "Billing header",
  environment: "Environment notes",
  context: "Context",
  skills: "Skills",
  reminders: "System reminders",
  compacted: "Compacted summary",
  image: "Image",
  document: "Document",
};

const TAG_NAMES: Record<string, string> = {
  mcp: "MCP", namespace: "namespace", read: "read", shell: "shell", result: "result",
  user: "user", project: "project", local: "local", memory: "memory", skills: "skills",
  reminder: "reminder", image: "image", turn: "", turns: "", more: "", compacted: "",
};

export const CELLS = 400;
export const TILE_MIN = 1500;
export const TILE_MAX = 12;
export const TILE_FLOOR = 700;
export const TILE_SIDE = 16;

export function formatK(value: number) {
  const n = Math.max(0, Math.round(value || 0));
  const short = (x: number, digits: number) => x.toFixed(digits).replace(/\.0+$/, "");
  if (n >= 1e6) return `${short(n / 1e6, n >= 1e7 ? 1 : 2)}M`;
  if (n >= 1e3) return `${short(n / 1e3, n >= 1e5 ? 0 : 1)}K`;
  return String(n);
}

export const pct = (share: number) => `${Math.round(share * 100)}%`;

export function hitPct(rate: number) {
  const text = (100 * rate).toFixed(2);
  return `${rate < 1 && +text >= 100 ? "99.99" : rate > 0 && +text <= 0 ? "0.01" : text}%`;
}

export function hitTip(read: number | undefined, total: number | undefined) {
  if (!read && read !== 0) return undefined;
  if (!total) return undefined;
  const fmt = new Intl.NumberFormat("en");
  return `${fmt.format(read)} of ${fmt.format(total)} prompt tokens read from the cache: ${+((100 * read) / total).toFixed(6)}%`;
}

export const health = (fill: number): ["ok" | "warn" | "bad", string] =>
  fill < 0.75 ? ["ok", "Healthy"] : fill < 0.9 ? ["warn", "Filling up"] : ["bad", "Near full"];

export function itemName(item: PromptItem) {
  if (item.tag === "turn") return `Turn ${item.name}`;
  if (item.tag === "turns") return `${item.n} earlier turns`;
  if (item.tag === "more") return `${item.n} more`;
  return ITEM_NAMES[item.name] ?? item.name;
}

export const tagOf = (item: PromptItem) => (item.tag === undefined ? "" : item.tag in TAG_NAMES ? TAG_NAMES[item.tag] : item.tag);

export const partOf = (prompt: Prompt, kind: PartKind): PromptPart | undefined => prompt.parts.find((part) => part.kind === kind);

export const partsOf = (prompt: Prompt) => PARTS.map((kind) => partOf(prompt, kind)).filter((part): part is PromptPart => !!part && part.tokens > 0);

export const sortedItems = (part: PromptPart | undefined) => [...(part?.items ?? [])].sort((a, b) => b.tokens - a.tokens);

export function cacheView(cache: PromptCache | null | undefined, liveCache: PromptCache | null | undefined, counted: boolean, live: boolean) {
  const known = cache && counted ? cache : null;
  const shown = known ?? (live ? liveCache ?? null : null);
  return { known, shown, tone: known ? "" : shown ? "was" : "none" };
}

export function cellsOf(prompt: Prompt, window: number): Cell[] {
  const scale = Math.max(window, prompt.tokens, 1);
  const used = Math.min(CELLS, Math.round((prompt.tokens / scale) * CELLS));
  const parts = partsOf(prompt);
  const sum = parts.reduce((s, part) => s + part.tokens, 0) || 1;
  const want = parts.map((part) => (part.tokens / sum) * used);
  const got = want.map((w) => Math.max(1, Math.floor(w)));
  let left = used - got.reduce((s, n) => s + n, 0);
  const order = want.map((w, i) => [w - Math.floor(w), i] as const).sort((a, b) => b[0] - a[0]);
  for (let j = 0; left > 0 && order.length; j = (j + 1) % order.length, left--) got[order[j][1]]++;
  for (let j = got.length - 1; left < 0 && j >= 0; j--) while (left < 0 && got[j] > 1) { got[j]--; left++; }
  const cells: Cell[] = [];
  parts.forEach((part, pi) => {
    const items = sortedItems(part);
    const itemSum = items.reduce((s, item) => s + item.tokens, 0) || 1;
    let at = 0;
    let acc = 0;
    for (let c = 0; c < got[pi]; c++) {
      const mid = ((c + 0.5) / got[pi]) * itemSum;
      while (at < items.length - 1 && acc + items[at].tokens < mid) acc += items[at++].tokens;
      cells.push({ kind: part.kind, item: items.length ? at : -1 });
    }
  });
  while (cells.length < CELLS) cells.push(null);
  return cells.slice(0, CELLS);
}

const median = (values: number[]) => {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[sorted.length >> 1];
};

export function headroom(series: SessionPoint[], free: number) {
  const steps: number[] = [];
  for (let i = 1; i < series.length; i++) {
    const d = series[i].tokens - series[i - 1].tokens;
    if (d > 0 && series[i].tokens >= series[i - 1].tokens * 0.6) steps.push(d);
  }
  const step = median(steps);
  return step > 0 ? Math.floor(free / step) : null;
}

type Rect<T> = { a: T & { v: number }; x: number; y: number; w: number; h: number };

export function squarify<T>(vals: (T & { v: number })[], x: number, y: number, w: number, h: number): Rect<T>[] {
  const out: Rect<T>[] = [];
  const list = vals.filter((a) => a.v > 0);
  const total = list.reduce((s, a) => s + a.v, 0);
  if (!total || w <= 0 || h <= 0) return out;
  const k = (w * h) / total;
  const worst = (row: (T & { v: number })[], side: number) => {
    let sum = 0;
    let hi = 0;
    let lo = Infinity;
    for (const a of row) { const s = a.v * k; sum += s; hi = Math.max(hi, s); lo = Math.min(lo, s); }
    return Math.max((side * side * hi) / (sum * sum), (sum * sum) / (side * side * lo));
  };
  const lay = (row: (T & { v: number })[]) => {
    const sum = row.reduce((s, a) => s + a.v * k, 0);
    if (w >= h) {
      const cw = sum / h;
      let cy = y;
      for (const a of row) { const ch = (a.v * k) / cw; out.push({ a, x, y: cy, w: cw, h: ch }); cy += ch; }
      x += cw; w -= cw;
    } else {
      const rh = sum / w;
      let cx = x;
      for (const a of row) { const cw = (a.v * k) / rh; out.push({ a, x: cx, y, w: cw, h: rh }); cx += cw; }
      y += rh; h -= rh;
    }
  };
  let row: (T & { v: number })[] = [];
  for (const a of list) {
    const side = Math.min(w, h);
    if (!row.length || worst([...row, a], side) <= worst(row, side)) { row.push(a); continue; }
    lay(row);
    row = [a];
  }
  if (row.length) lay(row);
  return out;
}

type PartVal = { v: number; x: PromptPart };
type ItemVal = { v: number; it?: PromptItem; rest?: PromptItem[] };

export function tilesOf(prompt: Prompt, window: number, W: number, H: number): Tile[] {
  const scale = Math.max(window, prompt.tokens, 1);
  const across = W >= H;
  const long = across ? W : H;
  let usedLen = long;
  if (prompt.tokens < scale) usedLen = Math.min(long, Math.max(long * Math.pow(prompt.tokens / scale, 0.35), Math.min(long, 36)));
  const tiles: Tile[] = [];
  const parts = partsOf(prompt);
  const ur: [number, number, number, number] = across ? [0, 0, usedLen, H] : [0, 0, W, usedLen];
  const floored = <T extends { v: number }>(vals: T[], area: number) => {
    const sum = vals.reduce((s, a) => s + a.v, 0);
    const lo = (sum * TILE_FLOOR) / Math.max(1, area);
    return vals.map((a) => ({ ...a, v: Math.max(a.v, lo) }));
  };
  const partVals = floored<PartVal>(parts.map((x) => ({ v: x.tokens, x })), ur[2] * ur[3]);
  let partRects = squarify(partVals, ...ur);
  for (let n = 0; n < 8; n++) {
    const thin = partRects.filter((r) => Math.min(r.w, r.h) < TILE_SIDE);
    if (!thin.length) break;
    for (const r of thin) r.a.v *= (TILE_SIDE / Math.max(1, Math.min(r.w, r.h))) * 1.05;
    partRects = squarify(partVals, ...ur);
  }
  for (const r of partRects) {
    const part = r.a.x;
    const items = (part.items ?? []).filter((it) => it.tokens > 0).sort((a, b) => b.tokens - a.tokens);
    const itemSum = items.reduce((s, it) => s + it.tokens, 0);
    const area = r.w * r.h;
    const whole: Tile = { key: part.kind, kind: part.kind, its: items, tokens: part.tokens, x: r.x, y: r.y, w: r.w, h: r.h };
    if (!items.length || area < TILE_MIN * 2) { tiles.push(whole); continue; }
    const kept: PromptItem[] = [];
    const rest: PromptItem[] = [];
    for (const it of items) {
      if (kept.length < TILE_MAX && (it.tokens / itemSum) * area >= TILE_MIN) kept.push(it);
      else rest.push(it);
    }
    const vals: ItemVal[] = kept.map((it) => ({ v: it.tokens, it }));
    if (rest.length === 1 && !kept.length) vals.push({ v: rest[0].tokens, it: rest[0] });
    else if (rest.length) vals.push({ v: rest.reduce((s, it) => s + it.tokens, 0), rest });
    const laid = squarify(floored(vals, area), r.x, r.y, r.w, r.h);
    if (laid.some((q) => Math.min(q.w, q.h) < 14)) { tiles.push(whole); continue; }
    for (const q of laid) {
      const { it, rest: gathered } = q.a;
      const its = it ? [it] : gathered ?? [];
      tiles.push({
        key: `${part.kind}\x00${it ? `${it.tag ?? ""}\x00${it.name}` : "\x01rest"}`,
        kind: part.kind,
        it,
        its,
        tokens: ((it ? it.tokens : its.reduce((s, y) => s + y.tokens, 0)) / itemSum) * part.tokens,
        x: q.x, y: q.y, w: q.w, h: q.h,
      });
    }
  }
  if (prompt.tokens < scale) {
    const fr = across ? [usedLen, 0, W - usedLen, H] : [0, usedLen, W, H - usedLen];
    tiles.push({ key: "\x00free", kind: "", free: true, tokens: scale - prompt.tokens, x: fr[0], y: fr[1], w: fr[2], h: fr[3] });
  }
  return tiles;
}

export function tileLabel(tile: Tile, window: number, prompt: Prompt): { name: string; value: (n: number) => string } {
  const kind = tile.kind;
  if (tile.free) return { name: "Free space", value: (n) => `${formatK(n)} · ${pct(n / Math.max(window, prompt.tokens, 1))}` };
  const partName = kind ? PART_NAMES[kind] : "";
  if (tile.it) {
    let name = itemName(tile.it);
    if (kind === "files" || kind === "memory") name = name.slice(name.lastIndexOf("/", name.length - 2) + 1) || name;
    if ((tile.it.n ?? 0) > 1 && tile.it.tag !== "turns" && tile.it.tag !== "more") name += ` ×${tile.it.n}`;
    return { name, value: (n) => `${formatK(n)} · ${partName}` };
  }
  if (tile.key === kind) return { name: partName, value: formatK };
  const its = tile.its ?? [];
  const dirs = new Set(its.map((it) => it.name.slice(0, it.name.lastIndexOf("/") + 1)));
  const [dir] = dirs;
  if (kind === "files" && dirs.size === 1 && dir) {
    return { name: dir.slice(dir.lastIndexOf("/", dir.length - 2) + 1), value: (n) => `${formatK(n)} · ${its.length} files` };
  }
  return { name: `${its.length} more`, value: (n) => `${formatK(n)} · ${partName}` };
}

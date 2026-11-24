import type { CommandGroup, CommandItem, MenuLabels } from "./types";

export const ASK_KEY = "ask";

export type MenuOption = {
  key: string;
  item: CommandItem;
};

export type ViewGroup = {
  id: string;
  label?: string;
  ariaLabel: string;
  options: MenuOption[];
};

export function matches(item: CommandItem, q: string): boolean {
  const hay = [item.name, item.hint ?? "", ...(item.keywords ?? [])].join("\n").toLowerCase();
  return hay.includes(q.toLowerCase());
}

export function askItem(query: string, L: MenuLabels, logo: CommandItem["logo"]): CommandItem {
  return {
    id: ASK_KEY,
    name: `${L.askName} “${query}”`,
    done: `${L.askDone} “${query}”`,
    logo,
  };
}

export function viewGroups(groups: CommandGroup[], query: string, L: MenuLabels, askLogo: CommandItem["logo"]): ViewGroup[] {
  const q = query.trim();
  const out: ViewGroup[] = [];
  if (q) out.push({ id: ASK_KEY, ariaLabel: L.assistantLabel, options: [{ key: ASK_KEY, item: askItem(q, L, askLogo) }] });
  for (const g of groups) {
    const items = q ? g.items.filter((it) => matches(it, q)) : g.items;
    if (!items.length) continue;
    out.push({ id: g.id, label: g.label, ariaLabel: g.label ?? L.listLabel, options: items.map((item) => ({ key: item.id, item })) });
  }
  return out;
}

export const flatOptions = (view: ViewGroup[]): MenuOption[] => view.flatMap((g) => g.options);

export function moveKey(flat: MenuOption[], key: string | null, dir: 1 | -1): string | null {
  if (!flat.length) return null;
  const i = flat.findIndex((o) => o.key === key);
  if (i < 0) return flat[0].key;
  return flat[(i + dir + flat.length) % flat.length].key;
}

export function jumpKey(view: ViewGroup[], key: string | null, dir: 1 | -1): string | null {
  const flat = flatOptions(view);
  if (!flat.length) return null;
  const gi = view.findIndex((g) => g.options.some((o) => o.key === key));
  const cur = gi < 0 ? (dir === 1 ? -1 : 0) : gi;
  const next = view[(cur + dir + view.length) % view.length];
  return next?.options[0]?.key ?? flat[0].key;
}

export function edgeKey(flat: MenuOption[], dir: 1 | -1): string | null {
  if (!flat.length) return null;
  return (dir === 1 ? flat[flat.length - 1] : flat[0]).key;
}

export type Seg = { t: string; m: boolean };

export function segments(text: string, q: string): Seg[] {
  const i = q ? text.toLowerCase().indexOf(q.toLowerCase()) : -1;
  if (i < 0) return [{ t: text, m: false }];
  const out: Seg[] = [];
  if (i > 0) out.push({ t: text.slice(0, i), m: false });
  out.push({ t: text.slice(i, i + q.length), m: true });
  if (i + q.length < text.length) out.push({ t: text.slice(i + q.length), m: false });
  return out;
}

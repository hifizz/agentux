import { contract, items, type Item } from "./items";

export const filters = ["All", "High risk", "Unsure"] as const;
export const reasons = ["Incorrect", "Too risky", "Not allowed", "Other"] as const;
type Filter = (typeof filters)[number];
type Mode = { kind: "view" } | { kind: "reject" } | { kind: "edit"; draft: Record<string, string> };
type Decision = { item: Item; label: string; rejected: boolean; edits?: Record<string, string> };
export type Queue = {
  active: string;
  filter: Filter;
  mode: Mode;
  flag: number | null;
  arrived: boolean;
  skipped: string[];
  history: Decision[];
  leaving: Decision | null;
  showUndo: boolean;
  entrance: "first" | "next" | "previous" | "decide";
  announcement: string;
};
export type Action =
  | {
      type:
        | "reset"
        | "clearLeave"
        | "hideUndo"
        | "arrive"
        | "cancel"
        | "edit"
        | "reject"
        | "skip"
        | "undo"
        | "cycleFlag";
    }
  | { type: "note"; index: number | null }
  | { type: "filter"; filter: Filter }
  | { type: "select"; id: string }
  | { type: "move"; by: number }
  | { type: "draft"; field: string; value: string }
  | { type: "decide"; reason?: string };
export const fresh: Queue = {
  active: "patch",
  filter: "All",
  mode: { kind: "view" },
  flag: null,
  arrived: false,
  skipped: [],
  history: [],
  leaving: null,
  showUndo: false,
  entrance: "first",
  announcement: "",
};
export function waiting(state: Queue) {
  return items.filter(
    (item) =>
      (item.id !== "invoice" || state.arrived) && !state.history.some((h) => h.item.id === item.id),
  );
}
export function matches(item: Item, filter: Filter) {
  return filter === "All" || (filter === "High risk" ? item.risk === "high" : item.confidence < 70);
}
export function reduce(state: Queue, action: Action): Queue {
  const pending = waiting(state),
    list = pending.filter((i) => matches(i, state.filter)),
    index = list.findIndex((i) => i.id === state.active),
    item = list[index];
  const view = { mode: { kind: "view" } as const, flag: null };
  switch (action.type) {
    case "reset":
      return fresh;
    case "arrive":
      return { ...state, arrived: true };
    case "clearLeave":
      return { ...state, leaving: null };
    case "hideUndo":
      return { ...state, showUndo: false };
    case "filter": {
      const next = pending.filter((i) => matches(i, action.filter));
      return {
        ...state,
        ...view,
        filter: action.filter,
        active: (next.find((i) => i.id === state.active) ?? next[0])?.id ?? "",
        entrance: "next",
        leaving: null,
      };
    }
    case "select":
      return {
        ...state,
        ...view,
        active: action.id,
        entrance: list.findIndex((i) => i.id === action.id) < index ? "previous" : "next",
      };
    case "move":
    case "skip": {
      if (list.length < 2) return state;
      const by = action.type === "move" ? action.by : 1;
      const next = list[(index + by + list.length) % list.length];
      return {
        ...state,
        ...view,
        active: next.id,
        entrance: by < 0 ? "previous" : "next",
        ...(action.type === "skip" && item
          ? {
              skipped: [...new Set([...state.skipped, item.id])],
              announcement: `Skipped: ${item.title}.`,
            }
          : {}),
      };
    }
    case "edit":
      return item?.proposal.kind === "text"
        ? {
            ...state,
            flag: null,
            mode: {
              kind: "edit",
              draft: {
                ...item.proposal.fields,
                ...(item.proposal.body ? { Proposal: item.proposal.body } : {}),
              },
            },
          }
        : state;
    case "draft":
      return state.mode.kind === "edit"
        ? {
            ...state,
            mode: { kind: "edit", draft: { ...state.mode.draft, [action.field]: action.value } },
          }
        : state;
    case "reject":
      return item ? { ...state, flag: null, mode: { kind: "reject" } } : state;
    case "cancel":
      return { ...state, ...view };
    case "note":
      return { ...state, flag: action.index };
    case "cycleFlag":
      return item?.flags.length
        ? { ...state, flag: ((state.flag ?? -1) + 1) % item.flags.length }
        : state;
    case "decide": {
      if (!item) return state;
      const rejected = !!action.reason;
      const label = rejected
        ? `Rejected · ${action.reason}`
        : state.mode.kind === "edit"
          ? "Approved with edits"
          : "Approved";
      const decision = {
        item,
        label,
        rejected,
        edits: state.mode.kind === "edit" ? state.mode.draft : undefined,
      };
      const next = list[index + 1] ?? list.find((i) => i.id !== item.id);
      return {
        ...state,
        ...view,
        active: next?.id ?? "",
        leaving: decision,
        history: [...state.history, decision],
        showUndo: true,
        entrance: "decide",
        announcement: `${label}: ${item.title}. ${25 + state.history.length} of ${state.arrived ? 33 : 32} reviewed.`,
      };
    }
    case "undo": {
      const last = state.history.at(-1);
      return last
        ? {
            ...state,
            ...view,
            history: state.history.slice(0, -1),
            active: last.item.id,
            filter: matches(last.item, state.filter) ? state.filter : "All",
            leaving: null,
            showUndo: false,
            entrance: "previous",
            announcement: `Undid decision: ${last.item.title}. ${23 + state.history.length} reviewed.`,
          }
        : state;
    }
  }
}

export const sequence: readonly (readonly [number, Action])[] = [
  [900, { type: "note", index: 0 }],
  [3200, { type: "note", index: 1 }],
  [4300, { type: "note", index: null }],
  [4550, { type: "reject" }],
  [5350, { type: "decide", reason: "Too risky" }],
  [6250, { type: "note", index: 0 }],
  [7600, { type: "edit" }],
  [7900, { type: "arrive" }],
  ...[
    [8350, ""],
    [8500, "2"],
    [8750, "24"],
  ].map(
    ([at, months]) =>
      [
        Number(at),
        {
          type: "draft",
          field: "Proposal",
          value: contract.replace("12 months", `${months} months`),
        },
      ] as const,
  ),
  [9550, { type: "decide" }],
  [10600, { type: "note", index: 0 }],
  [11800, { type: "reject" }],
  [12600, { type: "decide", reason: "Not allowed" }],
  [13700, { type: "note", index: 0 }],
  [15100, { type: "skip" }],
  [16300, { type: "note", index: 0 }],
  [17650, { type: "decide" }],
  [18800, { type: "decide" }],
  [19750, { type: "decide" }],
  [20550, { type: "decide" }],
  [21250, { type: "decide" }],
  [22150, { type: "decide" }],
];

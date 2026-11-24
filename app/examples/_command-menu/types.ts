import type { ReactNode } from "react";

export type CommandItem = {
  id: string;
  name: string;
  hint?: string;
  keys?: string[];
  keywords?: string[];
  logo?: ReactNode;
  icon?: ReactNode;
  done?: string;
};

export type CommandGroup = {
  id: string;
  label?: string;
  items: CommandItem[];
};

export type MenuLabels = {
  searchLabel: string;
  placeholder: string;
  listLabel: string;
  assistantLabel: string;
  askName: string;
  askDone: string;
  tipKey: string;
  tip: string;
  openKeys: string[];
  openHint: string;
};

export const MENU_LABELS: MenuLabels = {
  searchLabel: "Command",
  placeholder: "Type a command or search…",
  listLabel: "Commands",
  assistantLabel: "Assistant",
  askName: "Ask the agent about",
  askDone: "Asked the agent about",
  tipKey: "Tab",
  tip: "to jump between sections",
  openKeys: ["⌘", "K"],
  openHint: "to open",
};

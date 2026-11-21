"use client";

import { createContext } from "react";
import type { PiAgent } from "@/app/examples/_shared/pi/wire";
import type { PiRenderers } from "./contracts";

export const RenderersContext = createContext<PiRenderers>({});

export type ToolOpenState = { readonly isOpen: (callId: string) => boolean; readonly toggle: (callId: string) => void };
export const ToolOpenContext = createContext<ToolOpenState>({ isOpen: () => false, toggle: () => {} });

export type PiPanelHost = {
  readonly agents: ReadonlyMap<number, PiAgent>;
  readonly openAgent: ((id: number) => void) | undefined;
  readonly waiting: ReadonlySet<string>;
};
export const PanelHostContext = createContext<PiPanelHost>({ agents: new Map(), openAgent: undefined, waiting: new Set() });

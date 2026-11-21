"use client";

import { createContext, useContext, useRef } from "react";

export type Tally = { seconds: number; tokens: number };
export const EMPTY_TALLY: Tally = { seconds: 0, tokens: 0 };

const TallyContext = createContext<React.RefObject<Tally> | null>(null);

export function TallyProvider({ value, children }: { value: React.RefObject<Tally>; children: React.ReactNode }) {
  return <TallyContext.Provider value={value}>{children}</TallyContext.Provider>;
}

export function useTally() {
  const ctx = useContext(TallyContext);
  if (!ctx) throw new Error("useTally needs a TallyProvider above it");
  return ctx;
}

export const useTallyRef = () => useRef<Tally>({ ...EMPTY_TALLY });

export const formatTokens = (n: number) => (n < 1000 ? `${n}` : `${(n / 1000).toFixed(1)}k`);

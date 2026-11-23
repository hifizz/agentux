"use client";

import { useEffect, useState } from "react";
import type { TraceNode } from "./model";

export type NodeIo = { input?: string; output?: string };

export type LoadIo = (node: TraceNode) => Promise<NodeIo>;

type Entry = { state: "done"; io: NodeIo } | { state: "error" };

export function useNodeIo(node: TraceNode | undefined, loadIo: LoadIo | undefined) {
  const [entries, setEntries] = useState<Record<string, Entry>>({});
  const embedded = node !== undefined && (node.input !== undefined || node.output !== undefined);
  const entry = node ? entries[node.id] : undefined;
  const pending = Boolean(node && loadIo && !embedded && !entry);

  useEffect(() => {
    if (!pending || !node || !loadIo) return;
    let live = true;
    loadIo(node).then(
      (io) => live && setEntries((current) => ({ ...current, [node.id]: { state: "done", io } })),
      () => live && setEntries((current) => ({ ...current, [node.id]: { state: "error" } })),
    );
    return () => {
      live = false;
    };
  }, [pending, node, loadIo]);

  const retry = () => {
    if (node) setEntries((current) => Object.fromEntries(Object.entries(current).filter(([id]) => id !== node.id)));
  };

  if (embedded) return { status: "done" as const, io: { input: node.input, output: node.output } satisfies NodeIo, retry };
  if (!node || !loadIo) return { status: "none" as const, io: {} as NodeIo, retry };
  if (!entry) return { status: "loading" as const, io: {} as NodeIo, retry };
  return entry.state === "done" ? { status: "done" as const, io: entry.io, retry } : { status: "error" as const, io: {} as NodeIo, retry };
}

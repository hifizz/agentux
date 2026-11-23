"use client";

import { useRef, useState, type KeyboardEvent } from "react";

export type TreeNode = { id: string; parentId: string | null; expandable: boolean };

type Options = { nodes: TreeNode[]; defaultFolded?: ReadonlySet<string> };

const NO_FOLDS: ReadonlySet<string> = new Set();

export function useTreeNav({ nodes, defaultFolded = NO_FOLDS }: Options) {
  const [folds, setFolds] = useState<Record<string, boolean>>({});
  const [focusId, setFocusId] = useState<string | null>(null);
  const elements = useRef(new Map<string, HTMLElement>());

  const parentOf = new Map(nodes.map((node) => [node.id, node.parentId]));
  const isFolded = (id: string) => folds[id] ?? defaultFolded.has(id);
  const isHidden = (id: string) => {
    for (let parent = parentOf.get(id); parent; parent = parentOf.get(parent)) if (isFolded(parent)) return true;
    return false;
  };

  const visible = nodes.filter((node) => !isHidden(node.id));
  const rovingId = visible.find((node) => node.id === focusId)?.id ?? visible[0]?.id;

  const toggle = (id: string) => setFolds((current) => ({ ...current, [id]: !(current[id] ?? defaultFolded.has(id)) }));

  const focusNode = (id: string | undefined) => {
    if (!id) return;
    setFocusId(id);
    elements.current.get(id)?.focus();
  };

  const register = (id: string, element: HTMLElement | null) => {
    if (element) elements.current.set(id, element);
    else elements.current.delete(id);
  };

  const handleKey = (event: KeyboardEvent<HTMLElement>, id: string) => {
    const index = visible.findIndex((node) => node.id === id);
    const expandable = nodes.find((node) => node.id === id)?.expandable ?? false;
    const key = event.key;
    if (key === "ArrowDown") focusNode(visible[index + 1]?.id);
    else if (key === "ArrowUp") focusNode(visible[index - 1]?.id);
    else if (key === "Home") focusNode(visible[0]?.id);
    else if (key === "End") focusNode(visible.at(-1)?.id);
    else if (key === "ArrowRight" && expandable) {
      if (isFolded(id)) toggle(id);
      else focusNode(visible[index + 1]?.id);
    } else if (key === "ArrowLeft") {
      if (expandable && !isFolded(id)) toggle(id);
      else focusNode(visible.find((node) => node.id === parentOf.get(id))?.id);
    } else return false;
    event.preventDefault();
    return true;
  };

  return { isFolded, isHidden, toggle, rovingId, register, elements, handleKey };
}

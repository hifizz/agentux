"use client";

import { useMemo, useState } from "react";
import { Folder, FolderPlus, Sparkles } from "lucide-react";
import { CHIP, Combobox, ComboboxCollection, ComboboxContent, ComboboxEmpty, ComboboxGroup, ComboboxItem, ComboboxLabel, ComboboxList, ComboboxSearch, ComboboxTrigger } from "@/components/ui/base";
import type { DirectoryControl } from "../types";

type DirItem = { id: string; path: string | null; label: string; hint: string; open?: boolean };
type DirGroup = { value: string; items: DirItem[] };

const baseName = (path: string) => path.split("/").filter(Boolean).pop() ?? path;
const parent = (path: string) => path.split("/").slice(0, -1).join("/") || "/";
const looksLikePath = (q: string) => /^(~|\/|\.)/.test(q);
const item = (path: string): DirItem => ({ id: path, path, label: baseName(path), hint: parent(path) });

export type DirectoryPickerProps = DirectoryControl & { disabled?: boolean };

export function DirectoryPicker({ value, onChange, recent = [], directories, allowScratch = true, disabled }: DirectoryPickerProps) {
  const [query, setQuery] = useState("");
  const groups = useMemo<DirGroup[]>(() => {
    const q = query.trim();
    const known = new Set([...recent, ...directories]);
    const out: DirGroup[] = [];
    if (q && looksLikePath(q) && !known.has(q)) out.push({ value: "Open", items: [{ ...item(q), id: `open:${q}`, label: `Open ${q}`, hint: "Folder on this machine", open: true }] });
    if (allowScratch) out.push({ value: "Workspace", items: [{ id: "scratch", path: null, label: "Scratch", hint: "Empty sandbox, no folder" }] });
    if (recent.length) out.push({ value: "Recent", items: recent.map(item) });
    const rest = directories.filter((d) => !recent.includes(d));
    if (rest.length) out.push({ value: "Folders", items: rest.map(item) });
    return out;
  }, [query, recent, directories, allowScratch]);
  const selected = groups.flatMap((g) => g.items).find((i) => i.path === value && !i.open) ?? (value ? item(value) : groups[0]?.items[0]);

  return (
    <Combobox
      autoHighlight
      items={groups}
      value={selected}
      onValueChange={(next: DirItem | null) => next && onChange(next.path)}
      inputValue={query}
      onInputValueChange={setQuery}
      itemToStringLabel={(i: DirItem) => (i.path ?? i.label)}
      isItemEqualToValue={(a: DirItem, b: DirItem) => a.path === b.path}
      filter={(i: DirItem, q: string) => i.open === true || `${i.path ?? ""} ${i.label}`.toLowerCase().includes(q.trim().toLowerCase())}
      onOpenChange={(open) => !open && setQuery("")}
    >
      <ComboboxTrigger disabled={disabled} aria-label={`Directory: ${value ?? "Scratch"}`} className={`${CHIP} max-w-32 shrink-0`}>
        {value ? <Folder className="size-3.5 shrink-0" /> : <Sparkles className="size-3.5 shrink-0" />}
        <span className="truncate" title={value ?? undefined}>
          {value ? baseName(value) : "Scratch"}
        </span>
      </ComboboxTrigger>
      <ComboboxContent className="w-[300px]">
        <ComboboxSearch placeholder="Search or type a path" aria-label="Search folders" />
        <ComboboxEmpty>No folders match. Type a path starting with / or ~</ComboboxEmpty>
        <ComboboxList>
          {(group: DirGroup) => (
            <ComboboxGroup key={group.value} items={group.items}>
              <ComboboxLabel>{group.value}</ComboboxLabel>
              <ComboboxCollection>
                {(i: DirItem) => (
                  <ComboboxItem key={i.id} value={i}>
                    {i.open ? <FolderPlus className="size-3.5 shrink-0" /> : i.path ? <Folder className="size-3.5 shrink-0" /> : <Sparkles className="size-3.5 shrink-0" />}
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate">{i.label}</span>
                      <span className="ch-mono truncate text-ch-caption text-ch-ink-subtle">{i.hint}</span>
                    </span>
                  </ComboboxItem>
                )}
              </ComboboxCollection>
            </ComboboxGroup>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

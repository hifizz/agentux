"use client";

import { useMemo, useState } from "react";
import { GitBranch, Lock, Plus } from "lucide-react";
import { CHIP, Combobox, ComboboxContent, ComboboxEmpty, ComboboxItem, ComboboxList, ComboboxSearch, ComboboxTrigger } from "@/components/ui/base";
import { cx } from "@/app/examples/_shared/ui/cx";
import { shortName, type GithubRepo } from "@/app/examples/_shared/github";
import type { RepoControl } from "../types";

function GithubMark({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden className={className} {...props}>
      <path d="M8 0a8 8 0 0 0-2.53 15.59c.4.07.55-.17.55-.38v-1.33c-2.23.48-2.7-1.07-2.7-1.07-.36-.92-.89-1.17-.89-1.17-.73-.5.06-.49.06-.49.8.06 1.23.83 1.23.83.72 1.22 1.88.87 2.34.66.07-.52.28-.87.5-1.07-1.78-.2-3.65-.89-3.65-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.66 3.95.29.25.54.73.54 1.48v2.2c0 .21.15.46.55.38A8 8 0 0 0 8 0Z" />
    </svg>
  );
}

export type RepoSelectProps = { repos: readonly GithubRepo[]; value: string; onChange: (repo: GithubRepo) => void; disabled?: boolean };

export function RepoSelect({ repos, value, onChange, disabled }: RepoSelectProps) {
  const current = repos.find((r) => r.fullName === value);
  return (
    <Combobox
      autoHighlight
      items={repos}
      value={current ?? null}
      onValueChange={(next: GithubRepo | null) => next && onChange(next)}
      itemToStringLabel={(r: GithubRepo) => r.fullName}
      isItemEqualToValue={(a: GithubRepo, b: GithubRepo) => a.fullName === b.fullName}
    >
      <ComboboxTrigger disabled={disabled} aria-label={`Repository: ${value}`} className={`${CHIP} max-w-28 shrink-0`}>
        <GithubMark data-tray-compact className="size-3.5 shrink-0" />
        <span className="truncate">{shortName(value)}</span>
      </ComboboxTrigger>
      <ComboboxContent className="w-[320px]">
        <ComboboxSearch placeholder="Search repositories" aria-label="Search repositories" />
        <ComboboxEmpty>No repositories match</ComboboxEmpty>
        <ComboboxList>
          {(r: GithubRepo) => (
            <ComboboxItem key={r.fullName} value={r} className="items-start">
              <GithubMark className="mt-0.5 size-3.5 shrink-0" />
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="flex items-center gap-1 truncate">
                  {r.fullName}
                  {r.private && <Lock aria-label="Private" className="size-3 shrink-0 text-ch-ink-subtle" />}
                </span>
                <span className="truncate text-ch-caption text-ch-ink-subtle">{r.description}</span>
              </span>
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

type BranchItem = { name: string; create?: boolean };

export type BranchSelectProps = { branches: readonly string[]; defaultBranch?: string; value: string; onChange: (branch: string) => void; onCreate?: (branch: string) => void; disabled?: boolean; icon?: boolean };

export function BranchSelect({ branches, defaultBranch, value, onChange, onCreate, disabled, icon = true }: BranchSelectProps) {
  const [query, setQuery] = useState("");
  const items = useMemo<BranchItem[]>(() => {
    const q = query.trim();
    const list: BranchItem[] = branches.map((name) => ({ name }));
    return onCreate && q && !branches.includes(q) ? [{ name: q, create: true }, ...list] : list;
  }, [branches, query, onCreate]);
  return (
    <Combobox
      autoHighlight
      items={items}
      value={{ name: value }}
      onValueChange={(next: BranchItem | null) => {
        if (!next) return;
        if (next.create) onCreate?.(next.name);
        onChange(next.name);
      }}
      inputValue={query}
      onInputValueChange={setQuery}
      itemToStringLabel={(b: BranchItem) => b.name}
      isItemEqualToValue={(a: BranchItem, b: BranchItem) => a.name === b.name && !a.create}
      filter={(b: BranchItem, q: string) => b.create === true || b.name.toLowerCase().includes(q.trim().toLowerCase())}
      onOpenChange={(open) => !open && setQuery("")}
    >
      <ComboboxTrigger disabled={disabled} aria-label={`Branch: ${value}`} className={CHIP}>
        {icon && <GitBranch className="size-3.5 shrink-0" />}
        <span className="ch-mono truncate text-ch-caption">{value}</span>
      </ComboboxTrigger>
      <ComboboxContent className="w-[280px]">
        <ComboboxSearch placeholder={onCreate ? "Find or create a branch" : "Find a branch"} aria-label="Search branches" />
        <ComboboxEmpty>No branches match</ComboboxEmpty>
        <ComboboxList>
          {(b: BranchItem) => (
            <ComboboxItem key={b.create ? `create:${b.name}` : b.name} value={b} indicator={!b.create}>
              {b.create && <Plus className="size-3.5 shrink-0" />}
              <span className={cx("min-w-0 flex-1 truncate", !b.create && "ch-mono text-ch-caption")}>{b.create ? `Create branch ${b.name}` : b.name}</span>
              {b.name === defaultBranch && !b.create && <span className="rounded-full border border-ch-line px-1.5 text-[10px] leading-4 text-ch-ink-subtle">default</span>}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

export type RepoBranchPickerProps = RepoControl & { disabled?: boolean };

export function RepoBranchPicker({ repos, value, onChange, branchesOf, onCreateBranch, disabled }: RepoBranchPickerProps) {
  const repo = repos.find((r) => r.fullName === value.repo);
  return (
    <span className="flex min-w-0 items-center">
      <RepoSelect repos={repos} value={value.repo} disabled={disabled} onChange={(r) => onChange({ repo: r.fullName, branch: r.defaultBranch })} />
      <span aria-hidden className="text-ch-ink-subtle">/</span>
      <BranchSelect
        branches={branchesOf(value.repo)}
        defaultBranch={repo?.defaultBranch}
        value={value.branch}
        disabled={disabled}
        icon={false}
        onChange={(branch) => onChange({ ...value, branch })}
        onCreate={onCreateBranch ? (branch) => onCreateBranch(value.repo, branch) : undefined}
      />
    </span>
  );
}

"use client";

import { useState } from "react";
import { branchesOf as seedBranches, GITHUB_REPOS } from "@/app/examples/_shared/github";
import type { ChangedFile, ContextControl, DirectoryControl, Host, HostControl, HostStatus, QueuedMessage, RepoControl, RepoRef } from "./composer";

export const DIRECTORIES = ["~/code/turnframe", "~/code/agent-builder", "~/code/acme/web", "~/code/acme/billing-service", "~/code/acme/design-system", "~/notes"];
export const RECENT = ["~/code/turnframe", "~/code/agent-builder"];

export const HOSTS: readonly Host[] = [
  { id: "local", name: "This Mac", kind: "local" },
  { id: "cloud", name: "Cloud sandbox", kind: "cloud" },
  { id: "devbox", name: "devbox-2", kind: "remote" },
];

export const CONTEXT: ContextControl = {
  window: 200_000,
  reserved: 32_000,
  segments: [
    { id: "system", label: "System prompt", tokens: 3_200 },
    { id: "tools", label: "Tool definitions", tokens: 11_800 },
    { id: "memory", label: "Memory and rules", tokens: 4_100 },
    { id: "files", label: "Attached files", tokens: 18_400 },
    { id: "messages", label: "Messages", tokens: 46_500 },
  ],
};

export const QUEUED: readonly QueuedMessage[] = [
  { id: "q1", text: "Also add a compact density to the tray", mode: "queue" },
  { id: "q2", text: "Then run the lint", mode: "queue" },
];

export const CHANGED: readonly ChangedFile[] = [
  { path: "app/examples/prompt-composer/demo.tsx", add: 42, del: 8 },
  { path: "lib/components.ts", add: 12, del: 2 },
];

export function useDirectory(initial: string | null = RECENT[0], allowScratch = true): DirectoryControl {
  const [value, setValue] = useState<string | null>(initial);
  const [opened, setOpened] = useState<string[]>([]);
  return {
    value,
    allowScratch,
    recent: RECENT,
    directories: [...DIRECTORIES, ...opened],
    onChange: (path) => {
      if (path && !DIRECTORIES.includes(path)) setOpened((o) => (o.includes(path) ? o : [...o, path]));
      setValue(path);
    },
  };
}

export function useRepo(initial: RepoRef = { repo: "acme/web", branch: "feat/prompt-composer" }): RepoControl & { created: readonly string[] } {
  const [value, setValue] = useState(initial);
  const [extra, setExtra] = useState<Record<string, string[]>>({});
  return {
    repos: GITHUB_REPOS,
    value,
    onChange: setValue,
    branchesOf: (repo) => [...seedBranches(repo), ...(extra[repo] ?? [])],
    onCreateBranch: (repo, branch) => setExtra((e) => ({ ...e, [repo]: [...(e[repo] ?? []), branch] })),
    created: extra[value.repo] ?? [],
  };
}

export function useHost(status: HostStatus = "ready"): HostControl {
  const [value, setValue] = useState("local");
  return { hosts: HOSTS, value, status, onChange: setValue };
}

"use client";

import { ChevronDownIcon, CheckIcon } from "../../shared/ui/icons";
import { FolderIcon, GitBranchIcon } from "../../shared/ui/code-icons";
import { cx } from "../../shared/ui/cx";
import type { Host, HostControl, HostStatus, TrayControl, WorkspaceInfo } from "../types";
import { CloudIcon, LaptopIcon } from "./icons";
import { CHIP_TRIGGER, MenuPop } from "./menu-pop";

export type WorkspaceChipProps = WorkspaceInfo;

export function WorkspaceChip({ path, branch, onPick }: WorkspaceChipProps) {
  const name = path.split("/").filter(Boolean).pop() ?? path;
  const body = (
    <>
      <FolderIcon className="size-3.5 shrink-0" />
      <span className="truncate" title={path}>
        {name}
      </span>
      {branch && (
        <>
          <GitBranchIcon className="ml-1 size-3.5 shrink-0" />
          <span className="ch-mono truncate text-ch-caption">{branch}</span>
        </>
      )}
    </>
  );
  return onPick ? (
    <button type="button" onClick={onPick} className={cx(CHIP_TRIGGER, "text-ch-ink-muted")}>
      {body}
    </button>
  ) : (
    <span className="flex h-6 min-w-0 items-center gap-1 px-1.5 text-ch-body text-ch-ink-muted">{body}</span>
  );
}

const STATUS_LABEL: Record<HostStatus, string> = { ready: "Ready", starting: "Starting", running: "Running", offline: "Offline" };
const STATUS_DOT: Record<HostStatus, string> = {
  ready: "bg-ch-success-ink",
  starting: "bg-ch-frontend-ink animate-pulse",
  running: "bg-ch-accent animate-pulse",
  offline: "bg-ch-ink-subtle",
};

const HostIcon = ({ kind, className }: { kind: Host["kind"]; className?: string }) => (kind === "local" ? <LaptopIcon className={className} /> : <CloudIcon className={className} />);

export type HostChipProps = HostControl;

export function HostChip({ hosts, value, status, onChange }: HostChipProps) {
  const current = hosts.find((h) => h.id === value) ?? hosts[0];
  if (!current) return null;
  if (hosts.length < 2) {
    return (
      <span className="flex h-6 min-w-0 items-center gap-1 px-1.5 text-ch-body text-ch-ink-muted">
        <HostIcon kind={current.kind} className="size-3.5 shrink-0" />
        <span className="truncate">{current.name}</span>
        <span aria-hidden className={cx("size-1.5 shrink-0 rounded-full", STATUS_DOT[status])} />
        <span className="hidden text-ch-caption @min-[400px]:inline">{STATUS_LABEL[status]}</span>
      </span>
    );
  }
  return (
    <MenuPop
      label="Run on"
      align="end"
      width="w-[220px]"
      trigger={({ open, toggle }) => (
        <button type="button" aria-label={`Run on ${current.name}, ${STATUS_LABEL[status]}`} aria-haspopup="dialog" aria-expanded={open} onClick={toggle} className={cx(CHIP_TRIGGER, "text-ch-ink-muted")}>
          <HostIcon kind={current.kind} className="size-3.5 shrink-0" />
          <span className="truncate">{current.name}</span>
          <span aria-hidden className={cx("size-1.5 shrink-0 rounded-full", STATUS_DOT[status])} />
          <span className="hidden text-ch-caption @min-[400px]:inline">{STATUS_LABEL[status]}</span>
          <ChevronDownIcon aria-hidden className="size-3.5 shrink-0" />
        </button>
      )}
    >
      {(close) => (
        <ul role="listbox" aria-label="Run on" className="flex flex-col p-1">
          {hosts.map((h) => (
            <li key={h.id} role="option" aria-selected={h.id === value}>
              <button
                type="button"
                autoFocus={h.id === value}
                onClick={() => {
                  onChange(h.id);
                  close();
                }}
                className={cx(
                  "ch-color-ease ch-focus-inset flex h-7 w-full cursor-pointer items-center gap-2 rounded-ch-control px-2 text-left text-ch-body outline-none hover:bg-ch-ghost-hover active:bg-ch-ghost-press",
                  h.id === value ? "text-ch-ink" : "text-ch-ink-muted",
                )}
              >
                <HostIcon kind={h.kind} className="size-3.5 shrink-0" />
                <span className="min-w-0 flex-1 truncate">{h.name}</span>
                <CheckIcon className={cx("size-3.5 shrink-0", h.id !== value && "invisible")} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </MenuPop>
  );
}

export type TrayProps = TrayControl;

export function Tray({ workspace, host }: TrayProps) {
  if (!workspace && !host) return null;
  return (
    <div className="-mt-4 flex items-center justify-between gap-2 rounded-b-ch-card bg-ch-sunken px-2 pt-6 pb-1.5">
      <div className="flex min-w-0 items-center">{workspace && <WorkspaceChip {...workspace} />}</div>
      <div className="flex min-w-0 items-center">{host && <HostChip {...host} />}</div>
    </div>
  );
}

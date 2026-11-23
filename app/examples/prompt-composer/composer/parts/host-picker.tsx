"use client";

import { CHIP, Menu, MenuContent, MenuGroup, MenuLabel, MenuRadioGroup, MenuRadioItem, MenuTrigger } from "@/components/ui/base";
import { cx } from "@/app/examples/_shared/ui/cx";
import type { Host, HostControl, HostStatus } from "../types";
import { CloudIcon, LaptopIcon } from "./icons";

const STATUS_LABEL: Record<HostStatus, string> = { ready: "Ready", starting: "Starting", running: "Running", offline: "Offline" };
const STATUS_DOT: Record<HostStatus, string> = {
  ready: "bg-ch-success-ink",
  starting: "bg-ch-frontend-ink motion-safe:animate-pulse",
  running: "bg-ch-ink motion-safe:animate-pulse",
  offline: "bg-ch-ink-subtle",
};

const HostIcon = ({ kind, className }: { kind: Host["kind"]; className?: string }) => (kind === "local" ? <LaptopIcon className={className} /> : <CloudIcon className={className} />);

export type HostPickerProps = HostControl & { disabled?: boolean };

export function HostPicker({ hosts, value, status, onChange, disabled }: HostPickerProps) {
  const current = hosts.find((h) => h.id === value) ?? hosts[0];
  if (!current) return null;
  const body = (
    <>
      <HostIcon kind={current.kind} className="size-3.5 shrink-0" />
      <span data-tray-compact className="truncate">{current.name}</span>
      <span aria-hidden className={cx("size-1.5 shrink-0 rounded-full", STATUS_DOT[status])} />
      <span className="hidden text-ch-caption @min-[400px]:inline">{STATUS_LABEL[status]}</span>
    </>
  );
  if (hosts.length < 2) return <span className="flex h-6 min-w-0 items-center gap-1 px-1.5 text-ch-body text-ch-ink-muted">{body}</span>;
  return (
    <Menu>
      <MenuTrigger disabled={disabled} aria-label={`Run on ${current.name}, ${STATUS_LABEL[status]}`} className={CHIP}>
        {body}
      </MenuTrigger>
      <MenuContent align="end" className="w-[220px]">
        <MenuGroup>
          <MenuLabel>Run on</MenuLabel>
          <MenuRadioGroup value={value} onValueChange={(id: string) => onChange(id)}>
            {hosts.map((h) => (
              <MenuRadioItem key={h.id} value={h.id} closeOnClick>
                <HostIcon kind={h.kind} className="mt-0.5 size-3.5 shrink-0" />
                <span className="truncate">{h.name}</span>
              </MenuRadioItem>
            ))}
          </MenuRadioGroup>
        </MenuGroup>
      </MenuContent>
    </Menu>
  );
}

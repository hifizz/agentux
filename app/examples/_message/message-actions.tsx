"use client";

import { Check, Copy, MoreHorizontal, RotateCcw, ThumbsDown, ThumbsUp } from "lucide-react";
import { Button } from "@/app/examples/_shared/ui/button";
import { Tooltip } from "@/app/examples/_shared/ui/tooltip";
import { useCopy } from "@/app/examples/_shared/ui/use-copy";
import { cx } from "@/app/examples/_shared/ui/cx";
import { Menu, MenuContent, MenuItem, MenuSeparator, MenuTrigger } from "@/components/ui/base";

export type MessageAction = {
  id: string;
  label: string;
  icon: React.ReactNode;
  pressed?: boolean;
  disabled?: boolean;
  onSelect?: () => void;
};

export type MessageMenuItem = { id: string; label: string; icon?: React.ReactNode; danger?: boolean; separated?: boolean; onSelect?: () => void };

export type MessageActionsProps = {
  actions: readonly MessageAction[];
  menu?: readonly MessageMenuItem[];
  meta?: React.ReactNode;
  reveal?: "always" | "hover";
  className?: string;
};

export function MessageActions({ actions, menu, meta, reveal = "always", className }: MessageActionsProps) {
  return (
    <div
      role="toolbar"
      aria-label="Message actions"
      className={cx(
        "-ml-1 flex min-h-7 items-center gap-0.5 transition-opacity duration-150",
        reveal === "hover" && "opacity-0 group-hover/message:opacity-100 focus-within:opacity-100 has-[[data-popup-open]]:opacity-100",
        className,
      )}
    >
      {actions.map((a) => (
        <Tooltip key={a.id} label={a.label}>
          <Button
            variant="icon"
            aria-label={a.label}
            aria-pressed={a.pressed}
            disabled={a.disabled}
            onClick={a.onSelect}
            className={cx("[&_svg]:size-3.5", a.pressed && "bg-ch-ghost-hover text-ch-ink")}
          >
            {a.icon}
          </Button>
        </Tooltip>
      ))}
      {menu && menu.length > 0 && (
        <Menu>
          <MenuTrigger render={<Button variant="icon" aria-label="More actions" className="[&_svg]:size-3.5" />}>
            <MoreHorizontal />
          </MenuTrigger>
          <MenuContent side="bottom" className="min-w-40">
            {menu.map((m) => [
              m.separated && <MenuSeparator key={`${m.id}-sep`} />,
              <MenuItem key={m.id} onClick={m.onSelect} className={cx(m.danger && "text-ch-diff-del-ink")}>
                {m.icon && <span className="grid size-3.5 place-items-center [&_svg]:size-3.5">{m.icon}</span>}
                {m.label}
              </MenuItem>,
            ])}
          </MenuContent>
        </Menu>
      )}
      {meta && <span className="ml-1.5 flex min-w-0 items-center gap-1.5 truncate text-ch-caption text-ch-ink-subtle tabular-nums">{meta}</span>}
    </div>
  );
}

export function useCopyAction(text: string): MessageAction {
  const [copied, copy] = useCopy(text);
  return { id: "copy", label: copied ? "Copied" : "Copy", icon: copied ? <Check /> : <Copy />, onSelect: copy };
}

export type Feedback = "up" | "down" | null;

export function feedbackActions(value: Feedback, onChange: (value: Feedback) => void): MessageAction[] {
  return [
    { id: "up", label: "Good response", icon: <ThumbsUp />, pressed: value === "up", onSelect: () => onChange(value === "up" ? null : "up") },
    { id: "down", label: "Bad response", icon: <ThumbsDown />, pressed: value === "down", onSelect: () => onChange(value === "down" ? null : "down") },
  ];
}

export function retryAction(onRetry: () => void, label = "Regenerate"): MessageAction {
  return { id: "retry", label, icon: <RotateCcw />, onSelect: onRetry };
}

export function MetaDot() {
  return <span aria-hidden className="size-0.5 shrink-0 rounded-full bg-ch-ink-subtle" />;
}

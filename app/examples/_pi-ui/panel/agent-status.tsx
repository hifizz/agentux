import { CircleAlert, CircleCheck, CircleSlash, LoaderCircle } from "lucide-react";
import type { PiAgent } from "@/app/examples/_shared/pi/wire";
import { cx } from "@/app/examples/_shared/ui/cx";

const STATUS: Record<PiAgent["status"], { label: string; tone: string; icon: React.ReactNode }> = {
  working: { label: "Working", tone: "text-ch-link", icon: <LoaderCircle className="size-3 animate-spin" /> },
  idle: { label: "Idle", tone: "text-ch-success-ink", icon: <CircleCheck className="size-3" /> },
  failed: { label: "Failed", tone: "text-ch-diff-del-ink", icon: <CircleAlert className="size-3" /> },
  stopped: { label: "Stopped", tone: "text-ch-ink-subtle", icon: <CircleSlash className="size-3" /> },
};

export function AgentStatusPill({ status }: { status: PiAgent["status"] }) {
  const s = STATUS[status];
  return (
    <span className={cx("inline-flex shrink-0 items-center gap-1 text-ch-caption", s.tone)}>
      {s.icon}
      {s.label}
    </span>
  );
}

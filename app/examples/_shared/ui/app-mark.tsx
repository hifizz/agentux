import type { ComponentType, SVGProps } from "react";
import { ClickUpMark, FigmaMark, GongMark, IntercomMark, MetabaseMark, NotionMark, SlackMark, ZendeskMark } from "./icons";
import { cx } from "./cx";
import { Tooltip } from "./tooltip";

export type MarkId = "zendesk" | "slack" | "notion" | "clickup" | "figma" | "gong" | "metabase" | "intercom";

type Glyph = ComponentType<SVGProps<SVGSVGElement>>;

const TILE: Record<MarkId, { Mark: Glyph; className?: string }> = {
  zendesk: { Mark: ZendeskMark },
  notion: { Mark: NotionMark, className: "text-ch-mono-brand" },
  gong: { Mark: GongMark, className: "text-ch-gong-ink h-2.5 w-2" },
  clickup: { Mark: ClickUpMark },
  figma: { Mark: FigmaMark, className: "h-2.5 w-auto" },
  metabase: { Mark: MetabaseMark, className: "text-ch-metabase-ink h-2.5 w-2" },
  slack: { Mark: SlackMark },
  intercom: { Mark: IntercomMark },
};

export function AppMark({ mark, className }: { mark: MarkId; className?: string }) {
  const { Mark, className: markClass } = TILE[mark];
  return (
    <span
      aria-hidden
      className={cx("grid size-4 shrink-0 place-items-center rounded-ch-badge border border-ch-line bg-ch-surface shadow-ch-chip", className)}
    >
      <Mark className={cx("size-2.5", markClass)} />
    </span>
  );
}

export function AppMarkTip({ mark, label, lapped = false }: { mark: MarkId; label: string; lapped?: boolean }) {
  return (
    <Tooltip label={label}>
      <span role="img" aria-label={label} className={cx("ch-tool-lift -my-1 flex py-1", lapped && "-ml-1")}>
        <AppMark mark={mark} />
      </span>
    </Tooltip>
  );
}

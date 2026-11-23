import { AnthropicMark, OpenAIMark } from "@/app/examples/_shared/ui/icons";
import { cx } from "@/app/examples/_shared/ui/cx";
import type { ModelVendor } from "@/app/examples/_shared/models";

export function VendorMark({ vendor, className }: { vendor: ModelVendor; className?: string }) {
  return (
    <span className={cx("grid size-6 shrink-0 place-items-center", className)}>
      {vendor === "anthropic" && <AnthropicMark className="size-3.5" />}
      {vendor === "openai" && <OpenAIMark className="size-3.5 text-ch-mono-brand" />}
      {vendor === "other" && <span aria-hidden className="size-2 rounded-full bg-ch-ink-subtle" />}
    </span>
  );
}

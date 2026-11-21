import type { ModelCard } from "../../shared/models";
import { costPosition, formatPrice, formatTokens } from "../tables";

export type CostBarProps = {
  model: ModelCard;
  catalog: readonly ModelCard[];
  size?: "row" | "detail";
};

export function CostBar({ model, catalog, size = "row" }: CostBarProps) {
  const pos = costPosition(model, catalog);
  if (pos === null) return null;
  return (
    <span aria-hidden className={size === "row" ? "relative block h-1 w-12 shrink-0 rounded-full bg-ch-line-soft" : "relative block h-1.5 w-full rounded-full bg-linear-to-r from-ch-success-ink via-ch-frontend-ink to-ch-backend-ink"}>
      {size === "row" ? (
        <span className="absolute inset-y-0 left-0 rounded-full bg-linear-to-r from-ch-success-ink via-ch-frontend-ink to-ch-backend-ink" style={{ width: `${Math.max(12, pos * 100)}%` }} />
      ) : (
        <span className="absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-ch-line bg-ch-surface shadow-ch-chip" style={{ left: `${pos * 100}%` }} />
      )}
    </span>
  );
}

export type ModelDetailProps = {
  model: ModelCard;
  catalog: readonly ModelCard[];
};

export function ModelDetail({ model, catalog }: ModelDetailProps) {
  const { cost } = model;
  return (
    <div className="flex h-[90px] flex-col gap-2 border-t border-ch-line-soft px-3 py-2.5">
      <p className="flex items-baseline justify-between gap-2 text-ch-caption text-ch-ink-muted">
        <span className="truncate text-ch-body text-ch-ink">{model.name}</span>
        <span className="shrink-0">
          {formatTokens(model.contextWindow)} context{model.inputs.includes("image") ? " · images" : ""}
        </span>
      </p>
      {cost ? (
        <>
          <CostBar model={model} catalog={catalog} size="detail" />
          <dl className="grid grid-cols-3 gap-2 text-ch-caption">
            {(
              [
                ["Input", cost.input],
                ["Cached", cost.cacheRead],
                ["Output", cost.output],
              ] as const
            ).map(([label, price]) => (
              <div key={label} className="flex flex-col">
                <dt className="text-ch-ink-subtle">{label}</dt>
                <dd className="text-ch-body text-ch-ink tabular-nums">
                  {formatPrice(price)} <span className="text-ch-ink-subtle">/ 1M</span>
                </dd>
              </div>
            ))}
          </dl>
        </>
      ) : (
        <p className="text-ch-caption text-ch-ink-subtle">No per-token price.</p>
      )}
    </div>
  );
}

import type { TraceFilter } from "./view-model";

export type TraceToolbarProps = {
  filter: TraceFilter;
  counts: Record<TraceFilter, number>;
  onFilter: (filter: TraceFilter) => void;
  hideInstant: boolean;
  instants: number;
  onHideInstant: (value: boolean) => void;
  foldLabel: string;
  foldDisabled: boolean;
  onFold: () => void;
};

const CHIPS: [TraceFilter, string][] = [
  ["all", "All"],
  ["generations", "Generations"],
  ["tools", "Tools"],
  ["errors", "Errors"],
];

export function TraceToolbar({ filter, counts, onFilter, hideInstant, instants, onHideInstant, foldLabel, foldDisabled, onFold }: TraceToolbarProps) {
  return (
    <div className="tv-toolbar">
      <div className="tv-chips" role="group" aria-label="Filter steps">
        {CHIPS.map(([key, text]) => (
          <button key={key} type="button" className="tv-chip" aria-pressed={filter === key} disabled={key !== "all" && counts[key] === 0} onClick={() => onFilter(key)}>
            {text}
            {key !== "all" && <em>{counts[key]}</em>}
          </button>
        ))}
      </div>
      <button type="button" role="switch" aria-checked={hideInstant} className="tv-switch" disabled={instants === 0} onClick={() => onHideInstant(!hideInstant)}>
        <i aria-hidden="true" />
        Hide instant steps
        <em>{instants}</em>
      </button>
      <button type="button" className="tv-link" disabled={foldDisabled} onClick={onFold}>{foldLabel}</button>
    </div>
  );
}

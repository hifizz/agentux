export function DiffStat({ add, del }: { add: number; del: number }) {
  return (
    <span className="flex shrink-0 gap-1.5 text-ch-caption tabular-nums">
      {add > 0 && <span className="text-ch-success-ink">+{add}</span>}
      {del > 0 && <span className="text-ch-diff-del-ink">−{del}</span>}
    </span>
  );
}

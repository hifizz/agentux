import type { LangfuseObservation } from "../observation";

const HOUR = 3_600_000;

export function spreadRows(rows: LangfuseObservation[]): LangfuseObservation[] {
  const order = [...new Map(rows.map((row) => [row.traceId, Date.parse(row.startTime)])).entries()].sort((a, b) => a[1] - b[1]).map(([id]) => id);
  const shift = (index: number) => (index < 3 ? 0 : index < 5 ? 2 * HOUR + 10 * 60_000 : 28 * HOUR);
  const delta = new Map(order.map((id, index) => [id, shift(index)]));
  const move = (iso: string, ms: number) => new Date(Date.parse(iso) + ms).toISOString();
  return rows.map((row) => {
    const ms = delta.get(row.traceId) ?? 0;
    return { ...row, startTime: move(row.startTime, ms), endTime: row.endTime ? move(row.endTime, ms) : null };
  });
}

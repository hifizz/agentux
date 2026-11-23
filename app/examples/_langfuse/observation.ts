export type LangfuseObservation = {
  id: string;
  traceId: string;
  parentObservationId: string | null;
  type: string;
  name: string;
  startTime: string;
  endTime: string | null;
  level?: string;
  statusMessage?: string | null;
  environment?: string;
  userId?: string | null;
  sessionId?: string | null;
  version?: string | null;
  latency?: number | null;
  timeToFirstToken?: number | null;
  model?: string | null;
  usageDetails?: Record<string, number> | null;
  costDetails?: Record<string, number> | null;
  totalCost?: number | null;
  traceName?: string | null;
  tags?: string[];
  release?: string | null;
  input?: string | null;
  output?: string | null;
  metadata?: unknown;
};

export type ReadResult = { rows: LangfuseObservation[]; skipped: number };

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null && !Array.isArray(value);
const text = (value: unknown) => (typeof value === "string" && value !== "" ? value : undefined);
const finite = (value: unknown) => (typeof value === "number" && Number.isFinite(value) ? value : undefined);

function numbers(value: unknown) {
  if (!isRecord(value)) return undefined;
  const entries = Object.entries(value).filter((entry): entry is [string, number] => finite(entry[1]) !== undefined);
  return entries.length ? Object.fromEntries(entries) : undefined;
}

function unwrap(input: unknown): unknown[] {
  if (Array.isArray(input)) return input;
  if (isRecord(input) && Array.isArray(input.data)) return input.data;
  if (isRecord(input) && isRecord(input.body) && Array.isArray(input.body.data)) return input.body.data;
  throw new Error("Expected an observations response: an array, { data } or { body: { data } }");
}

function readRow(raw: unknown): LangfuseObservation | null {
  if (!isRecord(raw)) return null;
  const id = text(raw.id);
  const traceId = text(raw.traceId);
  const type = text(raw.type);
  const startTime = text(raw.startTime);
  if (!id || !traceId || !type || !startTime || Number.isNaN(Date.parse(startTime))) return null;
  const endTime = text(raw.endTime);
  return {
    id,
    traceId,
    type,
    startTime,
    name: text(raw.name) ?? type.toLowerCase(),
    parentObservationId: text(raw.parentObservationId) ?? null,
    endTime: endTime && !Number.isNaN(Date.parse(endTime)) ? endTime : null,
    level: text(raw.level),
    statusMessage: text(raw.statusMessage),
    environment: text(raw.environment),
    userId: text(raw.userId),
    sessionId: text(raw.sessionId),
    version: text(raw.version),
    latency: finite(raw.latency),
    timeToFirstToken: finite(raw.timeToFirstToken),
    model: text(raw.model),
    usageDetails: numbers(raw.usageDetails),
    costDetails: numbers(raw.costDetails),
    totalCost: finite(raw.totalCost),
    traceName: text(raw.traceName),
    tags: Array.isArray(raw.tags) ? raw.tags.filter((tag): tag is string => typeof tag === "string") : undefined,
    release: text(raw.release),
    input: text(raw.input),
    output: text(raw.output),
    metadata: raw.metadata,
  };
}

export function readObservations(input: unknown): ReadResult {
  const seen = new Set<string>();
  const rows: LangfuseObservation[] = [];
  let skipped = 0;
  for (const raw of unwrap(input)) {
    const row = readRow(raw);
    if (!row) skipped += 1;
    else if (!seen.has(row.id)) {
      seen.add(row.id);
      rows.push(row);
    }
  }
  return { rows, skipped };
}

import { readObservations, type LangfuseObservation } from "../observation";

export type LangfuseConfig = {
  baseUrl: string;
  publicKey: string;
  secretKey: string;
  fetch?: typeof fetch;
  pageSize?: number;
  maxPages?: number;
  maxRetries?: number;
  timeoutMs?: number;
};

export class LangfuseError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "LangfuseError";
  }
}

export type ObservationQuery = {
  from: Date | string;
  to?: Date | string;
  sessionId?: string;
  traceId?: string;
  fields: string[];
  filter?: unknown[];
};

export type ObservationPage = { rows: LangfuseObservation[]; skipped: number; truncated: boolean };

const DAY = 86_400_000;
const SESSION_FIELDS = ["core", "basic", "metrics", "usage", "model", "trace_context"];

export function configFromEnv(env: Record<string, string | undefined>): LangfuseConfig {
  const baseUrl = env.LANGFUSE_BASE_URL ?? env.LANGFUSE_HOST;
  const { LANGFUSE_PUBLIC_KEY: publicKey, LANGFUSE_SECRET_KEY: secretKey } = env;
  const missing = [!baseUrl && "LANGFUSE_BASE_URL", !publicKey && "LANGFUSE_PUBLIC_KEY", !secretKey && "LANGFUSE_SECRET_KEY"].filter(Boolean);
  if (!baseUrl || !publicKey || !secretKey) throw new LangfuseError(`Missing ${missing.join(", ")}`);
  return { baseUrl, publicKey, secretKey };
}

const iso = (value: Date | string) => (typeof value === "string" ? new Date(value) : value).toISOString();

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function retryDelay(response: Response, attempt: number) {
  const header = Number(response.headers.get("retry-after"));
  const ms = Number.isFinite(header) && header > 0 ? header * 1000 : 500 * 2 ** attempt;
  return Math.min(ms, 10_000);
}

async function request(config: LangfuseConfig, url: URL): Promise<unknown> {
  const send = config.fetch ?? fetch;
  const { maxRetries = 3, timeoutMs = 30_000 } = config;
  const authorization = `Basic ${Buffer.from(`${config.publicKey}:${config.secretKey}`).toString("base64")}`;
  for (let attempt = 0; ; attempt++) {
    let response: Response;
    try {
      response = await send(url, { headers: { authorization, accept: "application/json" }, signal: AbortSignal.timeout(timeoutMs), cache: "no-store" });
    } catch (cause) {
      if (attempt < maxRetries) {
        await sleep(500 * 2 ** attempt);
        continue;
      }
      throw new LangfuseError(`Request to Langfuse failed: ${cause instanceof Error ? cause.name : "network error"}`);
    }
    if (response.ok) return response.json();
    if ((response.status === 429 || response.status >= 500) && attempt < maxRetries) {
      await sleep(retryDelay(response, attempt));
      continue;
    }
    const hint = response.status === 401 ? " (check the API keys and the region of LANGFUSE_BASE_URL)" : response.status === 400 ? " (the query was rejected)" : "";
    throw new LangfuseError(`Langfuse answered ${response.status}${hint}`, response.status);
  }
}

export async function fetchObservations(config: LangfuseConfig, query: ObservationQuery): Promise<ObservationPage> {
  const base = config.baseUrl.replace(/\/+$/, "");
  const { pageSize = 1000, maxPages = 20 } = config;
  const rows = new Map<string, LangfuseObservation>();
  let skipped = 0;
  let cursor: string | undefined;
  for (let page = 0; page < maxPages; page++) {
    const url = new URL(`${base}/api/public/v2/observations`);
    url.searchParams.set("fromStartTime", iso(query.from));
    url.searchParams.set("toStartTime", iso(query.to ?? new Date()));
    url.searchParams.set("fields", query.fields.join(","));
    url.searchParams.set("limit", String(pageSize));
    if (query.sessionId) url.searchParams.set("sessionId", query.sessionId);
    if (query.traceId) url.searchParams.set("traceId", query.traceId);
    if (query.filter?.length) url.searchParams.set("filter", JSON.stringify(query.filter));
    if (cursor) url.searchParams.set("cursor", cursor);
    let body: unknown;
    try {
      body = await request(config, url);
    } catch (error) {
      if (error instanceof LangfuseError) throw error;
      throw new LangfuseError("Langfuse sent a response that is not JSON");
    }
    let read;
    try {
      read = readObservations(body);
    } catch {
      throw new LangfuseError("Langfuse sent a response that is not an observations list");
    }
    skipped += read.skipped;
    for (const row of read.rows) rows.set(row.id, row);
    const next = (body as { meta?: { cursor?: unknown } }).meta?.cursor;
    if (typeof next !== "string" || next === "") return { rows: [...rows.values()], skipped, truncated: false };
    cursor = next;
  }
  return { rows: [...rows.values()], skipped, truncated: true };
}

export function fetchSession(config: LangfuseConfig, sessionId: string, window: { days?: number; to?: Date } = {}) {
  const to = window.to ?? new Date();
  return fetchObservations(config, { sessionId, from: new Date(to.getTime() - (window.days ?? 30) * DAY), to, fields: SESSION_FIELDS });
}

export type NodeIoQuery = { traceId: string; observationId: string; startedAt: Date | string };

export type NodeIoResult = { input?: string; output?: string; truncated: boolean };

const IO_LIMIT = 100_000;

export async function fetchNodeIo(config: LangfuseConfig, query: NodeIoQuery): Promise<NodeIoResult> {
  const at = new Date(iso(query.startedAt)).getTime();
  const { rows } = await fetchObservations(config, {
    traceId: query.traceId,
    from: new Date(at - 1000),
    to: new Date(at + 1000),
    fields: ["core", "io"],
  });
  const row = rows.find((candidate) => candidate.id === query.observationId);
  if (!row) throw new LangfuseError("Observation not found", 404);
  const cut = (text?: string | null) => (text && text.length > IO_LIMIT ? text.slice(0, IO_LIMIT) : (text ?? undefined));
  return {
    input: cut(row.input),
    output: cut(row.output),
    truncated: (row.input?.length ?? 0) > IO_LIMIT || (row.output?.length ?? 0) > IO_LIMIT,
  };
}

import { LangfuseError, fetchNodeIo, fetchSession, type LangfuseConfig } from "./client";

const ID = /^[\w.:-]{1,128}$/;

const json = (body: unknown, status = 200) => Response.json(body, { status, headers: { "cache-control": "private, no-store" } });

export type HandlerOptions = { config: () => LangfuseConfig; authorize?: (request: Request) => boolean | Promise<boolean>; maxDays?: number };

export function createLangfuseHandler({ config, authorize, maxDays = 90 }: HandlerOptions) {
  return async function GET(request: Request): Promise<Response> {
    if (authorize && !(await authorize(request))) return json({ error: "Unauthorized" }, 401);
    const params = new URL(request.url).searchParams;
    const session = params.get("session");
    const trace = params.get("trace");
    const observation = params.get("observation");
    try {
      if (session) {
        if (!ID.test(session)) return json({ error: "Invalid session id" }, 400);
        const days = Math.min(maxDays, Math.max(1, Number(params.get("days")) || 30));
        return json(await fetchSession(config(), session, { days }));
      }
      if (trace && observation) {
        const at = new Date(params.get("at") ?? "");
        if (!ID.test(trace) || !ID.test(observation) || Number.isNaN(at.getTime())) return json({ error: "Invalid query" }, 400);
        return json(await fetchNodeIo(config(), { traceId: trace, observationId: observation, startedAt: at }));
      }
      return json({ error: "Pass session, or trace with observation and at" }, 400);
    } catch (error) {
      if (error instanceof LangfuseError) return json({ error: error.message }, error.status === 404 ? 404 : 502);
      return json({ error: "Unexpected error" }, 500);
    }
  };
}

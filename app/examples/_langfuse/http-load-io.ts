import type { ObservationPage } from "./server/client";
import type { LoadIo } from "./use-node-io";

export const createHttpLoadIo =
  (endpoint: string): LoadIo =>
  async (node) => {
    const params = new URLSearchParams({ trace: node.traceId, observation: node.id, at: new Date(node.at).toISOString() });
    const response = await fetch(`${endpoint}?${params}`);
    if (!response.ok) throw new Error(`Loading input and output failed (${response.status})`);
    return response.json();
  };

export async function loadSessionRows(endpoint: string, sessionId: string, days?: number): Promise<ObservationPage> {
  const params = new URLSearchParams({ session: sessionId, ...(days ? { days: String(days) } : {}) });
  const response = await fetch(`${endpoint}?${params}`);
  if (!response.ok) throw new Error(`Loading the session failed (${response.status})`);
  return response.json();
}

export function formatDuration(ms: number) {
  if (ms < 1000) return `${Math.round(ms)}ms`;
  if (ms < 10_000) return `${(ms / 1000).toFixed(1)}s`;
  const seconds = Math.round(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  return `${Math.floor(seconds / 60)}m ${String(seconds % 60).padStart(2, "0")}s`;
}

export function formatTick(ms: number) {
  const seconds = Math.round(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const rest = seconds % 60;
  return rest ? `${Math.floor(seconds / 60)}m ${rest}s` : `${Math.floor(seconds / 60)}m`;
}

export const formatCost = (cost: number) => (cost >= 0.01 || cost === 0 ? `$${cost.toFixed(2)}` : `$${cost.toFixed(3)}`);

export const formatTokens = (tokens: number) => (tokens >= 1000 ? `${(tokens / 1000).toFixed(1)}k` : String(Math.round(tokens)));

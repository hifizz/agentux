export function formatDuration(ms: number) {
  if (ms < 995) return `${Math.round(ms)}ms`;
  if (ms < 59_500) return `${(ms / 1000).toFixed(1)}s`;
  const total = Math.round(ms / 1000);
  return `${Math.floor(total / 60)}m ${String(total % 60).padStart(2, "0")}s`;
}

export function formatTick(ms: number) {
  const seconds = ms / 1000;
  if (seconds < 60) return `${Number(seconds.toFixed(2))}s`;
  const rest = Math.round(seconds % 60);
  return rest ? `${Math.floor(seconds / 60)}m ${rest}s` : `${Math.floor(seconds / 60)}m`;
}

export function formatTokens(count: number) {
  if (count < 1000) return String(count);
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(2)}M`;
  return `${(count / 1000).toFixed(count >= 10_000 ? 1 : 2)}k`.replace(/\.0+k$/, "k");
}

export function formatCost(cost: number) {
  if (cost === 0) return "$0";
  if (cost >= 0.01) return `$${cost.toFixed(2)}`;
  if (cost < 1e-6) return "<$0.000001";
  return `$${Number(cost.toPrecision(2))}`;
}

export function formatSpan(ms: number) {
  if (ms < 600_000) return formatDuration(ms);
  const minutes = Math.round(ms / 60_000);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return minutes % 60 ? `${hours}h ${minutes % 60}m` : `${hours}h`;
  const days = Math.floor(hours / 24);
  return hours % 24 ? `${days}d ${hours % 24}h` : `${days}d`;
}

const START = new Intl.DateTimeFormat("en-US", { timeZone: "UTC", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });

export const formatStart = (epochMs: number) => `${START.format(epochMs)} UTC`;

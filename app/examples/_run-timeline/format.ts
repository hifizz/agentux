export function formatSeconds(seconds: number) {
  if (seconds < 0.1) return "<0.1s";
  if (seconds < 60) return `${seconds.toFixed(1)}s`;
  const rest = Math.round(seconds % 60);
  return `${Math.floor(seconds / 60)}m ${String(rest).padStart(2, "0")}s`;
}

export function formatTick(seconds: number) {
  if (seconds < 60) return `${seconds}s`;
  const rest = seconds % 60;
  return rest ? `${Math.floor(seconds / 60)}m ${rest}s` : `${Math.floor(seconds / 60)}m`;
}

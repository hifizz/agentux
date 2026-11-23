export const formatDuration = (seconds: number) => `${Math.floor(seconds / 60)}m ${String(Math.floor(seconds % 60)).padStart(2, "0")}s`;

export const formatTokens = (tokens: number) => (tokens >= 1000 ? `${(tokens / 1000).toFixed(1)}K` : String(Math.round(tokens)));

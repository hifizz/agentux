import type { ToolAction, ToolRenderer } from "../contracts";

export function parseMcpName(name: string): { readonly server: string; readonly tool: string } | undefined {
  const match = /^mcp__(.+?)__(.+)$/.exec(name);
  return match ? { server: match[1], tool: match[2] } : undefined;
}

function actionOf(server: string, tool: string): { readonly category: "web" | "mcp"; readonly action: ToolAction } {
  if (/search/i.test(tool)) return { category: "web", action: { active: `Searching ${server}`, done: `Searched ${server}` } };
  if (/fetch|extract|scrape|crawl|parse/i.test(tool)) return { category: "web", action: { active: `Fetching with ${server}`, done: `Fetched with ${server}` } };
  return { category: "mcp", action: { active: `Calling ${server}/${tool}`, done: `Called ${server}/${tool}` } };
}

export const mcpTool: ToolRenderer = (tool) => {
  const parsed = parseMcpName(tool.name);
  return parsed ? actionOf(parsed.server, parsed.tool) : undefined;
};

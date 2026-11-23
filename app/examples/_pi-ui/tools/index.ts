import type { ToolRenderer } from "../contracts";
import { agentTool } from "./agent-tool";
import { askTool } from "./ask-tool";
import { bashTool } from "./bash-tool";
import { codemodeTool } from "./codemode-tool";
import { editTool } from "./edit-tool";
import { mcpTool } from "./mcp-tool";
import { planTool } from "./plan-tool";
import { readTool } from "./read-tool";
import { writeTool } from "./write-tool";

export const CODING_RENDERERS: readonly ToolRenderer[] = [readTool, writeTool, editTool, bashTool, codemodeTool, mcpTool, agentTool, askTool, planTool];

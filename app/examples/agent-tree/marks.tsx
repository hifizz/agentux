import { useId } from "react";
import { AnthropicMark, FigmaMark, GitHubMark, NotionMark, OpenAIMark, SlackMark } from "../_shared/ui/icons";

function GeminiMark() {
  const id = useId();
  return <svg viewBox="0 0 24 24" aria-hidden="true">
    <defs><linearGradient id={id} x2="1" y2="1" gradientUnits="objectBoundingBox"><stop stopColor="#1c7dff" /><stop offset=".5" stopColor="#1c69ff" /><stop offset="1" stopColor="#b04dff" /></linearGradient></defs>
    <path fill={`url(#${id})`} d="M12 0C13.4 7.2 16.8 10.6 24 12c-7.2 1.4-10.6 4.8-12 12C10.6 16.8 7.2 13.4 0 12 7.2 10.6 10.6 7.2 12 0Z" />
  </svg>;
}

function HubSpotMark() {
  return <svg viewBox="0 0 24 24" aria-hidden="true" stroke="#ff7a59" fill="#ff7a59">
    <path d="m3 3 11 9m3-8v6m-4 6-5 5" strokeWidth="2" />
    <circle cx="3" cy="3" r="2.1" /><circle cx="17" cy="3" r="1.8" /><circle cx="8" cy="21" r="1.7" />
    <circle cx="17" cy="14" r="4.6" fill="none" strokeWidth="3" />
  </svg>;
}

function StripeMark() {
  return <svg viewBox="0 0 24 24" aria-hidden="true">
    <rect width="24" height="24" rx="5" fill="#635bff" />
    <path fill="white" d="M16.7 5.7v3.5c-1.3-.7-2.9-1.1-4.1-1.1-1.1 0-1.7.3-1.7 1 0 1.7 6.6 1 6.6 5.8 0 2.9-2.2 4.5-5.7 4.5-1.8 0-3.6-.4-5.1-1.1v-3.6c1.6 1 3.5 1.5 4.9 1.5 1.1 0 1.8-.3 1.8-1.1 0-1.9-6.5-1-6.5-5.9 0-2.8 2.3-4.4 5.5-4.4 1.6 0 3.1.3 4.3.9Z" />
  </svg>;
}

export const modelMarks = { "Opus 5.5": AnthropicMark, "Sonnet 5.5": AnthropicMark, "Gemini 3.8 Flash": GeminiMark, "GPT-6 Sol": OpenAIMark, "GPT-6 Mini": OpenAIMark };
export const toolMarks = { slack: SlackMark, notion: NotionMark, github: GitHubMark, figma: FigmaMark, stripe: StripeMark, hubspot: HubSpotMark };

export function TreeSpark() {
  return <svg width="16" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true"><path d="M7 1Q7.8 5.2 12 6 7.8 6.8 7 11 6.2 6.8 2 6 6.2 5.2 7 1Z" /><circle cx="11.6" cy="11.4" r="1.1" opacity=".55" /></svg>;
}

export function RunningRing() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><circle cx="12" cy="12" r="8.5" opacity=".2" /><path d="M18 6a8.5 8.5 0 0 1 0 12" strokeLinecap="round" /></svg>;
}

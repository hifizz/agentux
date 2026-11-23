import type { ReactNode } from "react";

const LOGOS: Record<string, ReactNode> = {
  notion: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M5 4.5 17.5 3.6c.9-.1 1.4.2 1.9.6l1.6 1.2c.3.2.4.4.4.7v13.6c0 .8-.4 1.3-1.2 1.4L7 21.9c-.8 0-1.3-.1-1.8-.7L3.7 19c-.3-.4-.5-.8-.5-1.4V5.9c0-.6.4-1.3 1.8-1.4ZM8.3 8.2v8.5h1.4v-5.9l4.8 5.9h1.4V7.2h-1.4v5.8L9.9 7.1 8.3 8.2Z" fillRule="evenodd" />
    </svg>
  ),
  figma: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 24a4 4 0 0 0 4-4v-4H8a4 4 0 0 0 0 8Z" fill="#0acf83" />
      <path d="M4 12a4 4 0 0 1 4-4h4v8H8a4 4 0 0 1-4-4Z" fill="#a259ff" />
      <path d="M4 4a4 4 0 0 1 4-4h4v8H8a4 4 0 0 1-4-4Z" fill="#f24e1e" />
      <path d="M12 0h4a4 4 0 0 1 0 8h-4V0Z" fill="#ff7262" />
      <path d="M20 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" fill="#1abcfe" />
    </svg>
  ),
  stripe: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" fill="#635bff" />
      <text x="12" y="16.5" textAnchor="middle" fontSize="13" fontWeight="700" fill="#fff" fontFamily="Inter, sans-serif">S</text>
    </svg>
  ),
};

export const hasLogo = (name: string) => name in LOGOS;

export function CompanyLogo({ name }: { name: string }) {
  return <span className="ls-co-logo">{LOGOS[name]}</span>;
}

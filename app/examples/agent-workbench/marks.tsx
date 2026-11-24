import { useId } from "react";
import type { FileKind } from "./run";

function MailMark() {
  return <svg viewBox="0 0 24 18" aria-hidden="true">
    <path fill="#4285f4" d="M0 4.5 5 8v10H2a2 2 0 0 1-2-2Z" /><path fill="#34a853" d="m19 8 5-3.5V16a2 2 0 0 1-2 2h-3Z" />
    <path fill="#ea4335" d="M5 1.9 12 7l7-5.1v6L12 13 5 7.9Z" /><path fill="#c5221f" d="M0 2.6C0 .1 2.3-.7 4.1.7L5 1.4v6.5L0 4.3Z" /><path fill="#fbbc04" d="m19 1.4.9-.7C21.7-.7 24 .1 24 2.6v1.7l-5 3.6Z" />
  </svg>;
}

function CalendarMark() {
  return <svg viewBox="0 0 24 24" aria-hidden="true">
    <rect width="24" height="24" rx="2.5" fill="white" /><path fill="#4285f4" d="M2 0h17v5H5v14H0V2Z" />
    <path fill="#1967d2" d="M0 2a2 2 0 0 1 2-2h3v5H0Z" /><path fill="#34a853" d="M0 19h19v5H2a2 2 0 0 1-2-2Z" />
    <path fill="#188038" d="M0 19h5v5H2a2 2 0 0 1-2-2Z" /><path fill="#fbbc04" d="M19 5h5v14h-5Z" />
    <path fill="#1a73e8" d="M19 0h3a2 2 0 0 1 2 2v3h-5Z" /><path fill="#ea4335" d="M19 19h5l-5 5Z" /><path fill="var(--wb-card)" d="m19 24 5-5v5Z" />
    <path d="M8 9.6c2.5-2 5.3.5 2.3 2.2 3.2 1.2.7 4.8-2.5 2.6m5.1-4.4 2.4-1.5v7" fill="none" stroke="#1a73e8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>;
}

function DriveMark() {
  return <svg viewBox="0 0 24 24" fill="#1fa463" aria-hidden="true"><path d="M8 2h8l8 14h-8Zm-1 .9 4 7.1-7.6 13L0 16Zm-.8 19.5 3.4-6h14.2l-3.5 6Z" /></svg>;
}

export const toolMarks = { mail: MailMark, calendar: CalendarMark, drive: DriveMark };

export function FolderMark() {
  const id = useId();
  return <svg viewBox="0 0 32 26" aria-hidden="true">
    <defs><linearGradient id={id} x2="0" y2="1"><stop stopColor="#74c9f9" /><stop offset="1" stopColor="#5bb6ee" /></linearGradient></defs>
    <path fill="#3294d8" d="M1 5a3 3 0 0 1 3-3h8l3 3h13a3 3 0 0 1 3 3v13H1Z" />
    <rect x="1" y="7" width="30" height="17.5" rx="2.7" fill={`url(#${id})`} />
    <path d="M3 7.5h26" stroke="#fff" opacity=".55" />
  </svg>;
}

export function FileMark({ kind }: { kind: FileKind }) {
  if (kind === "pdf") return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="1" y="1" width="22" height="22" rx="4" fill="#b30b00" /><path d="M6 17c3-1 7-11 5-12-2-1 0 9 7 9 3 0 0-4-7-1-6 2-7 6-5 4Z" fill="none" stroke="white" strokeWidth="1.4" /></svg>;
  const colors = kind === "sheet" ? ["#33c481", "#21a366", "#107c41", "#185c37"] : ["#41a5ee", "#2b7cd3", "#185abd", "#103f91"];
  return <svg viewBox="0 0 32 32" aria-hidden="true">
    <rect x="10" y="3" width="21" height="26" rx="2" fill={colors[3]} />
    {colors.slice(0, 3).map((c, i) => <rect key={c} x="10" y={3 + 6.5 * i} width="21" height="6.6" fill={c} />)}
    <rect x="1" y="8" width="17" height="17" rx="2" fill={colors[2]} />
    <path d={kind === "sheet" ? "m6 12 6.5 9m0-9L6 21" : "m4 12 2.5 9 2.7-7 2.5 7 2.5-9"} stroke="white" strokeWidth="1.8" fill="none" strokeLinejoin="round" />
  </svg>;
}

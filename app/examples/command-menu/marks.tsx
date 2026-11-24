import { useId } from "react";

export function SparkMark() {
  const id = useId();
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#8b5cf6" />
          <stop offset="1" stopColor="#38bdf8" />
        </linearGradient>
      </defs>
      <path fill={`url(#${id})`} d="M12 3l1.9 6.1L20 11l-6.1 1.9L12 19l-1.9-6.1L4 11l6.1-1.9z" />
    </svg>
  );
}

export function DocIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 3.5h6.5L18 8v12.5H7zM13.5 3.5V8H18M9.5 12.5h6M9.5 16h4" />
    </svg>
  );
}

export function InviteIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M10.5 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM4.5 20a6 6 0 0 1 12 0M18.5 8v5M16 10.5h5" />
    </svg>
  );
}

export function UploadIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 15.5V4.5M7.5 9 12 4.5 16.5 9M5 19.5h14" />
    </svg>
  );
}

export function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 14.5A8.5 8.5 0 1 1 9.5 3.5a7 7 0 0 0 10.5 11z" />
    </svg>
  );
}

export function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 11.5 12 4l8 7.5V20h-5v-5.5H9V20H4z" />
    </svg>
  );
}

export function InboxIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4.5 13.5 7 5.5h10l2.5 8v6h-15zM4.5 13.5H9a3 3 0 0 0 6 0h4.5" />
    </svg>
  );
}

export function BarsIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 19v-8M12 19V5M18 19v-6" />
    </svg>
  );
}

export function GearIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM12 2.8v2.4M12 18.8v2.4M4.7 6.7l2 1.2M17.3 16.1l2 1.2M4.7 17.3l2-1.2M17.3 7.9l2-1.2M2.8 12h2.4M18.8 12h2.4" />
    </svg>
  );
}

export function HelpIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM9.4 9.2a2.6 2.6 0 1 1 3.7 2.4c-.6.3-1.1.9-1.1 1.7v.5M12 17.2h.01" />
    </svg>
  );
}

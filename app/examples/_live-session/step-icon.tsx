import type { StepStatus } from "./types";

export function StepIcon({ status }: { status: StepStatus }) {
  return (
    <span className="ls-step__icon" data-status={status} aria-hidden="true">
      {status === "done" && (
        <svg width="16" height="16" viewBox="0 0 16 16">
          <circle cx="8" cy="8" r="7" fill="currentColor" />
          <path d="m5 8.2 2.2 2.2L11 6.4" fill="none" stroke="var(--ls-card)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      {status === "active" && (
        <svg width="16" height="16" viewBox="0 0 16 16" className="ls-spin">
          <circle cx="8" cy="8" r="5.8" fill="none" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1.5" />
          <path d="M8 2.2a5.8 5.8 0 0 1 5.8 5.8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )}
      {status === "pending" && (
        <svg width="16" height="16" viewBox="0 0 16 16">
          <circle cx="8" cy="8" r="5.8" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="1.6 2.4" strokeLinecap="round" />
        </svg>
      )}
    </span>
  );
}

import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

const base = { width: 14, height: 14, viewBox: "0 0 14 14", fill: "none", "aria-hidden": true } as const;
const line = { stroke: "currentColor", strokeWidth: 1, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export function GitBranchIcon(props: P) {
  return (
    <svg {...base} {...props}>
      <circle cx="4" cy="3.4" r="1.4" {...line} />
      <circle cx="4" cy="10.6" r="1.4" {...line} />
      <circle cx="10" cy="5.2" r="1.4" {...line} />
      <path d="M4 4.8v4.4M10 6.6c0 1.6-1.2 2.2-2.6 2.4-1.2.2-3.4.2-3.4-.6" {...line} />
    </svg>
  );
}

export function PullRequestIcon(props: P) {
  return (
    <svg {...base} {...props}>
      <circle cx="3.8" cy="3.4" r="1.4" {...line} />
      <circle cx="3.8" cy="10.6" r="1.4" {...line} />
      <circle cx="10.2" cy="10.6" r="1.4" {...line} />
      <path d="M3.8 4.8v4.4M10.2 9.2V6c0-1-.6-1.6-1.6-1.6H7.2M8.4 3.2L7.2 4.4l1.2 1.2" {...line} />
    </svg>
  );
}

export function GitCommitIcon(props: P) {
  return (
    <svg {...base} {...props}>
      <circle cx="7" cy="7" r="2.1" {...line} />
      <path d="M1.8 7h3.1M9.1 7h3.1" {...line} />
    </svg>
  );
}

export function TerminalIcon(props: P) {
  return (
    <svg {...base} {...props}>
      <rect x="1.8" y="2.6" width="10.4" height="8.8" rx="1.8" {...line} />
      <path d="M4.4 5.6l1.8 1.6-1.8 1.6M7.6 8.9h2" {...line} />
    </svg>
  );
}

export function GlobeIcon(props: P) {
  return (
    <svg {...base} {...props}>
      <circle cx="7" cy="7" r="5.2" {...line} />
      <path d="M1.8 7h10.4M7 1.8c1.5 1.5 2.2 3.2 2.2 5.2S8.5 10.7 7 12.2C5.5 10.7 4.8 9 4.8 7S5.5 3.3 7 1.8z" {...line} />
    </svg>
  );
}

export function FolderIcon(props: P) {
  return (
    <svg {...base} {...props}>
      <path d="M1.9 4.2c0-.8.6-1.4 1.4-1.4h2.1l1.2 1.4h4.1c.8 0 1.4.6 1.4 1.4v4.4c0 .8-.6 1.4-1.4 1.4H3.3c-.8 0-1.4-.6-1.4-1.4V4.2z" {...line} />
    </svg>
  );
}

export function PanelRightIcon(props: P) {
  return (
    <svg {...base} {...props}>
      <rect x="1.8" y="2.4" width="10.4" height="9.2" rx="1.8" {...line} />
      <path d="M8.6 2.6v8.8" {...line} />
    </svg>
  );
}

export function PanelLeftIcon(props: P) {
  return (
    <svg {...base} {...props}>
      <rect x="1.8" y="2.4" width="10.4" height="9.2" rx="1.8" {...line} />
      <path d="M5.4 2.6v8.8" {...line} />
    </svg>
  );
}

export function DiffIcon(props: P) {
  return (
    <svg {...base} {...props}>
      <rect x="2.2" y="1.9" width="9.6" height="10.2" rx="1.8" {...line} />
      <path d="M7 4.4v3M5.5 5.9h3M5.5 9.2h3" {...line} />
    </svg>
  );
}

export function PencilIcon(props: P) {
  return (
    <svg {...base} {...props}>
      <path d="M8.6 3l2.4 2.4M2.6 11.4l.5-2.3 6.2-6.2a1.2 1.2 0 0 1 1.7 0l.6.6a1.2 1.2 0 0 1 0 1.7L5.4 11l-2.8.4z" {...line} />
    </svg>
  );
}

export function ChevronRightIcon(props: P) {
  return (
    <svg {...base} {...props}>
      <path d="M5.4 3.4L9 7l-3.6 3.6" {...line} />
    </svg>
  );
}

export function ArrowRightIcon(props: P) {
  return (
    <svg {...base} {...props}>
      <path d="M2.6 7h8.4M7.6 3.6L11 7l-3.4 3.4" {...line} />
    </svg>
  );
}

export function ComputerIcon(props: P) {
  return (
    <svg {...base} {...props}>
      <path d="M12.2 7.4V4.2c0-.8-.6-1.4-1.4-1.4H3.2c-.8 0-1.4.6-1.4 1.4v5c0 .8.6 1.4 1.4 1.4h3.4" {...line} />
      <path d="M4.6 5.1h.01M6.2 5.1h.01M7.8 5.1h.01" {...line} />
      <path d="M8.4 8.2l3.6 1.4-1.6.7-.7 1.6-1.3-3.7z" {...line} />
    </svg>
  );
}

export function ProjectIcon(props: P) {
  return (
    <svg {...base} {...props}>
      <path d="M3.2 4.2h7.6M4.2 2.6h5.6" {...line} />
      <rect x="2" y="5.6" width="10" height="6" rx="1.6" {...line} />
    </svg>
  );
}

export function ThreadsIcon(props: P) {
  return (
    <svg {...base} {...props}>
      <path d="M2.4 4.2l1 1 1.7-1.9M7.2 4.1h4.4M7.2 9.9h4.4" {...line} />
      <circle cx="3.9" cy="9.9" r="1.3" {...line} />
    </svg>
  );
}

export function LibraryIcon(props: P) {
  return (
    <svg {...base} {...props}>
      <path d="M2.6 2.4v9.2M5.8 2.4v9.2M8.6 3l2.6.7-2 8.1-2.6-.7z" {...line} />
    </svg>
  );
}

export function PinIcon(props: P) {
  return (
    <svg {...base} {...props}>
      <path d="M8.9 2.2l2.9 2.9-1.4.5-1.5 2.1.3 1.9-.7.7-2-2-3.1 3.1M5 4.4l.7-.7 1.9.3 2.1-1.5" {...line} />
    </svg>
  );
}

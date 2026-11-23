import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

const base = { width: 14, height: 14, viewBox: "0 0 14 14", fill: "none", "aria-hidden": true } as const;
const line = { stroke: "currentColor", strokeWidth: 1, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export function ShieldIcon(props: P) {
  return (
    <svg {...base} {...props}>
      <path d="M7 1.6 2.6 3.2v3.3c0 2.6 1.8 4.4 4.4 5.4 2.6-1 4.4-2.8 4.4-5.4V3.2L7 1.6z" {...line} />
    </svg>
  );
}

export function LaptopIcon(props: P) {
  return (
    <svg {...base} {...props}>
      <rect x="2.6" y="3" width="8.8" height="6" rx="1" {...line} />
      <path d="M1.4 11h11.2" {...line} />
    </svg>
  );
}

export function CloudIcon(props: P) {
  return (
    <svg {...base} {...props}>
      <path d="M4.2 10.6a2.4 2.4 0 0 1-.3-4.8 3.3 3.3 0 0 1 6.3.9 2 2 0 0 1-.3 3.9H4.2z" {...line} />
    </svg>
  );
}

export function TargetIcon(props: P) {
  return (
    <svg {...base} {...props}>
      <circle cx="7" cy="7" r="5" {...line} />
      <circle cx="7" cy="7" r="2" {...line} />
    </svg>
  );
}

export function QueueIcon(props: P) {
  return (
    <svg {...base} {...props}>
      <path d="M2.5 4h9M2.5 7h9M2.5 10h5" {...line} />
    </svg>
  );
}

"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function IoBlock({ label, text }: { label: string; text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    void navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    });
  };
  return (
    <div className="tv-sec">
      <span className="tv-label">
        {label}
        <button type="button" className="tv-copy" onClick={copy} aria-label={`Copy ${label.toLowerCase()}`}>
          {copied ? <Check size={12} aria-hidden="true" /> : <Copy size={12} aria-hidden="true" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </span>
      <pre className="tv-io">{text}</pre>
    </div>
  );
}

export function IoSkeleton({ label }: { label: string }) {
  return (
    <div className="tv-sec" aria-busy="true">
      <span className="tv-label">{label}</span>
      <div className="tv-io tv-io--skeleton">
        <i />
        <i />
        <i data-short="" />
      </div>
    </div>
  );
}

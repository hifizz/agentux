"use client";

import { useEffect } from "react";
import { FileText, Folder, X } from "lucide-react";
import type { FileRef, Preview } from "./types";

function Body({ preview }: { preview: Preview }) {
  if (preview.type === "sheet") {
    return (
      <table className="ls-sheet">
        <thead><tr>{preview.head.map((h) => <th key={h}>{h}</th>)}</tr></thead>
        <tbody>{preview.rows.map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>)}</tbody>
      </table>
    );
  }
  if (preview.type === "tree") {
    return (
      <ul className="ls-tree">
        {preview.items.map((item) => (
          <li key={`${item.depth}-${item.name}`} style={{ paddingLeft: item.depth * 16 }}>
            {item.folder ? <Folder size={14} aria-hidden="true" /> : <FileText size={14} aria-hidden="true" />}
            {item.name}
          </li>
        ))}
      </ul>
    );
  }
  return (
    <div className="ls-doc">
      {preview.lines.map((line, i) => (
        <p key={i} className={line.startsWith("# ") ? "ls-doc__h" : undefined}>{line.replace(/^# /, "")}</p>
      ))}
    </div>
  );
}

export function FilePreview({ file, onClose }: { file: FileRef; onClose: () => void }) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!file.preview) return null;
  return (
    <div className="ls-preview" onClick={onClose}>
      <div className="ls-window" role="dialog" aria-label={file.label} onClick={(event) => event.stopPropagation()}>
        <div className="ls-window__head">
          <span className="ls-window__icon">{file.kind === "folder" ? <Folder size={14} aria-hidden="true" /> : <FileText size={14} aria-hidden="true" />}</span>
          <span className="ls-window__name">{file.preview.title}</span>
          <button type="button" className="ls-icon-btn" aria-label="Close preview" autoFocus onClick={onClose}>
            <X size={16} aria-hidden="true" />
          </button>
        </div>
        <div className="ls-window__body"><Body preview={file.preview} /></div>
      </div>
    </div>
  );
}

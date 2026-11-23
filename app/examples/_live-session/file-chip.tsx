import { CodeXml, FileText, Folder, Frame, GitPullRequest } from "lucide-react";
import type { FileKind, FileRef } from "./types";

const ICONS: Record<FileKind, typeof FileText> = { file: FileText, folder: Folder, frame: Frame, pr: GitPullRequest, tool: CodeXml };

export function FileChip({ file, onOpen }: { file: FileRef; onOpen: (file: FileRef) => void }) {
  const Icon = ICONS[file.kind];
  return (
    <button
      type="button"
      className="ls-file"
      onClick={(event) => {
        event.stopPropagation();
        onOpen(file);
      }}
    >
      <Icon size={13} aria-hidden="true" />
      <span className="ls-file__name" dir="auto">{file.label}</span>
    </button>
  );
}

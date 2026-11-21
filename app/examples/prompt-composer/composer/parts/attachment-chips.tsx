import { CloseIcon, PaperclipIcon } from "../../shared/ui/icons";
import type { Attachment } from "../types";

export type AttachmentChipsProps = {
  attachments: readonly Attachment[];
  onRemove: (id: string) => void;
};

export function AttachmentChips({ attachments, onRemove }: AttachmentChipsProps) {
  if (attachments.length === 0) return null;
  return (
    <ul aria-label="Attachments" className="flex flex-wrap gap-1.5">
      {attachments.map((a) => (
        <li key={a.id} className="inline-flex h-6 max-w-full items-center gap-1 rounded-ch-control border border-ch-line bg-ch-sunken pr-1 pl-1.5 text-ch-caption text-ch-ink-muted">
          <PaperclipIcon className="size-3 shrink-0" />
          <span className="truncate">{a.name}</span>
          <button type="button" aria-label={`Remove ${a.name}`} onClick={() => onRemove(a.id)} className="ch-focus grid size-4 cursor-pointer place-items-center rounded-ch-badge outline-none hover:bg-ch-ghost-hover">
            <CloseIcon className="size-2.5" />
          </button>
        </li>
      ))}
    </ul>
  );
}

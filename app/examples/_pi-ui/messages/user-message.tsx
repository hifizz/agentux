import type { UserMessage as User } from "@earendil-works/pi-ai";

export function UserMessage({ message }: { message: User }) {
  const blocks = typeof message.content === "string" ? [{ type: "text" as const, text: message.content }] : message.content;
  return (
    <div className="flex justify-end">
      <div className="flex max-w-[70%] flex-col gap-1.5 rounded-ch-card bg-ch-sunken px-3 py-2 text-ch-body leading-5 text-ch-ink">
        {blocks.map((block, i) =>
          block.type === "text" ? (
            <p key={i} className="line-clamp-10 break-words whitespace-pre-wrap">
              {block.text}
            </p>
          ) : (
            <img key={i} alt="Attachment" src={`data:${block.mimeType};base64,${block.data}`} className="max-h-48 w-fit rounded-ch-field" />
          ),
        )}
      </div>
    </div>
  );
}

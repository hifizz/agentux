import { highlightLine } from "@/app/examples/_shared/ui/highlight";

const CODE = /\.(?:[cm]?[jt]sx?|py|sh|bash|zsh)$/;

export function CodeLines({ text, start, code }: { text: string; start: number; code: boolean }) {
  const lines = text.replace(/\n$/, "").split("\n");
  return (
    <div className="ch-mono max-h-72 overflow-auto rounded-ch-badge border border-ch-line-soft bg-ch-surface py-1 text-ch-caption leading-5">
      <div className="min-w-max">
        {lines.map((line, i) => (
          <div key={i} className="flex">
            <span aria-hidden className="w-10 shrink-0 pr-2 text-right text-ch-ink-subtle select-none">
              {start + i}
            </span>
            <span className="pr-3 whitespace-pre">
              {code ? highlightLine(line).map((t, j) => <span key={j} className={tone(t.kind)}>{t.text}</span>) : line}
              {line === "" && "\u200B"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

const TONES = { comment: "text-ch-code-comment", keyword: "text-ch-code-keyword", type: "text-ch-code-type", fn: "text-ch-code-fn", string: "text-ch-code-string", literal: "text-ch-code-literal", text: "text-ch-ink" } as const;
const tone = (kind: keyof typeof TONES) => TONES[kind];

export const isCode = (path: string) => CODE.test(path);

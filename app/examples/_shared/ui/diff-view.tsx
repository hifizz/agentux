import { cx } from "./cx";
import type { DiffLine } from "./diff";
import { highlightLine, type TokenKind } from "./highlight";

const COLOR: Record<TokenKind, string> = {
  comment: "text-ch-code-comment",
  keyword: "text-ch-code-keyword",
  type: "text-ch-code-type",
  fn: "text-ch-code-fn",
  string: "text-ch-code-string",
  literal: "text-ch-code-literal",
  text: "text-ch-ink",
};

const ROW: Record<DiffLine["kind"], string> = {
  ctx: "",
  add: "bg-ch-success-surface",
  del: "bg-ch-diff-del-surface",
  hunk: "bg-ch-sunken text-ch-ink-subtle",
};
const SIGN: Record<DiffLine["kind"], string> = { ctx: " ", add: "+", del: "−", hunk: "" };
const SIGN_COLOR: Record<DiffLine["kind"], string> = { ctx: "", add: "text-ch-success-ink", del: "text-ch-diff-del-ink", hunk: "" };

export function DiffView({ lines, wrap }: { lines: DiffLine[]; wrap: boolean }) {
  return (
    <div className={cx("text-ch-caption leading-5", !wrap && "overflow-x-auto")}>
      <div className={cx("ch-mono py-1", !wrap && "min-w-max")}>
        {lines.map((line, i) => (
          <div key={i} className={cx("flex", ROW[line.kind])}>
            <span aria-hidden className="w-9 shrink-0 pr-2 text-right text-ch-ink-subtle select-none">
              {line.oldNo ?? ""}
            </span>
            <span aria-hidden className="w-9 shrink-0 pr-2 text-right text-ch-ink-subtle select-none">
              {line.newNo ?? ""}
            </span>
            <span aria-hidden className={cx("w-4 shrink-0 select-none", SIGN_COLOR[line.kind])}>
              {SIGN[line.kind]}
            </span>
            <span className={cx("min-w-0 flex-1 pr-3", wrap ? "break-all whitespace-pre-wrap" : "whitespace-pre")}>
              {line.kind === "hunk"
                ? line.text
                : highlightLine(line.text).map((t, j) => (
                    <span key={j} className={COLOR[t.kind]}>
                      {t.text}
                    </span>
                  ))}
              {line.text === "" && "\u200B"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

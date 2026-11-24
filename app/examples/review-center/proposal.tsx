import { useId, useLayoutEffect, useRef, type ReactNode } from "react";
import { Link, TriangleAlert } from "lucide-react";
import { toolMarks } from "../agent-tree/marks";
import { avatars, type Credit, type Item } from "./items";
import type { Action, Queue } from "./queue";

export function Avatar({ item }: { item: Item }) {
  const Mark = avatars[item.model];
  return (
    <span className="rc-avatar" aria-hidden="true">
      <Mark />
    </span>
  );
}

function Source({ credit: [name, brand], link = false }: { credit: Credit; link?: boolean }) {
  const Mark = brand && toolMarks[brand];
  return (
    <span className="rc-source">
      {Mark ? <Mark /> : link ? <Link /> : null}
      {name}
    </span>
  );
}

function colorCode(line: string) {
  const tokens =
    /(\/\/.*$|"[^"\n]*"|'[^'\n]*'|\b(?:const|await|if|return|for|let|ALTER|TABLE|ADD|COLUMN|UPDATE|SET|DROP)\b|\b\w+(?=\())/g;
  return line.split(tokens).map((s, i) =>
    i % 2 === 0 ? (
      s
    ) : (
      <span
        key={i}
        data-token={
          s.startsWith("//")
            ? "comment"
            : /^["']/.test(s)
              ? "string"
              : /^(const|await|if|return|for|let|[A-Z]+)$/.test(s)
                ? "keyword"
                : "function"
        }
      >
        {s}
      </span>
    ),
  );
}

type DetailProps = {
  item: Item;
  mode: Queue["mode"];
  flag: number | null;
  send: (action: Action) => void;
  entrance: string;
  ghost?: boolean;
};
export function Detail({ item, mode, flag, send, entrance, ghost = false }: DetailProps) {
  const root = useRef<HTMLDivElement>(null),
    bubble = useRef<HTMLDivElement>(null),
    noteId = useId();
  useLayoutEffect(() => {
    const el = root.current,
      tip = bubble.current,
      mark = el?.querySelector<HTMLElement>(`[data-note="${flag}"]`);
    if (!el || !tip || !mark) return;
    const place = () => {
      const a = mark.getBoundingClientRect(),
        b = el.getBoundingClientRect();
      const inset = Math.min(parseFloat(getComputedStyle(el).paddingLeft), (b.width - tip.offsetWidth) / 2);
      const x = Math.max(inset, Math.min(b.width - tip.offsetWidth - inset, a.x - b.x + (a.width - tip.offsetWidth) / 2));
      tip.style.left = `${x}px`;
      const below = a.bottom + 7;
      const fitsBelow = below + tip.offsetHeight <= (el.parentElement?.getBoundingClientRect().bottom ?? Infinity);
      const top = !fitsBelow && a.top - b.y > tip.offsetHeight + 7 ? a.top - tip.offsetHeight - 7 : below;
      tip.style.top = `${top - b.y}px`;
    };
    place();
    const observer = new ResizeObserver(place);
    observer.observe(el);
    el.addEventListener("scroll", place, true);
    return () => {
      observer.disconnect();
      el.removeEventListener("scroll", place, true);
    };
  }, [flag]);
  function marked(value: string, code = false): ReactNode {
    const color = code ? colorCode : (s: string) => s;
    const bits: ReactNode[] = [];
    let rest = value;
    while (rest) {
      const hit = item.flags
        .map((f, index) => ({ f, index, start: rest.indexOf(f.text) }))
        .filter((h) => h.start >= 0)
        .sort((a, b) => a.start - b.start)[0];
      if (!hit) {
        bits.push(color(rest));
        break;
      }
      const { f, index, start } = hit;
      bits.push(
        color(rest.slice(0, start)),
        <mark
          key={bits.length}
          className="rc-flag"
          data-note={index}
          tabIndex={0}
          aria-describedby={flag === index ? noteId : undefined}
          onFocus={() => send({ type: "note", index })}
          onMouseEnter={() => send({ type: "note", index })}
          onMouseLeave={() => send({ type: "note", index: null })}
          onBlur={() => send({ type: "note", index: null })}
          onClick={() => send({ type: "note", index })}
        >
          {f.text}
        </mark>,
      );
      rest = rest.slice(start + f.text.length);
    }
    return bits;
  }
  const prop = item.proposal,
    note = flag === null ? null : item.flags[flag];
  return (
    <div
      ref={root}
      className="rc-detail"
      data-enter={entrance}
      data-ghost={ghost || undefined}
      aria-hidden={ghost || undefined}
      inert={ghost || undefined}
    >
      <div className="rc-who">
        <Avatar item={item} />
        <div>
          <div className="rc-name">
            {item.agent}
            {item.risk !== "low" && (
              <span className="rc-risk" data-risk={item.risk}>
                {item.risk === "high" ? "High" : "Medium"} risk
              </span>
            )}
          </div>
          <span className="rc-model">{item.model}</span>
        </div>
      </div>
      <h3>{item.title}</h3>
      {item.why && (
        <p className="rc-why">
          <b>Why </b>
          {item.why}
        </p>
      )}
      <section className="rc-proposal" aria-label={`Proposal: ${item.type}`}>
        {prop.kind === "diff" && (
          <div className="rc-files">
            {prop.files.map((file) => {
              const slash = file.path.lastIndexOf("/") + 1;
              return (
                <div key={file.path}>
                  <div className="rc-file">
                    <span title={file.path}>
                      <i>{file.path.slice(0, slash)}</i>
                      {file.path.slice(slash)}
                    </span>
                    <small>+{file.plus}</small>
                    <small>−{file.minus}</small>
                  </div>
                  {file.lines && (
                    <div className="rc-diff">
                      <div>
                        {file.lines.map(([sign, num, line], i) =>
                          num === null ? (
                            <div key={i} className="rc-hunk">
                              {line}
                            </div>
                          ) : (
                            <div className="rc-line" key={i} data-change={sign}>
                              <span className="rc-num">
                                <i>{sign}</i>
                                {num}
                              </span>
                              <code>{marked(line, true)}</code>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
        {prop.kind === "plan" && (
          <ol className="rc-plan">
            {prop.steps.map(({ title, tool }, i) => (
              <li key={title}>
                <span
                  className="rc-step"
                  data-warning={item.flags.some((f) => title.includes(f.text)) || undefined}
                >
                  {i + 1}
                </span>
                <div>
                  {marked(title)} <Source credit={tool} />
                </div>
              </li>
            ))}
          </ol>
        )}
        {prop.kind === "text" && (
          <>
            {prop.fields && (
              <dl className="rc-fields">
                {Object.entries(prop.fields).map(([name, value]) => (
                  <div key={name}>
                    <dt>{name}</dt>
                    <dd>
                      {mode.kind === "edit" ? (
                        <input
                          aria-label={name}
                          value={mode.draft[name]}
                          onChange={(e) =>
                            send({ type: "draft", field: name, value: e.target.value })
                          }
                        />
                      ) : (
                        marked(value)
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
            {prop.body &&
              (mode.kind === "edit" ? (
                <textarea
                  aria-label="Proposal"
                  value={mode.draft.Proposal}
                  onChange={(e) =>
                    send({ type: "draft", field: "Proposal", value: e.target.value })
                  }
                />
              ) : (
                <p className="rc-quote">{marked(prop.body)}</p>
              ))}
          </>
        )}
      </section>
      {!!item.sources.length && (
        <div className="rc-sources">
          {item.sources.map((c) => (
            <Source key={c[0]} credit={c} link />
          ))}
        </div>
      )}
      {note && (
        <div key={flag} className="rc-note" ref={bubble} id={noteId} role="tooltip">
          <div>
            <TriangleAlert size={11} /> Agent&apos;s note
          </div>
          <p>{note.note}</p>
          <span>{note.source}</span>
        </div>
      )}
    </div>
  );
}

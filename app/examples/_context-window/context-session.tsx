import { formatK, pct } from "./context-model";
import type { Prompt, SessionPoint } from "./types";

const W = 240;
const H = 34;
const PAD = 3;

type Session = { points: SessionPoint[]; at?: string; crumbs?: string[]; onPoint?: (point: SessionPoint) => void };

export function ContextSpark({ points, at, window, onPoint }: { points: SessionPoint[]; at?: string; window: number; onPoint?: (point: SessionPoint) => void }) {
  const peak = Math.max(...points.map((p) => p.tokens), 1);
  const top = window && peak > window * 0.6 ? Math.max(window, peak) : peak * 1.2;
  const x = (i: number) => (points.length < 2 ? W / 2 : PAD + (i / (points.length - 1)) * (W - PAD * 2));
  const y = (n: number) => H - PAD - (n / top) * (H - PAD * 2);
  const pts = points.map((p, i) => `${x(i).toFixed(1)},${y(p.tokens).toFixed(1)}`);
  const marked = points.findIndex((p) => p.id === at);
  return (
    <span className="ctx-spark">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
        {window > 0 && window <= top && <line x1={0} x2={W} y1={y(window)} y2={y(window)} className="win" />}
        {points.length > 1 && (
          <>
            <path d={`M${pts[0]} L${pts.slice(1).join(" L")} L${x(points.length - 1).toFixed(1)},${H} L${x(0).toFixed(1)},${H} Z`} className="area" />
            <polyline points={pts.join(" ")} className="line" />
          </>
        )}
        {onPoint && points.map((p, i) => {
          const w = window;
          return (
            <rect key={p.id} x={x(i) - Math.max(2, W / points.length / 2)} y={0} width={Math.max(4, W / points.length)} height={H} className={`hit${i === marked ? " on" : ""}`} onClick={() => onPoint(p)}>
              <title>{w ? `Request ${i + 1}: ${formatK(p.tokens)} of ${formatK(w)} (${pct(p.tokens / w)})` : `Request ${i + 1}: ${formatK(p.tokens)} tokens`}</title>
            </rect>
          );
        })}
      </svg>
      {marked >= 0 && <span className="at" style={{ left: `${((x(marked) / W) * 100).toFixed(2)}%`, top: `${((y(points[marked].tokens) / H) * 100).toFixed(2)}%` }} />}
    </span>
  );
}

export function ContextFoot({ prompt, session, agentName }: { prompt: Prompt; session?: Session; agentName?: string }) {
  const notes: string[] = [];
  if (prompt.held) notes.push("Earlier turns are held by the vendor");
  if (prompt.turns) notes.push(prompt.turns === 1 ? "1 turn" : `${prompt.turns} turns`);
  const crumbs = (session?.crumbs ?? [agentName]).filter(Boolean).join(" › ");
  const points = session?.points ?? [];
  return (
    <>
      <div className="ctx-foot">
        <code className="ctx-crumbs">{crumbs}</code>
        <span className="grow" />
        {notes.length > 0 && <span className="ctx-note">{notes.join(" · ")}</span>}
      </div>
      {points.length > 1 && (
        <div className="ctx-session">
          <span className="ctx-k">This session</span>
          <ContextSpark points={points} at={session?.at} window={prompt.window ?? 0} onPoint={session?.onPoint} />
          <span className="ctx-sub">{points.length} requests</span>
        </div>
      )}
    </>
  );
}

export function ContextFree({ prompt }: { prompt: Prompt }) {
  return <div className="ctx-foot ctx-free">{formatK(Math.max(0, (prompt.window ?? 0) - prompt.tokens))} free</div>;
}

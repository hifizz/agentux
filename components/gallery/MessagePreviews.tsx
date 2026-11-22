import { ArrowDown, Brain, ChevronDown, Check, Copy, FileText, Globe, LoaderCircle, RotateCcw, SquareTerminal, ThumbsDown, ThumbsUp } from "lucide-react";

const CARD = "w-[min(80%,22rem)] translate-y-2 rounded-[20px] border border-foreground/10 bg-card p-3 shadow-[0_20px_65px_-18px_#0000002e] motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:-translate-y-1 sm:p-4";
const ROW = "flex items-center gap-2 text-xs text-muted-foreground";
const BAR = "h-1.5 rounded-full bg-foreground/10";

export function MarkdownPreview() {
  return (
    <div className={`${CARD} flex flex-col gap-2`}>
      <p className="text-sm font-semibold">Heading</p>
      <p className="text-xs text-muted-foreground"><b className="text-foreground">Bold</b>, <i>italic</i>, <code className="rounded border border-foreground/10 px-1 font-mono">code</code></p>
      <ul className="list-disc pl-4 text-xs text-muted-foreground"><li>List item</li><li>☑ Task item</li></ul>
      <pre className="rounded-lg bg-foreground/[0.05] px-2 py-1 font-mono text-[10px] text-muted-foreground">const rate = 60;</pre>
    </div>
  );
}

export function StreamingPreview() {
  return (
    <div className={`${CARD} flex flex-col gap-2`}>
      <p className="text-xs leading-5 text-foreground">Tokens arrive in bursts, the text arrives at a steady pace<span className="ml-0.5 inline-block h-3 w-1.5 translate-y-0.5 rounded-sm bg-foreground motion-safe:animate-pulse" /></p>
      <div className="flex gap-1">{[30, 8, 44, 2, 20].map((w, i) => <span key={i} className={BAR} style={{ width: w }} />)}</div>
    </div>
  );
}

export function ShadowScrollPreview() {
  return (
    <div className={`${CARD} relative flex h-32 flex-col gap-2 overflow-hidden [mask-image:linear-gradient(transparent,#000_30%,#000_70%,transparent)]`}>
      {[80, 60, 90, 50, 70, 85].map((w, i) => <span key={i} className={BAR} style={{ width: `${w}%` }} />)}
      <span className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full border border-foreground/10 bg-card px-2 py-0.5 text-[10px]"><ArrowDown size={10} /> Jump to latest</span>
    </div>
  );
}

export function ActionsPreview() {
  return (
    <div className={`${CARD} flex flex-col gap-2`}>
      <p className="text-xs leading-5 text-foreground">Keep the strip mounted while busy is true.</p>
      <p className={ROW}><Copy size={13} /><ThumbsUp size={13} /><ThumbsDown size={13} /><RotateCcw size={13} /><span className="ml-1">Sonnet 4.5 · 1.2k tokens</span></p>
    </div>
  );
}

export function ThinkingBlockPreview() {
  return (
    <div className={`${CARD} flex flex-col gap-2`}>
      <p className={ROW}><Brain size={14} /> Thought for 14 seconds</p>
      <p className="ml-1.5 border-l border-foreground/10 pl-3 text-xs leading-5 text-muted-foreground">The picker is portalled, so it cannot push the card.</p>
    </div>
  );
}

export function ToolOutputPreview() {
  return (
    <div className={`${CARD} flex flex-col gap-2`}>
      <p className={ROW}><FileText size={14} /> Read <span className="font-mono text-foreground">queue.ts</span></p>
      <p className={ROW}><SquareTerminal size={14} /> Running <span className="font-mono text-foreground">npm test</span><LoaderCircle size={12} className="ml-auto motion-safe:animate-spin" /></p>
      <pre className="rounded-lg bg-foreground/[0.05] px-2 py-1 font-mono text-[10px] text-muted-foreground">✓ drains in order</pre>
    </div>
  );
}

export function SearchPreview() {
  return (
    <div className={`${CARD} flex flex-col gap-2`}>
      <p className={ROW}><Globe size={14} /> Searched 5 sites <span className="ml-auto flex -space-x-1">{["r", "m", "n"].map((l) => <span key={l} className="grid size-4 place-items-center rounded-full bg-foreground text-[9px] text-background ring-2 ring-card">{l}</span>)}</span></p>
      <p className="text-xs leading-5 text-foreground">Reveal tokens on each frame <span className="rounded-full bg-foreground/10 px-1 text-[10px]">1</span></p>
    </div>
  );
}

export function SwarmPreview() {
  return (
    <div className={`${CARD} grid grid-cols-2 gap-2`}>
      {["Atlas", "Birch", "Cedar", "Dune"].map((n, i) => (
        <div key={n} className="flex items-center gap-1.5 rounded-xl border border-foreground/10 p-2 text-xs">
          <span className="grid size-4 place-items-center rounded-full bg-foreground text-[9px] text-background">{i === 3 ? <Check size={9} /> : n[0]}</span>
          {n}
        </div>
      ))}
    </div>
  );
}

export function AgentMessagePreview() {
  return (
    <div className={`${CARD} flex flex-col gap-2`}>
      <p className="ml-auto max-w-[75%] rounded-2xl bg-foreground/[0.06] px-3 py-1.5 text-xs">Compare these two specs</p>
      <p className={ROW}><Brain size={14} /> Thought for 3 seconds</p>
      <p className={ROW}><Globe size={14} /> Searched 2 sites</p>
      <p className="text-xs font-medium">The streaming section changed in three places.</p>
    </div>
  );
}

export function WorkLogPreview() {
  return (
    <div className={`${CARD} flex flex-col gap-1.5`}>
      <p className={ROW}><ChevronDown size={14} /> Worked for 13m 30s <span className="text-emerald-600">+2023</span><span className="text-red-500">−2</span></p>
      <div className="ml-1.5 flex flex-col gap-1.5 border-l border-foreground/10 pl-3 text-xs text-muted-foreground">
        <p>Read <span className="text-foreground underline decoration-dotted underline-offset-2">components.ts:6-40</span></p>
        <p>Searched tokens.css for shimmer</p>
        <p>Thought for 42s</p>
      </div>
    </div>
  );
}

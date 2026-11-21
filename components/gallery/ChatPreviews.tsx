import { Bot, Check, ChevronRight, FileText, GitPullRequest, Lightbulb, MessageCircleQuestion, ShieldQuestion, Sparkles, SquareTerminal } from "lucide-react";

const CARD = "w-[min(80%,22rem)] translate-y-2 rounded-[20px] border border-foreground/10 bg-card p-3 shadow-[0_20px_65px_-18px_#b74c2a50] motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:-translate-y-1 sm:p-4";
const ROW = "flex items-center gap-2 text-xs text-muted-foreground";
const CHIP = "rounded-full px-2.5 py-1 text-xs font-medium";

export function MessagePreview() {
  return (
    <div className={`${CARD} flex flex-col gap-2.5`}>
      <p className="ml-auto max-w-[75%] rounded-2xl bg-foreground/[0.06] px-3 py-1.5 text-xs">Why does the strip flicker?</p>
      <p className={ROW}><Lightbulb size={14} /> Thought for 4 seconds</p>
      <p className="text-sm font-medium">The queue is drained inside an effect.</p>
    </div>
  );
}

export function ReasoningPreview() {
  return (
    <div className={`${CARD} flex flex-col gap-2`}>
      <p className={`${ROW} font-medium text-foreground`}><Lightbulb size={14} /> Thinking <ChevronRight size={14} className="rotate-90" /></p>
      <p className="border-l-2 border-foreground/10 pl-3 text-xs leading-5 text-muted-foreground">The picker is portalled, so it cannot push the card. The strip is the likely cause.</p>
    </div>
  );
}

export function ToolStepsPreview() {
  return (
    <div className={`${CARD} flex flex-col gap-2`}>
      <p className={ROW}><FileText size={14} /> Read <span className="truncate font-mono text-foreground">demo.tsx</span></p>
      <p className={ROW}><SquareTerminal size={14} /> Ran <span className="truncate font-mono text-foreground">$ npm run lint</span> <span className="ml-auto text-[#c2410c]">Failed</span></p>
      <p className={ROW}><MessageCircleQuestion size={14} /> Asking you <span className="ml-auto">Waiting for you</span></p>
    </div>
  );
}

export function ApprovalsPreview() {
  return (
    <div className={`${CARD} flex flex-col gap-2.5`}>
      <p className="flex items-center gap-2 text-sm font-medium"><ShieldQuestion size={15} /> Allow bash?</p>
      <p className="truncate rounded-lg bg-foreground/[0.05] px-2.5 py-1.5 font-mono text-xs">$ git push origin feat/composer</p>
      <div className="flex gap-1.5">
        <span className={`${CHIP} bg-[#ff6b35] text-[#22120c]`}>Allow</span>
        <span className={`${CHIP} border border-foreground/10`}>Deny</span>
      </div>
    </div>
  );
}

export function AskPreview() {
  return (
    <div className={`${CARD} flex flex-col gap-2`}>
      <p className="flex items-center justify-between text-sm font-medium">What should this agent watch? <span className="text-xs font-normal text-muted-foreground">1/3</span></p>
      {["New support tickets", "Pull requests waiting for review"].map((label, i) => (
        <p key={label} className="flex items-center gap-2 rounded-lg border border-foreground/10 px-2 py-1.5 text-xs">
          <span className={`grid size-4 place-items-center rounded text-[10px] font-semibold ${i === 0 ? "bg-[#ff6b35] text-[#22120c]" : "bg-foreground/[0.06]"}`}>{"AB"[i]}</span>
          {label}
        </p>
      ))}
    </div>
  );
}

export function ActivityPreview() {
  return (
    <div className={`${CARD} flex flex-col gap-2`}>
      <p className={ROW}><Check size={14} /> <span className="truncate font-mono text-foreground">queue-strip.tsx</span> <span className="ml-auto font-mono"><span className="text-emerald-600">+6</span> <span className="text-[#c2410c]">-2</span></span></p>
      <p className="flex items-center gap-2 rounded-lg border border-foreground/10 px-2.5 py-1.5 font-mono text-xs"><SquareTerminal size={14} /> $ npm run lint <span className="ml-auto font-sans text-emerald-600">Passed</span></p>
      <p className="flex items-center gap-2 rounded-lg border border-foreground/10 px-2.5 py-1.5 text-xs"><GitPullRequest size={14} /> Stop the flicker <span className="text-muted-foreground">#128</span> <span className="ml-auto text-emerald-600">Open</span></p>
    </div>
  );
}

export function ThinkingPreview() {
  return (
    <div className={`${CARD} flex items-center gap-2 text-sm`}>
      <span className="flex gap-0.5">
        {[0, 1, 2].map((i) => <span key={i} className="size-1.5 rounded-full bg-[#ff6b35]" style={{ opacity: 1 - i * 0.3 }} />)}
      </span>
      Thinking <span className="text-xs text-muted-foreground tabular-nums">0m 12s · 1.4k tokens</span>
    </div>
  );
}

export function SuggestionsPreview() {
  return (
    <div className={`${CARD} flex flex-col gap-2.5`}>
      <p className="text-xs text-muted-foreground">Try one of these</p>
      {["Summarise this week's tickets", "Review a design before handoff"].map((label, i) => (
        <p key={label} className="flex items-center gap-2 text-sm">{i === 0 ? <Sparkles size={14} /> : <Bot size={14} />} {label}</p>
      ))}
    </div>
  );
}

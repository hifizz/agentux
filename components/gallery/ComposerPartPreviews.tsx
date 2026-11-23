import { AtSign, CornerDownRight, Pencil, X, Folder, GitBranch, Laptop, Lock, Paperclip, Shield } from "lucide-react";

const CARD = "w-[min(80%,22rem)] translate-y-2 rounded-[20px] border border-foreground/10 bg-card p-3 shadow-[0_20px_65px_-18px_#0000002e] motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:-translate-y-1 sm:p-4";
const CHIP = "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs text-muted-foreground";
const MENU = "flex flex-col gap-0.5 rounded-xl border border-foreground/10 bg-card p-1 text-xs shadow-sm";
const ROW = "flex items-center justify-between gap-3 rounded-md px-2 py-1 text-muted-foreground";
const ON = "bg-foreground/[0.06] text-foreground";

export function PromptInputPreview() {
  return (
    <div className={`${CARD} flex flex-col gap-4`}>
      <span className="w-fit rounded-md border border-foreground/10 px-1.5 py-0.5 text-[11px] text-muted-foreground">spec.md</span>
      <p className="text-sm text-muted-foreground">Describe the change you want</p>
      <div className="flex items-center justify-between">
        <span className="flex gap-1"><span className={CHIP}><Paperclip size={12} /></span><span className={CHIP}><AtSign size={12} /> Mention</span></span>
        <span className="size-6 rounded-full bg-foreground" />
      </div>
    </div>
  );
}

function MenuPreview({ title, rows, active }: { title: string; rows: string[]; active: number }) {
  return (
    <div className={`${CARD} flex flex-col gap-2`}>
      <div className={MENU}>
        <p className="px-2 pt-1 text-[11px] text-muted-foreground/70">{title}</p>
        {rows.map((r, i) => <p key={r} className={`${ROW} ${i === active ? ON : ""}`}>{r}{i === active && <span>✓</span>}</p>)}
      </div>
    </div>
  );
}

export const PermissionPreview = () => <MenuPreview title="Permissions" rows={["Ask", "Edit", "Auto", "Bypass"]} active={1} />;
export const ModelPreview = () => <MenuPreview title="Search models" rows={["Fable 5", "Opus 5", "Sonnet 5", "GPT-5"]} active={0} />;

export function EffortPreview() {
  return (
    <div className={`${CARD} flex items-center justify-center gap-3`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className="flex h-5 items-end gap-0.5">
          {[1, 2, 3, 4, 5].map((i) => <span key={i} className={`w-1 rounded-[1px] ${i <= n ? "bg-foreground" : "bg-foreground/15"}`} style={{ height: `${40 + i * 12}%` }} />)}
        </span>
      ))}
    </div>
  );
}

export function ContextPreview() {
  const parts = [["System", 4], ["Tools", 12], ["Files", 18], ["Messages", 34]] as const;
  return (
    <div className={`${CARD} flex flex-col gap-2.5`}>
      <p className="flex justify-between text-xs"><span>Context window</span><span className="text-muted-foreground">84K / 200K</span></p>
      <div className="flex h-2 overflow-hidden rounded-full bg-foreground/[0.06]">
        {parts.map(([k, w], i) => <span key={k} style={{ width: `${w}%`, opacity: 1 - i * 0.2 }} className="border-r border-card bg-foreground" />)}
      </div>
      {parts.map(([k, w]) => <p key={k} className="flex justify-between text-[11px] text-muted-foreground"><span>{k}</span><span>{w}%</span></p>)}
    </div>
  );
}

export function TopTrayPreview() {
  return (
    <div className={`${CARD} flex flex-col p-0!`}>
      <p className="rounded-t-[20px] bg-foreground/[0.04] px-3 pt-2 pb-5 text-xs text-muted-foreground">2 queued · Also add a compact density</p>
      <p className="-mt-3 rounded-[16px] border border-foreground/10 bg-card px-3 py-3 text-sm text-muted-foreground">Ask a follow-up</p>
    </div>
  );
}

export function BottomTrayPreview() {
  return (
    <div className={`${CARD} flex flex-col p-0!`}>
      <p className="relative z-10 rounded-[16px] border border-foreground/10 bg-card px-3 py-3 text-sm text-muted-foreground">Start a task</p>
      <div className="-mt-3 flex justify-between rounded-b-[20px] bg-foreground/[0.04] px-2 pt-4 pb-1.5">
        <span className="flex"><span className={CHIP}><Folder size={12} /> reni</span><span className={CHIP}><GitBranch size={12} /> main</span></span>
        <span className={CHIP}><Laptop size={12} /> This Mac</span>
      </div>
    </div>
  );
}

export const DirectoryPreview = () => <MenuPreview title="Recent" rows={["~/code/reni", "~/code/agent-builder", "Scratch"]} active={0} />;

export function RepoPreview() {
  return (
    <div className={`${CARD} flex flex-col gap-2`}>
      <p className="flex items-center gap-1 text-xs"><span className={CHIP}>acme/web <Lock size={10} /></span>/<span className={CHIP}><GitBranch size={12} /> feat/composer</span></p>
      <div className={MENU}><p className={`${ROW} ${ON}`}>+ Create branch fix/tray</p><p className={ROW}>main</p></div>
    </div>
  );
}

export function StatesPreview() {
  return (
    <div className={`${CARD} grid grid-cols-2 gap-2 text-[11px] text-muted-foreground`}>
      {["Idle", "Busy · queue", "Steer", "Error", "Disabled", "Compact"].map((s, i) => (
        <span key={s} className={`flex items-center gap-1.5 rounded-lg border border-foreground/10 px-2 py-1.5 ${i === 3 ? "border-foreground/30 text-foreground" : ""}`}><Shield size={11} />{s}</span>
      ))}
    </div>
  );
}

export function QueueSteerPreview() {
  return (
    <div className={`${CARD} flex flex-col p-0!`}>
      <div className="flex flex-col gap-1 rounded-t-[20px] bg-foreground/[0.04] px-3 pt-2 pb-5 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5"><span className="flex-1 truncate">Use a pencil icon for edit</span><Pencil size={11} /><CornerDownRight size={11} /><X size={11} /></span>
        <span className="flex items-center gap-1.5"><span className="rounded border border-foreground/10 px-1 text-[10px]">steer</span><span className="flex-1 truncate">Keep the tray compact</span><Pencil size={11} /><X size={11} /></span>
      </div>
      <p className="-mt-3 rounded-[16px] border border-foreground/10 bg-card px-3 py-3 text-sm text-muted-foreground">Queue or steer a follow-up</p>
    </div>
  );
}

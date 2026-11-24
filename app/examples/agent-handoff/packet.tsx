import { useRef, useState, type PointerEvent } from "react";
import { Ban, File, Link2, ListChecks, StickyNote } from "lucide-react";
import { Spinner, Swap, TaskMark } from "./agent";
import type { Packet } from "./relay";

export type Drag = { packet: Packet; x: number; y: number; width: number; over: number | null };
type Props = { packet: Packet; state: string; picked: boolean; dragging: boolean; onPick: () => void; onDrag: (drag: Drag | null) => void; onDrop: (index: number) => void };
const kinds = { file: File, link: Link2, note: StickyNote, decision: ListChecks };

export function PacketCard({ packet, state, picked, dragging, onPick, onDrag, onDrop }: Props) {
  const [open, setOpen] = useState(false), [reason, setReason] = useState<string | null>(null), [restored, setRestored] = useState<string[]>([]);
  const pointer = useRef<{ x: number; y: number; dx: number; dy: number; width: number; moved: boolean } | null>(null);
  const skipClick = useRef(false), lastKey = useRef(-Infinity);
  const items = packet.task.packets[packet.lane];
  const summary = items.filter(item => !item.why || restored.includes(item.label)).map(item => item.label).join(", ");
  const word = picked ? "Now tap an agent" : state;
  const agentAt = (event: PointerEvent) => {
    const slot = document.elementFromPoint(event.clientX, event.clientY)?.closest<HTMLElement>("[data-agent]");
    return slot && Number(slot.dataset.agent) > packet.lane ? Number(slot.dataset.agent) : null;
  };
  return <li className="ah-packet" data-picked={picked || undefined} data-dragging={dragging || undefined}>
    <button type="button" className="ah-packet-button" aria-expanded={open} aria-pressed={picked}
      onPointerDown={event => {
        if (event.button !== 0) return;
        const rect = event.currentTarget.getBoundingClientRect();
        pointer.current = { x: event.clientX, y: event.clientY, dx: event.clientX - rect.x, dy: Math.min(18, event.clientY - rect.y), width: rect.width, moved: false };
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerMove={event => {
        const start = pointer.current;
        if (!start || (!start.moved && Math.hypot(event.clientX - start.x, event.clientY - start.y) < 5)) return;
        start.moved = true;
        const board = event.currentTarget.closest(".ah-board")?.getBoundingClientRect();
        if (board) onDrag({ packet, x: event.clientX - start.dx - board.x, y: event.clientY - start.dy - board.y, width: start.width, over: agentAt(event) });
      }}
      onPointerUp={event => {
        if (pointer.current?.moved) { skipClick.current = true; const index = agentAt(event); if (index !== null) onDrop(index); onDrag(null); }
        pointer.current = null;
      }} onPointerCancel={() => { pointer.current = null; onDrag(null); }}
      onClick={event => {
        if (skipClick.current) { skipClick.current = false; return; }
        const keyboard = event.detail === 0, now = performance.now();
        if (picked || event.detail === 2 || (keyboard && now - lastKey.current < 550)) { onPick(); setOpen(false); }
        else setOpen(!open);
        lastKey.current = keyboard ? now : -Infinity;
      }}>
      <span className="ah-packet-head"><span><TaskMark brand={packet.task.brand}/></span><strong>{packet.task.title}</strong></span>
      <span className="ah-summary" title={summary}>{summary}</span>
      <span className="ah-packet-state"><Swap value={word}><i data-state={picked || state === "Handing on" ? "passing" : state.startsWith("With ") ? "working" : state === "Looks good" ? "done" : "warning"}>{(state.startsWith("With ") || state === "Handing on") && !picked ? <Spinner/> : null}</i>{word}</Swap></span>
    </button>
    <div className="ah-fold" data-open={open} inert={!open}><div><ul>{items.map(item => {
      const lost = !!item.why && !restored.includes(item.label), Icon = lost ? Ban : kinds[item.kind];
      return <li key={item.label}><button type="button" className="ah-item" data-lost={lost} aria-expanded={lost ? reason === item.label : undefined} title={lost ? item.why : item.label} onClick={() => { if (lost) setReason(reason === item.label ? null : item.label); }}><Icon size={12}/><span>{item.label}</span></button>
        {lost && reason === item.label && <div className="ah-why"><p>{item.why}</p><button type="button" onClick={() => { setRestored([...restored, item.label]); setReason(null); }}>Add back</button></div>}
      </li>;
    })}</ul></div></div>
  </li>;
}

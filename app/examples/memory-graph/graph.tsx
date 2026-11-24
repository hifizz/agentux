import { useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { flightPath, graphLayout, relationWire, type Side } from "./geometry";
import { Mark, PixelMark } from "./marks";
import type { Panel } from "./details";
import type { Entry, Flight, Memory, Tool } from "./session";

export type Travel = Flight & { key: string };
type Group = { kind: "group"; id: string; name: string; side: Side; items: Entry[] };
type Node = Entry | Group;
function visible(items: Entry[], side: Side): Node[] {
  if (items.length <= 6) return items;
  return [...items.slice(0, 5), { kind: "group", id: `more-${side}`, name: `+${items.length - 5} more`, side, items: items.slice(5) }];
}

function Label({ node, hot }: { node: Node; hot: boolean }) {
  if (node.kind === "group") return <><span className="mg-stack">{node.items.slice(0,3).map(item => <span className="mg-tile" key={item.id}><Mark item={item} /></span>)}</span><span><b>{node.name}</b><small>{node.side === "tool" ? "tools" : "memories"}</small></span></>;
  if (node.kind === "memory") return <><b title={node.name}>{node.name}</b><small title={node.source}>{node.source}</small><span className="mg-source" title={node.file}><Mark item={node} /><span>{node.file}</span></span></>;
  return <><span className="mg-tool-title"><Mark item={node} /><b>{node.name}</b><small data-shine={hot || undefined}>{hot ? "In use" : node.last}</small></span><span className="mg-scope" title={`${node.access} · ${node.scope}`}>{node.access} · {node.scope}</span><small title={node.note}>{node.note}</small></>;
}

function Beam({ wire, length, duration }: ReturnType<typeof flightPath>) {
  const tail = Math.min(44, length / 2);
  return <g className="mg-beam" style={{ "--duration": `${duration}ms` } as CSSProperties}>
    {Array.from({length:8}, (_,i) => { const span = tail * (8-i)/8, start = (tail+span)/2;
      return <path key={i} d={wire} strokeDasharray={`${span} ${length+2*tail}`} style={{"--start":start,"--end":start-tail-length} as CSSProperties} />;
    })}
  </g>;
}

export function Graph({ memories, tools, disabled, active, flights, status, selected, open }: {
  memories: Memory[]; tools: Tool[]; disabled: string[]; active: string[]; flights: Travel[]; status: string; selected?: string;
  open: (panel: Panel, anchor: HTMLButtonElement) => void;
}) {
  const stage = useRef<HTMLDivElement>(null);
  const [width,setWidth] = useState(760), [pointed,setPointed] = useState<string | null>(null);
  const [cursor,setCursor] = useState<Partial<Record<Side,string>>>({});
  useLayoutEffect(() => {
    const el = stage.current;
    if (!el) return;
    const resize = () => setWidth(el.clientWidth);
    resize(); const ro = new ResizeObserver(resize); ro.observe(el); return () => ro.disconnect();
  }, []);
  const sides = { memory: visible(memories,"memory"), tool: visible(tools,"tool") };
  const layout = graphLayout(width,sides.memory.length,sides.tool.length);
  const nodes = (["memory","tool"] as const).flatMap(side => sides[side].map((node,i) => ({ node, seat: layout[side][i], side })));
  const diagramNode = (id: string) => nodes.find(({node}) => node.id === id || (node.kind === "group" && node.items.some(item => item.id === id)));
  const selectedMemory = memories.find(m => m.id === (pointed ?? selected));
  const relations = selectedMemory ? memories.filter(m => m.id !== selectedMemory.id && (selectedMemory.related?.includes(m.id) || m.related?.includes(selectedMemory.id) || m.replaces === selectedMemory.id || selectedMemory.replaces === m.id)) : [];
  const order = (side: Side) => nodes.filter(n => n.side === side).sort((a,b) => a.seat.box.top-b.seat.box.top).map(n => n.node.id);
  const stop = (side: Side) => order(side).find(id => id === cursor[side]) ?? order(side)[0];
  function move(e: KeyboardEvent<HTMLButtonElement>, id: string, side?: Side) {
    const list = side ? order(side) : [], index = list.indexOf(id);
    const target = e.key === "ArrowLeft" ? (side === "tool" ? "agent" : stop("memory")) : e.key === "ArrowRight" ? (side === "memory" ? "agent" : stop("tool")) : e.key === "Home" ? list[0] : e.key === "End" ? list.at(-1) : e.key === "ArrowDown" ? list[Math.min(list.length-1,index+1)] : e.key === "ArrowUp" ? list[Math.max(0,index-1)] : null;
    if (target) { e.preventDefault(); stage.current?.querySelector<HTMLButtonElement>(`[data-key="${target}"]`)?.focus(); }
  }
  const routes = flights.flatMap(f => {
    const to = diagramNode(f.to), from = f.from && !disabled.includes(f.from) ? diagramNode(f.from) : undefined;
    return to && !disabled.includes(f.to) ? [{key:f.key, to:to.node.id, ...flightPath(to.seat,from?.seat)}] : [];
  });
  const arrival = (id: string) => routes.filter(r => r.to === id);
  const isNew = (node: Node) => node.kind !== "tool" || !node.last;
  function list(side: Side) {
    return <ul aria-label={side === "tool" ? "Tools" : "Memories"}>{nodes.filter(n => n.side === side).map(({node,seat}) => {
      const hot = active.includes(node.id), old = memories.some(m => m.replaces === node.id), off = disabled.includes(node.id);
      const arrivals = arrival(node.id);
      const fresh = arrivals.at(-1), delay = (fresh?.duration ?? 0) * .88;
      const desc = node.kind === "memory" ? `${node.name}, from ${node.file}` : node.kind === "tool" ? `${node.name}, ${node.access}, ${node.scope}` : `${node.name} ${side === "tool" ? "tools" : "memories"}`;
      return <li key={node.id} style={seat.box}><button type="button" data-key={node.id} className={`mg-card mg-${node.kind}`} data-old={old || undefined} data-off={off || undefined} data-hot={hot || undefined} data-linked={relations.some(m => m.id === node.id) || undefined} data-new={fresh && isNew(node) || undefined}
        style={{ "--arrive": `${delay}ms` } as CSSProperties} tabIndex={stop(side) === node.id ? 0 : -1} aria-haspopup="dialog" aria-expanded={selected === node.id} aria-label={[desc, old && "outdated", off && "off", hot && (side === "tool" ? "in use" : "recalled")].filter(Boolean).join(", ")}
        onFocus={() => { setCursor(c => ({...c,[side]:node.id})); setPointed(node.id); }} onBlur={() => setPointed(null)} onMouseEnter={() => setPointed(node.id)} onMouseLeave={() => setPointed(null)} onKeyDown={e => move(e,node.id,side)} onClick={e => open(node.kind === "group" ? {kind:"list",side} : {kind:"entry",item:node}, e.currentTarget)}>
        {arrivals.map(f => <i key={f.key} className="mg-receipt" data-edge={seat.edge} aria-hidden="true" />)}<Label node={node} hot={hot} /></button></li>;
    })}</ul>;
  }
  return <div ref={stage} className="mg-map" style={{height: layout.height}}>
    <svg className="mg-wires" aria-hidden="true">{nodes.map(({node,seat}) => <path key={node.id} className="mg-wire" d={seat.wire} data-new={isNew(node) && arrival(node.id).length > 0 || undefined} style={{"--arrive":`${(arrival(node.id).at(-1)?.duration ?? 0)*.88}ms`} as CSSProperties} data-old={memories.some(m => m.replaces === node.id) || undefined} data-off={disabled.includes(node.id) || undefined} data-hot={active.includes(node.id) || undefined} />)}
      {selectedMemory && relations.map((m,i) => { const a=diagramNode(selectedMemory.id),b=diagramNode(m.id);return a && b && a!==b && <path key={m.id} className="mg-link" data-replaced={m.replaces === selectedMemory.id || selectedMemory.replaces === m.id || undefined} d={relationWire(a.seat.box,b.seat.box,i)} />; })}
      {routes.map(({key,...path}) => <Beam key={key} {...path} />)}</svg>
    {layout.narrow && <><span className="mg-side-label" style={{top:112}}>Memory <small>{memories.length}</small></span><span className="mg-side-label" style={{top:layout.toolStart-24}}>Tools <small>{tools.length}</small></span></>}
    {list("memory")}
    <button type="button" data-key="agent" className="mg-card mg-agent" style={layout.agent} aria-label={`Assistant, ${status}. Add files or tools`} aria-haspopup="dialog" aria-expanded={selected === "agent"} onKeyDown={e => move(e,"agent")} onClick={e => open({kind:"quick"},e.currentTarget)}>
      <span className="mg-identity"><PixelMark busy={status !== "Personal assistant"} /><span><b>Assistant</b><small data-shine={status !== "Personal assistant" || undefined}>{status}</small></span></span>
      <span className="mg-rack">{tools.slice(0,5).map(t => <span className="mg-tile" key={t.id} title={t.name} data-on={active.includes(t.id) || undefined} data-off={disabled.includes(t.id) || undefined}><Mark item={t} /></span>)}{tools.length>5 && <span className="mg-tile">+{tools.length-5}</span>}</span>
    </button>{list("tool")}
    <svg className="mg-ports" aria-hidden="true">{Array.from(new Map(nodes.map(({seat})=>[seat.port.join(),seat.port])).values()).map(([cx,cy])=><circle key={`${cx},${cy}`} cx={cx} cy={cy} r={3} />)}</svg>
  </div>;
}

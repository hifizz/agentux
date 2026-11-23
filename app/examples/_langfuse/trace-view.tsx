"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "../_trace-kit/cn";
import { useTreeNav } from "../_trace-kit/use-tree-nav";
import { NodePanel } from "./node-panel";
import { NodeRow } from "./node-row";
import { AxisHead, GridLayer } from "./trace-axis";
import { TraceHead } from "./trace-head";
import { TraceSummary } from "./trace-summary";
import { TraceToolbar } from "./trace-toolbar";
import type { Trace } from "./model";
import type { LoadIo } from "./use-node-io";
import { axisOf, countInstants, defaultFolded, failureOrigins, pathTo, visibleIds, type TraceFilter } from "./view-model";
import "../_trace-kit/trace-kit.css";
import "./trace-view.css";

export type TraceViewProps = {
  trace: Trace;
  selectedId?: string | null;
  onSelect?: (id: string | null) => void;
  loadIo?: LoadIo;
  className?: string;
};

export function TraceView({ trace, selectedId, onSelect, loadIo, className }: TraceViewProps) {
  const [filter, setFilter] = useState<TraceFilter>("all");
  const [hideInstant, setHideInstant] = useState(false);
  const [inner, setInner] = useState<string | null>(null);
  const [jump, setJump] = useState(0);
  const selected = selectedId === undefined ? inner : selectedId;

  const keep = useMemo(() => visibleIds(trace, filter, hideInstant), [trace, filter, hideInstant]);
  const nodes = useMemo(() => trace.nodes.filter((node) => keep.has(node.id)), [trace, keep]);
  const axis = useMemo(() => axisOf(trace), [trace]);
  const initialFolds = useMemo(() => defaultFolded(trace), [trace]);
  const origins = useMemo(() => failureOrigins(trace), [trace]);
  const instants = useMemo(() => countInstants(trace), [trace]);
  const counts = useMemo(
    () => ({
      all: trace.nodes.length,
      generations: trace.totals.generations,
      tools: trace.totals.tools,
      errors: trace.totals.errors,
    }),
    [trace],
  );

  const below = useMemo(() => {
    const direct = new Map<string, number>();
    const total = new Map<string, number>();
    for (let i = nodes.length - 1; i >= 0; i--) {
      const { id, parentId } = nodes[i];
      if (!parentId) continue;
      direct.set(parentId, (direct.get(parentId) ?? 0) + 1);
      total.set(parentId, (total.get(parentId) ?? 0) + 1 + (total.get(id) ?? 0));
    }
    return { direct, total };
  }, [nodes]);

  const nav = useTreeNav({
    nodes: nodes.map((node) => ({ id: node.id, parentId: node.parentId, expandable: (below.direct.get(node.id) ?? 0) > 0 })),
    defaultFolded: initialFolds,
  });
  const { elements } = nav;

  const select = (id: string | null) => {
    setInner(id);
    onSelect?.(id);
  };

  const reveal = (id: string) => {
    if (!keep.has(id)) {
      setFilter("all");
      setHideInstant(false);
    }
    nav.setFolded(pathTo(trace, id).slice(0, -1).map((node) => node.id), false);
    select(id);
  };

  const refilter = (next: TraceFilter, nextHide: boolean) => {
    setFilter(next);
    setHideInstant(nextHide);
    if (selected && !visibleIds(trace, next, nextHide).has(selected)) select(null);
  };

  const jumpToFailure = () => {
    reveal(origins[jump % origins.length].id);
    setJump((count) => count + 1);
  };

  const expandableIds = nodes.filter((node) => (below.direct.get(node.id) ?? 0) > 0).map((node) => node.id);
  const allFolded = expandableIds.length > 0 && expandableIds.every((id) => nav.isFolded(id));
  const selectedNode = selected ? trace.nodes.find((node) => node.id === selected) : undefined;

  useEffect(() => {
    if (selected) elements.current.get(selected)?.scrollIntoView({ block: "nearest" });
  }, [selected, elements]);

  return (
    <section className={cn("tk tv", className)} aria-label="Trace" data-live={trace.running ? "" : undefined}>
      <TraceHead trace={trace} failures={origins.length} onJump={jumpToFailure} />
      <TraceToolbar
        filter={filter}
        counts={counts}
        onFilter={(next) => refilter(next, hideInstant)}
        hideInstant={hideInstant}
        instants={instants}
        onHideInstant={(next) => refilter(filter, next)}
        foldLabel={allFolded ? "Expand all" : "Collapse all"}
        foldDisabled={expandableIds.length === 0}
        onFold={() => nav.setFolded(expandableIds, !allFolded)}
      />
      <div className="tv-main">
        <div className="tv-wf">
          <GridLayer axis={axis} />
          <AxisHead axis={axis} />
          <div className="tv-rows" role="tree" aria-label="Steps">
            {nodes.map((node) => {
              const expandable = (below.direct.get(node.id) ?? 0) > 0;
              return (
                <NodeRow
                  key={node.id}
                  node={node}
                  axis={axis}
                  hidden={nav.isHidden(node.id)}
                  folded={expandable && nav.isFolded(node.id)}
                  expandable={expandable}
                  below={below.total.get(node.id) ?? 0}
                  selected={selected === node.id}
                  focusable={nav.rovingId === node.id}
                  rowRef={(element) => nav.register(node.id, element)}
                  onSelect={() => select(selected === node.id ? null : node.id)}
                  onToggle={() => nav.toggle(node.id)}
                  onKeyDown={(event) => {
                    if (nav.handleKey(event, node.id)) return;
                    if (event.key !== "Enter" && event.key !== " ") return;
                    event.preventDefault();
                    select(selected === node.id ? null : node.id);
                  }}
                />
              );
            })}
          </div>
        </div>
        <aside className="tv-panel" aria-label="Details">
          {selectedNode ? <NodePanel trace={trace} node={selectedNode} loadIo={loadIo} onClose={() => select(null)} onNavigate={reveal} /> : <TraceSummary trace={trace} onSelect={reveal} />}
        </aside>
      </div>
    </section>
  );
}

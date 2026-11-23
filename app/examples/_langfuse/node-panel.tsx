"use client";

import { CardHead, CardWho, CloseButton, ErrorNote, FactGrid } from "../_trace-kit/floating-card";
import { StatusPill } from "../_trace-kit/status-pill";
import { formatCost, formatDuration, formatTokens } from "./format";
import { IoBlock, IoSkeleton } from "./io-block";
import type { Trace, TraceNode } from "./model";
import { KIND_LABEL, NodeIcon } from "./node-icon";
import { TokenBreakdown, TokenLegend } from "./token-legend";
import { useNodeIo, type LoadIo } from "./use-node-io";
import { pathTo, speedOf } from "./view-model";

export type NodePanelProps = {
  trace: Trace;
  node: TraceNode;
  loadIo?: LoadIo;
  onClose: () => void;
  onNavigate: (id: string) => void;
};

const PILL = {
  error: { status: "failed", text: "Failed" },
  running: { status: "running", text: "Running" },
  warning: { status: undefined, text: "Warning" },
  ok: { status: "done", text: "Done" },
} as const;

export function NodePanel({ trace, node, loadIo, onClose, onNavigate }: NodePanelProps) {
  const { status, io, retry } = useNodeIo(node, loadIo);
  const pill = PILL[node.status];
  const speed = speedOf(node);
  const path = pathTo(trace, node.id);
  const propagated = path.filter((step) => step.failure === "propagated").length;

  const facts: [string, string, string?][] = [
    ["Duration", formatDuration(node.duration)],
    ["Started", `+${formatDuration(node.start)}`],
  ];
  if (node.ttft !== undefined) facts.push(["First token", formatDuration(node.ttft)]);
  if (speed !== null) facts.push(["Speed", `${speed} tok/s`, "Output tokens divided by the time after the first token"]);

  return (
    <div className="tv-detail">
      <CardHead>
        <NodeIcon node={node} scale={1.4} />
        <CardWho title={node.name} sub={`${KIND_LABEL[node.kind]}${node.model ? ` · ${node.model}` : ""}`} />
        <StatusPill status={pill.status}>{pill.text}</StatusPill>
        <CloseButton label="Close details" onClick={onClose} />
      </CardHead>
      <div className="tv-detail-body">
      <FactGrid items={facts} />
      {node.failure && (
        <ErrorNote>
          {node.statusMessage ?? (node.failure === "origin" ? "Error" : "A step below this one failed")}
          <small className="tv-note-sub">{node.failure === "origin" ? `Level ERROR${propagated ? ` · origin of ${propagated} failing ancestor${propagated > 1 ? "s" : ""}` : ""}` : "Propagated from a step below"}</small>
        </ErrorNote>
      )}
      {node.failure && path.length > 1 && (
        <div className="tv-sec">
          <span className="tv-label">Failure path</span>
          <ol className="tv-path">
            {path.map((step, index) => (
              <li key={step.id} data-origin={step.failure === "origin" ? "" : undefined} style={{ paddingLeft: index * 12 }}>
                {step.id === node.id ? <span>{step.name}</span> : <button type="button" onClick={() => onNavigate(step.id)}>{step.name}</button>}
              </li>
            ))}
          </ol>
        </div>
      )}
      {node.tokens && (
        <div className="tv-sec">
          <span className="tv-label">Tokens · {formatTokens(node.tokens.total)}</span>
          <TokenBreakdown tokens={node.tokens} />
          <TokenLegend tokens={node.tokens} />
        </div>
      )}
      {node.tokens && (
        <div className="tv-cost">
          <span>Cost</span>
          {node.cost === null ? <span className="tv-none">— no price{node.model ? ` for ${node.model}` : ""} in this project</span> : <b>{formatCost(node.cost)}</b>}
        </div>
      )}
      {status === "loading" && (
        <>
          <IoSkeleton label="Input" />
          {node.kind === "generation" && <IoSkeleton label="Output" />}
        </>
      )}
      {status === "error" && (
        <div className="tv-sec">
          <span className="tv-none">Could not load input and output.</span>
          <button type="button" className="tv-link" onClick={retry}>Retry</button>
        </div>
      )}
      {status === "done" && io.input !== undefined && <IoBlock label="Input" text={io.input} />}
      {status === "done" && io.output !== undefined && <IoBlock label="Output" text={io.output} />}
      </div>
    </div>
  );
}

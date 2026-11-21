import type { EffortLevel, ModelCard, ModelSelection } from "../shared/models";
import type { PermissionMode } from "../shared/permission";


export type { PermissionMode };

export type BusyMode = "queue" | "steer";

export type BusyPolicy = "block" | "queue" | "steerable";

export type Attachment = { id: string; name: string };

export type Submission = {
  text: string;
  attachments: readonly Attachment[];
  model?: ModelSelection;
  permission?: PermissionMode;
  whenBusy: BusyMode | null;
};

export type ModelControl = {
  catalog: readonly ModelCard[];
  value: ModelSelection;
  onChange: (next: ModelSelection) => void;
};

export type PermissionControl = {
  value: PermissionMode;
  onChange: (next: PermissionMode) => void;
  modes?: readonly PermissionMode[];
};

export type AttachControl = { accept?: string };


export type QueuedMessage = { id: string; text: string; mode: BusyMode };
export type ChangedFile = { path: string; add: number; del: number };

export type UsageStrip = { kind: "usage"; percent: number; onViewUsage?: () => void };
export type QueueStrip = {
  kind: "queue";
  messages: readonly QueuedMessage[];
  onSteer?: (id: string) => void;
  onRemove: (id: string) => void;
};
export type GoalStrip = { kind: "goal"; text: string; status: "active" | "paused" | "done"; onClear?: () => void };
export type ChangesStrip = { kind: "changes"; files: readonly ChangedFile[]; onOpenFile?: (path: string) => void };
export type Strip = UsageStrip | QueueStrip | GoalStrip | ChangesStrip;
export type StripKind = Strip["kind"];


export type HostKind = "local" | "cloud" | "remote";
export type Host = { id: string; name: string; kind: HostKind };
export type HostStatus = "ready" | "starting" | "running" | "offline";

export type WorkspaceInfo = { path: string; branch?: string; onPick?: () => void };
export type HostControl = { hosts: readonly Host[]; value: string; status: HostStatus; onChange: (id: string) => void };
export type TrayControl = { workspace?: WorkspaceInfo; host?: HostControl };

export type { EffortLevel, ModelCard, ModelSelection };

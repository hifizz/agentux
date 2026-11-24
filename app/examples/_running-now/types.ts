export type NowState = "running" | "paused" | "needs-you" | "done";

export type NowTask = {
  id: string;
  title: string;
  step: string;
  done?: number;
  total?: number;
  state: NowState;
};

export type NowLabels = {
  title: string;
  running: string;
  needsYou: string;
  needsYouOne: string;
  needsYouBadge: string;
  paused: string;
  pausedCount: string;
  done: string;
  pause: string;
  resume: string;
  open: string;
  openAll: string;
  empty: string;
  idle: string;
};

export const NOW_LABELS: NowLabels = {
  title: "Background tasks",
  running: "running",
  needsYou: "need you",
  needsYouOne: "needs you",
  needsYouBadge: "Needs you",
  paused: "Paused",
  pausedCount: "paused",
  done: "Done",
  pause: "Pause",
  resume: "Resume",
  open: "Open",
  openAll: "Open Tasks",
  empty: "Nothing in the background yet",
  idle: "No tasks running",
};

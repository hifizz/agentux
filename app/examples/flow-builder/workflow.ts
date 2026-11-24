type IconName = "form" | "pixels" | "split" | "slack" | "mail" | "database" | "clock" | "globe";
export type Template = { title: string; detail: string; note: string; icon: IconName; kind: "trigger" | "agent" | "branch" | "action" | "wait" };
export type Step = Template & { id: string; paths?: Path[] };
export type Path = { id: string; label: string; steps: Step[] };
export type Slot = { path: string; index: number };

export const templates: Template[] = [
  { kind: "agent", icon: "pixels", title: "Ask an agent", detail: "Research and summarize", note: "Prepares a short account summary" },
  { kind: "action", icon: "mail", title: "Send email", detail: "Gmail", note: "Sends a personal email" },
  { kind: "action", icon: "slack", title: "Post message", detail: "Slack", note: "Shares the update in a channel" },
  { kind: "action", icon: "database", title: "Update record", detail: "Database", note: "Writes the latest account details" },
  { kind: "action", icon: "globe", title: "HTTP request", detail: "Any API", note: "Calls an external service" },
  { kind: "branch", icon: "split", title: "If / else", detail: "Split into two paths", note: "Continues on Yes or No" },
  { kind: "wait", icon: "clock", title: "Wait", detail: "1 hour", note: "Pauses before the next step" },
];

export const initial: Path = { id: "root", label: "", steps: [
  { id: "signup", kind: "trigger", icon: "form", title: "Workspace signup", detail: "Registration form", note: "A teammate creates a new workspace" },
  { ...templates[0], id: "research", title: "Research the account", detail: "Claude · web search", note: "Finds the company size and focus" },
  { ...templates[5], id: "size", title: "Account size", detail: "team size > 200", note: "Routes to Enterprise or Self-serve", paths: [
    { id: "enterprise", label: "Enterprise", steps: [
      { ...templates[2], id: "notify", title: "Notify sales", detail: "Slack · #accounts", note: "Shares the account summary with sales" },
      { ...templates[3], id: "deal", title: "Open a deal", detail: "CRM · New business", note: "Saves the brief in the pipeline" },
    ] },
    { id: "self", label: "Self-serve", steps: [
      { ...templates[1], id: "welcome", title: "Send welcome email", detail: "Gmail · from Sam", note: "Welcomes the team with a personal note" },
      { ...templates[6], id: "wait", title: "Wait", detail: "2 days", note: "Leaves time to explore the workspace" },
      { ...templates[1], id: "tips", title: "Send setup tips", detail: "Gmail · getting started", note: "Suggests three things to try next" },
    ] },
  ] },
] };

export function flatten(path: Path): Step[] {
  return path.steps.flatMap(step => [step, ...(step.paths?.flatMap(flatten) ?? [])]);
}

export function editPath(path: Path, id: string, edit: (steps: Step[]) => Step[]): Path {
  return path.id === id ? { ...path, steps: edit(path.steps) } : { ...path, steps: path.steps.map(step => step.paths ? { ...step, paths: step.paths.map(child => editPath(child, id, edit)) } : step) };
}

export function insert(root: Path, slot: Slot, template: Template, id: string) {
  return editPath(root, slot.path, steps => {
    const rest = steps.slice(slot.index), step = { ...template, id };
    return [...steps.slice(0, slot.index), ...(template.kind === "branch" ? [{ ...step, paths: [{ id: `${id}-yes`, label: "Yes", steps: rest }, { id: `${id}-no`, label: "No", steps: [] }] }] : [step, ...rest])];
  });
}

export function itinerary(path: Path): { step: Step; skip: string[]; duration: number }[] {
  return path.steps.flatMap(step => {
    const chosen = step.paths?.find(p => p.id === "self") ?? step.paths?.[0];
    const skip = step.paths?.filter(p => p !== chosen).flatMap(p => [p.id, ...flatten(p).map(child => child.id)]) ?? [];
    return [{ step, skip, duration: step.kind === "agent" ? 1700 : step.kind === "wait" ? 1000 : 650 }, ...(chosen ? itinerary(chosen) : [])];
  });
}

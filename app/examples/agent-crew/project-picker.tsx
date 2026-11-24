import { Select } from "@base-ui/react/select";
import { Check, ChevronDown, Folder } from "lucide-react";
import { projects } from "./projects";
import type { Agent } from "./model";

export function ProjectPicker({ index, agents, onChange }: { index: number; agents: Agent[]; onChange: (index: number) => void }) {
  return <Select.Root value={index} onValueChange={n => { if (n !== null && n !== index) onChange(n); }}>
    <Select.Trigger className="cc-picker" aria-label={`Project: ${projects[index].name}`}><Folder size={14} /><b>{projects[index].name}</b><ChevronDown size={12} /></Select.Trigger>
    <Select.Portal><Select.Positioner className="cc-menu-position cc-skin" alignItemWithTrigger={false} side="bottom" align="start" sideOffset={6}>
      <Select.Popup className="cc-menu"><Select.List>{projects.map((project,i) => {
        const all = i === index ? agents : project.agents;
        const waiting = all.filter(a => a.status === "waiting").length;
        const working = all.filter(a => a.status === "active").length;
        return <Select.Item key={project.name} value={i} className="cc-option"><Folder size={14} /><Select.ItemText className="cc-option-name" title={project.name}>{project.name}</Select.ItemText><small data-wait={!!waiting}>{waiting ? `${waiting} needs you` : working ? `${working} working` : "Idle"}</small><span className="cc-tick">{i === index && <Check size={12} />}</span></Select.Item>;
      })}</Select.List></Select.Popup>
    </Select.Positioner></Select.Portal>
  </Select.Root>;
}

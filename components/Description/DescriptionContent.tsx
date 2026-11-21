import type { Example } from "@/lib/components";
import { cn } from "@/lib/utils";
import PropsTable from "./PropsTable";

function SectionLabel({ as: Tag = "p", children }: { as?: "p" | "h2"; children: React.ReactNode }) {
  return <Tag className="text-xs font-medium uppercase tracking-normal text-foreground/40">{children}</Tag>;
}

export default function DescriptionContent({ item, className }: { item: Example; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-12 text-left", className)}>
      <div className="flex flex-col gap-4">
        <SectionLabel>{item.category}</SectionLabel>
        <p className="font-sans text-2xl font-semibold leading-relaxed text-foreground/90">{item.description}</p>
      </div>

      {item.interaction && (
        <div className="flex flex-col gap-3">
          <SectionLabel as="h2">Interaction</SectionLabel>
          <p className="text-sm leading-relaxed text-foreground/70">{item.interaction}</p>
        </div>
      )}

      {item.parts && item.parts.length > 0 && (
        <div className="flex flex-col gap-3">
          <SectionLabel as="h2">Parts</SectionLabel>
          <ul className="flex flex-col divide-y divide-border/40">
            {item.parts.map((part) => (
              <li key={part.name} className="flex flex-col gap-1 py-3">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                  <span className="text-sm font-medium text-foreground/90">{part.name}</span>
                  <code className="font-mono text-[11px] text-foreground/45">{part.file}</code>
                </div>
                <p className="text-sm leading-relaxed text-foreground/65">{part.description}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {item.props && item.props.length > 0 && (
        <div className="flex flex-col gap-3">
          <SectionLabel as="h2">Props</SectionLabel>
          <p className="-mt-1 text-sm leading-relaxed text-foreground/70">Options for the assembled component.</p>
          <PropsTable props={item.props} />
        </div>
      )}

      {item.source && (
        <div className="flex flex-col gap-3">
          <SectionLabel as="h2">Source</SectionLabel>
          <p className="text-sm leading-relaxed text-foreground/70">{item.source}</p>
        </div>
      )}
    </div>
  );
}

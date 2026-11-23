import { Fragment } from "react";
import type { ExampleProp } from "@/lib/components";

// unions read better one option per line, but object and generic types keep their inner |
function typeLines(prop: ExampleProp) {
  if (/[{<(]/.test(prop.type)) return [prop.type];
  return prop.type.split(/\s\|\s/);
}

export default function PropsTable({ props }: { props: ExampleProp[] }) {
  return (
    <div className="grid grid-cols-[fit-content(32%)_minmax(0,0.8fr)_minmax(0,1.3fr)]">
      {["Prop", "Type", "Description"].map((label) => (
        <div key={label} className="border-b border-border/50 px-1 pb-2.5 pr-2 text-[10px] font-medium uppercase tracking-wider text-foreground/45">
          {label}
        </div>
      ))}
      {props.map((prop) => (
        <Fragment key={prop.name}>
          <div className="border-b border-border/40 py-4 pl-1 pr-2">
            <code className="inline-block max-w-full break-words rounded-md bg-secondary px-2 py-1 font-mono text-xs text-foreground/75">
              {prop.name}
              {prop.required && <span className="text-ring">*</span>}
            </code>
          </div>
          <div className="flex flex-col gap-1 border-b border-border/40 py-4 pt-5 pr-2">
            {typeLines(prop).map((value) => (
              <code key={value} className="break-all font-mono text-xs leading-relaxed text-foreground/55">
                {value}
              </code>
            ))}
          </div>
          <div className="border-b border-border/40 px-1 py-4">
            <p className="pt-0.5 text-sm leading-relaxed text-foreground/90">{prop.description}</p>
          </div>
        </Fragment>
      ))}
    </div>
  );
}

import { Popover } from "@base-ui/react/popover";
import type { ReactNode } from "react";
import type { Facts } from "./run";

export function Identity({ name, subtitle }: { name: string; subtitle: string }) {
  return <span className="wb-identity"><b title={name}>{name}</b><small title={subtitle}>{subtitle}</small></span>;
}

export function Details({ name, subtitle, icon, facts, tag, children, row, reading, open, onOpenChange }: {
  name: string; subtitle: string; icon: ReactNode; facts: Facts; tag?: ReactNode; children?: ReactNode;
  row?: ReactNode; reading?: boolean; open: boolean; onOpenChange: (open: boolean) => void;
}) {
  const label = `${name} details`;
  return <Popover.Root open={open} onOpenChange={onOpenChange}>
    <Popover.Trigger type="button" className={row ? "wb-file" : "wb-hit"} aria-label={label} data-reading={reading || undefined}>{row}</Popover.Trigger>
    <Popover.Portal>
      <Popover.Positioner className="wb-position wb-skin" side="bottom" align="center" sideOffset={row ? 6 : 8} data-file={row ? "" : undefined}>
        <Popover.Popup className="wb-details" aria-label={label} initialFocus={false}>
          <div className="wb-details-head"><span className="wb-tile">{icon}</span><Identity name={name} subtitle={subtitle} />{tag}</div>
          <dl className="wb-facts">{facts.map(([key, value]) => <div key={key}><dt>{key}</dt><dd title={value}>{value}</dd></div>)}</dl>
          {children}
        </Popover.Popup>
      </Popover.Positioner>
    </Popover.Portal>
  </Popover.Root>;
}

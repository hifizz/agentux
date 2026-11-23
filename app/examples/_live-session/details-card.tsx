import { CodeXml, FileText, Folder, Frame, Search } from "lucide-react";
import { CompanyLogo, hasLogo } from "./company-logo";
import type { MessageDetails } from "./types";

const ICONS = { search: Search, file: FileText, folder: Folder, frame: Frame, tool: CodeXml };

function Tile({ icon = "tool" }: { icon?: string }) {
  if (hasLogo(icon)) return <span className="ls-tile"><CompanyLogo name={icon} /></span>;
  const Icon = ICONS[icon as keyof typeof ICONS] ?? CodeXml;
  return <span className="ls-tile"><Icon size={12} aria-hidden="true" /></span>;
}

export function DetailsCard({ details, open }: { details: MessageDetails; open: boolean }) {
  return (
    <div className="ls-more" data-open={open ? "" : undefined} inert={!open}>
      <div className="ls-more__card">
        <dl className="ls-facts">
          {details.facts.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
        {details.items && (
          <ul className="ls-items">
            {details.items.map((item) => (
              <li key={item.label} className="ls-item">
                <Tile icon={item.icon} />
                <span className="ls-item__label" title={item.label}>{item.label}</span>
                <span className="ls-item__detail" title={item.detail}>{item.detail}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

import { Fragment } from "react";
import { CompanyLogo, hasLogo } from "./company-logo";

const TOKEN = /\{(\w+)\|([^}]+)\}/g;

export function RichText({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(TOKEN)) {
    const [raw, logo, label] = match;
    parts.push(text.slice(last, match.index));
    parts.push(
      <span key={match.index} className="ls-co">
        {hasLogo(logo) && <CompanyLogo name={logo} />}
        {label}
      </span>,
    );
    last = match.index + raw.length;
  }
  parts.push(text.slice(last));
  return parts.map((part, i) => <Fragment key={i}>{part}</Fragment>);
}

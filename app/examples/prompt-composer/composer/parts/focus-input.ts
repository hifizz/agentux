export function focusInput(e: React.MouseEvent<HTMLElement>) {
  if ((e.target as HTMLElement).closest("button, a, input, textarea, [role=menuitem], [role=option]")) return;
  e.preventDefault();
  e.currentTarget.querySelector("textarea")?.focus();
}

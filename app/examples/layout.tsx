import SidebarShell from "@/components/Sidebar/SidebarShell";

export default function ExamplesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="docs-shell h-dvh overflow-hidden bg-background p-2">
      <SidebarShell>{children}</SidebarShell>
    </div>
  );
}

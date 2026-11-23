import SidebarShell from "@/components/Sidebar/SidebarShell";

export default function ExamplesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-dvh overflow-hidden p-2 bg-background">
      <SidebarShell>{children}</SidebarShell>
    </div>
  );
}

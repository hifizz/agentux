import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import GooeyNavbar from "@/components/GooeyNavbar";
import Footer from "@/components/Footer";
import { site } from "@/lib/site";
import "@fontsource-variable/dm-sans";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: site.title, template: `%s · ${site.name}` },
  description: site.description,
  applicationName: site.name,
  icons: { icon: site.logo },
  openGraph: { title: site.title, description: site.description, siteName: site.name, type: "website" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <ThemeProvider attribute="class" defaultTheme="dark" storageKey="turnframe-theme" enableSystem disableTransitionOnChange>
          <a className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-60 focus:rounded-lg focus:bg-card focus:px-4 focus:py-2" href="#main">Skip to content</a>
          <GooeyNavbar />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}

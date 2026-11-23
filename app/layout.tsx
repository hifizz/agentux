import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import localFont from "next/font/local";
import { CommandMenuLoader } from "@/components/CommandMenuLoader";
import { site } from "@/lib/site";
import "@fontsource-variable/dm-sans";
import "./globals.css";

const inter = localFont({
  src: "../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2",
  weight: "100 900",
  variable: "--font-inter",
});
const mono = localFont({
  src: "../node_modules/@fontsource-variable/geist-mono/files/geist-mono-latin-wght-normal.woff2",
  weight: "100 900",
  variable: "--font-geist-mono",
  preload: false,
});
const runde = localFont({
  variable: "--font-open-runde",
  src: [
    { path: "../public/fonts/OpenRunde-Regular.woff2", weight: "400" },
    { path: "../public/fonts/OpenRunde-Medium.woff2", weight: "500" },
    { path: "../public/fonts/OpenRunde-Semibold.woff2", weight: "600" },
    { path: "../public/fonts/OpenRunde-Bold.woff2", weight: "700" },
  ],
});

export const metadata: Metadata = {
  title: { default: site.title, template: `%s · ${site.name}` },
  description: site.description,
  applicationName: site.name,
  icons: { icon: site.logo },
  openGraph: {
    title: site.title,
    description: site.description,
    siteName: site.name,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${mono.variable} ${runde.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          storageKey="reni-theme"
          enableSystem
          disableTransitionOnChange
        >
          <a
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-60 focus:rounded-lg focus:bg-card focus:px-4 focus:py-2"
            href="#main"
          >
            Skip to content
          </a>
          {children}
          <CommandMenuLoader />
        </ThemeProvider>
      </body>
    </html>
  );
}

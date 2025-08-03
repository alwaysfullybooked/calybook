import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Viewport } from "next";

import { cn } from "@/lib/utils";

import "@/styles/globals.css";

import Consent from "@/components/client/consent";
import ExternalBrowserBanner from "@/components/client/external-browser";
import PlausibleProvider from "next-plausible";
import { Suspense } from "react";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("bg-background text-foreground min-h-screen font-sans antialiased", GeistSans.variable, GeistMono.variable)}>
        <PlausibleProvider domain="calybook.com">
          <Suspense>
            <ExternalBrowserBanner />
          </Suspense>
          <Consent />
          <div>{children}</div>
        </PlausibleProvider>
      </body>
    </html>
  );
}

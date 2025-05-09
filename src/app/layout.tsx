import type { Viewport, Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import Header from "../components/header";
import Footer from "../components/footer";
import { cn } from "@/lib/utils";

import "@/styles/globals.css";
import ExternalBrowserRedirect from "@/components/client/external-browser";
import { Suspense } from "react";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NODE_ENV === "production" ? "https://not.alwaysfullybooked.com" : "http://localhost:3000"),
  title: "JustBookIt",
  description: "Book all your activities.",
  openGraph: {
    title: "JustBookIt",
    description: "Book all your activities.",
    url: "https://not.alwaysfullybooked.com",
    siteName: "JustBookIt",
  },
  twitter: {
    card: "summary_large_image",
    site: "@digitalcentral",
    creator: "@digitalcentral",
  },
};

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
        <Suspense>
          <ExternalBrowserRedirect />
        </Suspense>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}

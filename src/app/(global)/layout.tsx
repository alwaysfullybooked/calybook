import type { Metadata } from "next";
import Header from "@/components/header";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NODE_ENV === "production" ? "https://www.calybook.com" : "http://localhost:3000"),
  title: "CalyBook",
  description: "Book all your activities.",
  openGraph: {
    title: "CalyBook",
    description: "Book all your activities.",
    url: "https://www.calybook.com",
    siteName: "CalyBook",
  },
  twitter: {
    card: "summary_large_image",
    site: "@digitalcentral",
    creator: "@digitalcentral",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Header country="" link="/" />
      <main className="container mx-auto">{children}</main>
    </>
  );
}

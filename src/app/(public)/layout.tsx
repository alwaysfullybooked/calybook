import type { Metadata } from "next";
import Footer from "@/components/footer";

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

export default function PublicLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}

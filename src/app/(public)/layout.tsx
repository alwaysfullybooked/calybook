import type { Metadata } from "next";
import Footer from "@/components/footer";

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

export default function PublicLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}

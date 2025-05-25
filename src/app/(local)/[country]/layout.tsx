import type { Metadata } from "next";
import Footer from "@/components/footer";
import { locations } from "@/data/locations";
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

export default async function CountryLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ country: string }>;
}>) {
  const { country: code } = await params;

  const location = locations[code];

  return (
    <>
      <Header country={location?.name ?? ""} link={`/${code}/en`} />
      {children}
      <Footer country={location?.name ?? ""} />
    </>
  );
}

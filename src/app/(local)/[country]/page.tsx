import { locations } from "@/lib/locations";
import { redirect } from "next/navigation";

export const generateStaticParams = async () => {
  return Object.keys(locations).map((country) => ({ country }));
};

export default async function CountryPage({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country } = await params;
  // Redirect to English language by default
  redirect(`/${country}/en`);
}

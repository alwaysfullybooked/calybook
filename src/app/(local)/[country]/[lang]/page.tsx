import { alwaysfullybooked } from "@/lib/alwaysfullybooked";
import { getTranslations } from "@/lib/translations";

import HomeSearch from "@/components/client/home-search";
import { Button } from "@/components/ui/button";
import { matchVenues } from "@/data/venues";
import type { MatchVenues } from "@/lib/alwaysfullybooked";
import { locations } from "@/lib/locations";
import Link from "next/link";

export async function generateStaticParams() {
  return [
    { country: "th", lang: "en" },
    { country: "hk", lang: "en" },
    { country: "sc", lang: "en" },
    { country: "fr", lang: "en" },
    { country: "be", lang: "en" },
  ];
}

export async function generateMetadata({ params }: { params: Promise<{ country: string; lang: string }> }) {
  const { country, lang } = await params;

  const countryLabel = locations[country as keyof typeof locations]?.name ?? "";

  return {
    title: `${countryLabel} - ${lang.toUpperCase()} - CalyBook`,
    alternates: {
      canonical: `https://www.calybook.com/${country}/${lang}`,
    },
  };
}

export default async function CountryLangPage({ params, searchParams }: { params: Promise<{ country: string; lang: string }>; searchParams: Promise<{ city: string }> }) {
  const { country, lang } = await params;
  const { city } = await searchParams;

  const countryLabel = locations[country as keyof typeof locations]?.name ?? "";
  const cityLabel = locations[country as keyof typeof locations]?.cities.find((c) => c.value === city)?.label ?? "";

  const venues = await alwaysfullybooked.venues.publicSearch({ country: countryLabel, city: cityLabel });

  const mergedVenues = venues.map((venue) => {
    const info = matchVenues.find((v) => v.id === venue.id);

    return {
      ...venue,
      courts: info?.courts?.tennis?.count ?? null,
      price: info?.courts?.tennis?.price ?? null,
      amenities: info?.amenities ?? null,
    };
  }) as unknown as MatchVenues[];

  const t = await getTranslations(lang);

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">{t?.get("welcome")}</h1>
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">{countryLabel}</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t?.get("homeSearch_description")}</p>
      </div>

      {country === "hk" && (
        <div className="flex flex-col justify-center my-8 text-center max-w-md mx-auto border p-4 rounded-lg">
          <p className="text-sm sm:text-base mb-4">Try our Booking AI Assistant to book your court in seconds.</p>
          <Button variant="default" className="my-4" asChild>
            <Link href={`/${country}/${lang}/chat`}>Chat to book now</Link>
          </Button>
        </div>
      )}

      <div className="my-8">
        <HomeSearch country={country as keyof typeof locations} venues={mergedVenues} lang={lang} />
      </div>
    </div>
  );
}

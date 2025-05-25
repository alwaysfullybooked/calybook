import { alwaysbookbooked } from "@/lib/alwaysbookbooked";
import { getTranslations } from "@/lib/translations";

import HomeSearch from "@/components/client/home-search";
import { matchVenues } from "@/data/venues";
import { locations } from "@/data/locations";

export async function generateStaticParams() {
  return [
    { country: "th", lang: "en" },
    { country: "hk", lang: "en" },
    { country: "sc", lang: "en" },
    { country: "fr", lang: "en" },
    { country: "be", lang: "en" },
  ];
}

export default async function CountryLangPage({ params, searchParams }: { params: Promise<{ country: string; lang: string }>; searchParams: Promise<{ city: string }> }) {
  const { country, lang } = await params;
  const { city } = await searchParams;

  const countryLabel = locations[country as keyof typeof locations]?.name ?? "";
  const cityLabel = locations[country as keyof typeof locations]?.cities.find((c) => c.value === city)?.label ?? "";

  const venues = await alwaysbookbooked.venues.publicSearch(countryLabel, cityLabel);

  const mergedVenues = venues.map((venue) => {
    const info = matchVenues.find((v) => v.id === venue.id);

    return {
      ...venue,
      image: info?.image ?? null,
      courts: info?.courts?.tennis?.count ?? null,
      price: info?.courts?.tennis?.price ?? null,
      amenities: info?.amenities ?? null,
    };
  });

  const t = await getTranslations(lang);

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">{t?.get("welcome")}</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t?.get("homeSearch_description")}</p>
      </div>

      <div className="my-8">
        <HomeSearch country={country as keyof typeof locations} venues={mergedVenues} lang={lang} />
      </div>
    </div>
  );
}

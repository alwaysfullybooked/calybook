import { alwaysbookbooked } from "@/lib/alwaysbookbooked";
import { getTranslations } from "@/lib/translations";

import { matchVenues } from "@/data/venues";
import { locations } from "@/lib/locations";
import HomeResults from "@/components/server/home-results";

export async function generateStaticParams() {
  return [
    { country: "th", lang: "en", city: "bangkok" },
    { country: "th", lang: "en", city: "chiang-mai" },
    { country: "th", lang: "en", city: "phuket" },
    { country: "hk", lang: "en", city: "hong-kong" },
    { country: "hk", lang: "en", city: "kowloon" },
    { country: "hk", lang: "en", city: "new-territories" },
    { country: "sc", lang: "en", city: "mahe" },
    { country: "sc", lang: "en", city: "praslin" },
    { country: "id", lang: "en", city: "jakarta" },
    { country: "id", lang: "en", city: "bali" },
  ];
}

export async function generateMetadata({ params }: { params: Promise<{ country: string; lang: string; city: string }> }) {
  const { country, lang, city } = await params;

  const countryLabel = locations[country as keyof typeof locations]?.name ?? "";
  const cityLabel = locations[country as keyof typeof locations]?.cities.find((c) => c.slug === city)?.label ?? "";

  return {
    title: `${countryLabel} - ${cityLabel} - ${lang.toUpperCase()} - Calybook`,
    alternates: {
      canonical: `https://www.calybook.com/${country}/${lang}/${city}`,
    },
  };
}

export default async function CountryLangPage({ params }: { params: Promise<{ country: string; lang: string; city: string }> }) {
  const { country, lang, city } = await params;

  const countryLabel = locations[country as keyof typeof locations]?.name ?? "";
  const cityLabel = locations[country as keyof typeof locations]?.cities.find((c) => c.slug === city)?.label ?? "";

  const venues = await alwaysbookbooked.venues.publicSearch(countryLabel, cityLabel);

  const mergedVenues = venues.map((venue) => {
    const info = matchVenues.find((v) => v.id === venue.id);

    return {
      ...venue,
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
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">{cityLabel}</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t?.get("homeSearch_description")}</p>
      </div>

      <div className="my-8">
        <HomeResults country={country as keyof typeof locations} lang={lang} city={city} venues={mergedVenues} />
      </div>
    </div>
  );
}

import { alwaysfullybooked } from "@/lib/alwaysfullybooked";
import { getTranslations } from "@/lib/translations";

import { HomeResults } from "@/components/server/home-results";
import { Button } from "@/components/ui/button";
import { matchVenues } from "@/data/venues";
import type { MatchVenues } from "@/lib/alwaysfullybooked";
import { locations } from "@/lib/locations";
import Link from "next/link";

export async function generateStaticParams() {
	return [
		{ country: "th", lang: "en", city: "bangkok" },
		{ country: "th", lang: "en", city: "chiang-mai" },
		{ country: "th", lang: "en", city: "phuket" },
		{ country: "hk", lang: "en", city: "hong-kong-island" },
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
		title: `${countryLabel} - ${cityLabel} - ${lang.toUpperCase()} - CalyBook`,
		alternates: {
			canonical: `https://www.calybook.com/${country}/${lang}/${city}`,
		},
	};
}

export default async function CountryLangPage({ params }: { params: Promise<{ country: string; lang: string; city: string }> }) {
	const { country, lang, city } = await params;

	const countryLabel = locations[country as keyof typeof locations]?.name ?? "";
	const cityLabel = locations[country as keyof typeof locations]?.cities.find((c) => c.slug === city)?.label ?? "";

	const venues = await alwaysfullybooked.venues.publicSearch({ country: countryLabel, city: cityLabel });

	const mergedVenues = venues.map((venue) => {
		const info = matchVenues.find((v) => v.id === venue.id);

		return {
			...venue,
			courts: info?.courts?.tennis?.count ?? null,
			price: info?.courts?.tennis?.price ?? null,
			amenities: info?.amenities ?? null,
		};
	}) as MatchVenues[];

	const t = await getTranslations(lang);

	return (
		<div className="px-4 py-8 sm:px-6 lg:px-8">
			<div className="text-center space-y-4 mb-12">
				<h1 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">{t?.get("welcome")}</h1>
				<h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">{cityLabel}</h2>
				<p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t?.get("homeSearch_description")}</p>
			</div>

			{country === "hk" && (
				<div className="flex flex-col justify-center my-8 text-center max-w-md mx-auto border p-4 rounded-lg">
					<p className="text-sm sm:text-base mb-4">Ever tried to book? It's a pain, right? Try our Booking AI Assistant to book your court in seconds.</p>
					<Button variant="default" className="my-4" asChild>
						<Link href={`/${country}/${lang}/chat`}>Chat to book now</Link>
					</Button>
				</div>
			)}

			<div className="my-8">
				<HomeResults country={country as keyof typeof locations} lang={lang} city={city} venues={mergedVenues} />
			</div>
		</div>
	);
}

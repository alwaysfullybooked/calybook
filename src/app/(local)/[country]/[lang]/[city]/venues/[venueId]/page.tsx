import { ExternalLink, MapPin, Phone, Trophy } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import BookingSchedule from "@/components/client/booking-schedule";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { matchVenues } from "@/data/venues";
import { alwaysfullybooked } from "@/lib/alwaysfullybooked";
import { locations } from "@/lib/locations";
import { openscor } from "@/lib/openscor";
import { auth } from "@/server/auth";

export async function generateStaticParams() {
	const countries = ["th"];

	const venues = await Promise.all(
		countries.map(async (country) => {
			const countryLabel = locations[country as keyof typeof locations]?.name ?? "";
			const cities = locations[country as keyof typeof locations]?.cities ?? [];

			const venues = await Promise.all(
				cities.map(async (city) => {
					const venues = await alwaysfullybooked.venues.publicSearch({ country: countryLabel, city: city.label });

					return venues.map((v) => ({
						country,
						lang: "en",
						city: city.slug,
						venueId: v.id,
					}));
				}),
			);

			return venues.flat();
		}),
	);

	return venues.flat();
}

export async function generateMetadata({ params }: { params: Promise<{ country: string; lang: string; city: string; venueId: string }> }) {
	const { country, lang, city, venueId } = await params;

	const countryLabel = locations[country as keyof typeof locations]?.name ?? "";
	const cityLabel = locations[country as keyof typeof locations]?.cities.find((c) => c.slug === city)?.label ?? "";
	const venue = await alwaysfullybooked.venues.publicFind({ venueId });

	if (!venue) {
		return {
			title: `${countryLabel} - ${cityLabel} - Venue not found - ${lang.toUpperCase()} - CalyBook`,
		};
	}

	return {
		title: `${countryLabel} - ${cityLabel} - ${venue.name} - ${lang.toUpperCase()} - CalyBook`,
		alternates: {
			canonical: `https://www.calybook.com/${country}/${lang}/${city}/venues/${venueId}`,
		},
	};
}

export default async function VenuePage({ params }: { params: Promise<{ country: string; lang: string; city: string; venueId: string }> }) {
	const { country, lang, city, venueId } = await params;

	const session = await auth();

	if (!session?.user?.email) {
		redirect(`/login?callbackUrl=/${country}/${lang}/${city}/venues/${venueId}`);
	}

	const customerName = session.user.name ?? session.user.email;
	const customerEmailId = session.user.email;

	const contactWhatsAppId = session.user.contactWhatsAppId;
	const contactLineId = session.user.contactLineId;

	const [venue, availableSchedule] = await Promise.all([alwaysfullybooked.venues.publicFind({ venueId }), alwaysfullybooked.venues.publicAvailability({ venueId })]);

	if (!venue) {
		return <div>Venue not found</div>;
	}

	const competitionIds = venue.competitions ?? [];
	const competitions = await openscor.competitions.search({ competitionIds });
	const filteredCompetitions = competitions.filter((c) => competitionIds.includes(c.id));

	const availableScheduleFiltered = availableSchedule.filter((f) => f.paymentType !== "manual_prepaid" || (f.paymentType === "manual_prepaid" && f.paymentImage));

	const info = matchVenues.find((v) => v.id === venue.id);

	const mergedVenue = {
		...venue,
		courts: info?.courts ?? null,
		amenities: info?.amenities ?? null,
	};

	const services = venue?.services;

	return (
		<main className="container mx-auto px-4 py-4 sm:py-6 md:py-8">
			<div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
				<div className="md:col-span-3">
					{/* Venue Info Section */}
					<Card className="mb-6 md:mb-8">
						<div className="flex flex-col md:flex-row">
							{mergedVenue.image && (
								<div className="w-full md:w-1/3 h-48">
									<picture>
										<img src={mergedVenue.image} alt={mergedVenue.name} className="w-full h-full object-cover rounded-t-xl md:rounded-l-xl md:rounded-tr-none" />
									</picture>
								</div>
							)}
							<div className="flex-1">
								<CardHeader className="space-y-2">
									<div className="flex justify-between p-2 gap-2">
										<div>
											<CardTitle className="text-2xl sm:text-3xl md:text-4xl">
												<h1>{mergedVenue.name}</h1>
											</CardTitle>
											<CardDescription className="text-base sm:text-lg">
												{mergedVenue.city}, {mergedVenue.country}
											</CardDescription>
										</div>
									</div>
								</CardHeader>
								<CardContent>
									<div className="space-y-3 mt-5">
										<div className="flex items-center gap-2">
											<Link href={`https://maps.google.com/?q=${venue.plusCode}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
												<MapPin className="w-4 h-4" />
												{venue.address}
												<ExternalLink className="w-4 h-4" />
											</Link>
										</div>
										<div className="flex items-center gap-2">
											<Phone className="h-5 w-5 text-gray-500" />
											<a href={`tel:${mergedVenue.phone}`} className="text-sm sm:text-base hover:underline">
												{mergedVenue.phone}
											</a>
										</div>
									</div>
								</CardContent>
							</div>
						</div>
					</Card>

					{/* Competitions Section */}
					<section className="mb-8">
						<h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
							<Trophy className="h-5 w-5 text-yellow-500" />
							Competitions
						</h2>
						<div className="flex flex-wrap gap-2">
							{filteredCompetitions.map((m) => (
								<Link key={m.id} href={`/${country}/${lang}/${city}/venues/${venueId}/competitions/${m.id}`} className="flex items-center gap-2 bg-primary text-white p-2 rounded-md">
									<Trophy className="h-4 w-4" />
									<span className="capitalize">{m.name}</span>
								</Link>
							))}
							{competitions.length === 0 && <span className="text-muted-foreground">No competitions available for this venue.</span>}
						</div>
					</section>

					{/* Booking Section */}
					<section className="mb-8">
						<Tabs defaultValue="booking" className="w-full">
							<TabsList className="w-full justify-start overflow-x-auto">
								<TabsTrigger value="booking" className="text-sm sm:text-base">
									Booking
								</TabsTrigger>
								<TabsTrigger value="reviews" className="text-sm sm:text-base">
									Reviews (Coming soon)
								</TabsTrigger>
							</TabsList>

							<TabsContent value="booking">
								<div className="mt-4">
									<BookingSchedule
										country={country}
										lang={lang}
										city={city}
										customerName={customerName}
										customerEmailId={customerEmailId}
										contactWhatsAppId={contactWhatsAppId}
										contactLineId={contactLineId}
										venueId={venueId}
										venueName={venue.name}
										services={services}
										availableSchedule={availableScheduleFiltered}
									/>
								</div>
							</TabsContent>

							<TabsContent value="reviews">
								<div className="mt-4" />
							</TabsContent>
						</Tabs>
					</section>
				</div>
			</div>
		</main>
	);
}

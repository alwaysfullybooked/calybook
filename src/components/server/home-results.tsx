import { ExternalLink, MapPin } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import type { MatchVenues } from "@/lib/alwaysfullybooked";
import { Button } from "../ui/button";

export function HomeResults({ country, lang, city, venues }: { country: string; lang: string; city: string; venues: MatchVenues[] }) {
	return (
		<>
			{venues.length > 0 ? (
				<div className="my-8">
					<h2 className="text-2xl font-bold tracking-tight mb-6">Featured Venues</h2>
					<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
						{venues.map((venue) => {
							return (
								<Card key={venue.id} className="h-full flex flex-col hover:shadow-lg transition-shadow duration-200 p-0 pb-3">
									{venue.image && (
										<Link href={`/${country}/${lang}/${city}/venues/${venue.id}`}>
											<picture>
												<img src={venue.image} alt={venue.name} className="w-full h-48 object-cover rounded-t-xl" />
											</picture>
										</Link>
									)}

									<CardHeader className="flex-1">
										<CardTitle className="text-lg">
											<Link href={`/${country}/${lang}/${city}/venues/${venue.id}`}>{venue.name}</Link>
										</CardTitle>

										{venue.plusCode && (
											<CardDescription className="text-sm">
												<Link href={`https://maps.google.com/?q=${venue.plusCode}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
													<MapPin className="w-4 h-4" />
													{venue.address}
													<ExternalLink className="w-4 h-4" />
												</Link>
											</CardDescription>
										)}
									</CardHeader>
									<CardContent className="flex-1 flex flex-col items-center justify-center gap-3">
										{venue.courts && venue.price ? (
											<div className="flex items-center gap-2 text-sm text-muted-foreground">
												<span>{venue.courts ? `${venue.courts} Courts` : ""}</span>
											</div>
										) : (
											<div className="flex items-center gap-2 text-sm text-muted-foreground">
												<span>-</span>
											</div>
										)}

										{venue.amenities && venue.amenities.length > 0 && (
											<div className="flex flex-wrap gap-2 justify-center">
												{venue.amenities.map((amenity: string) => (
													<span key={amenity} className="text-xs bg-secondary px-2 py-1 rounded-full">
														{amenity}
													</span>
												))}
											</div>
										)}

										<Button className="w-full mt-4" asChild>
											<Link href={`/${country}/${lang}/${city}/venues/${venue.id}`}>View Venue</Link>
										</Button>

										{/* {venue.bookable && (
                      <Button className="w-full mt-4" asChild>
                        <Link href={`/${country}/${lang}/${city}/venues/${venue.id}`}>Book Now</Link>
                      </Button>
                    )} */}

										{/* {venue.allowRankings &&
                      venue.competitions.length > 0 &&
                      categories.map((category) => <ViewRankings key={category} country={country} lang={lang} city={city} venueId={venue.id} category={category} />)} */}
									</CardContent>
								</Card>
							);
						})}
					</div>

					<div className="my-8">
						<h2 className="text-2xl font-bold tracking-tight mb-6">More Venues</h2>
						<p className="text-sm text-muted-foreground mb-6">
							Need a booking system? Contact us by{" "}
							<Link href="https://line.me/ti/p/3fSBoqC4vm" target="_blank" rel="noopener noreferrer" className="underline">
								Line
							</Link>{" "}
							or{" "}
							<Link href="mailto:contact@alwaysfullybooked.com" target="_blank" rel="noopener noreferrer" className="underline">
								Email
							</Link>
							.
						</p>
					</div>
				</div>
			) : (
				<div className="my-8">
					<h2 className="text-2xl font-bold tracking-tight mb-6">No venues found</h2>
					<p className="text-sm text-muted-foreground mb-6">Please try again with different search criteria.</p>
					<p className="text-sm text-muted-foreground mb-6">
						Need a booking system? Contact us by{" "}
						<Link href="https://line.me/ti/p/3fSBoqC4vm" target="_blank" rel="noopener noreferrer" className="underline">
							Line
						</Link>{" "}
						or{" "}
						<Link href="mailto:contact@alwaysfullybooked.com" target="_blank" rel="noopener noreferrer" className="underline">
							Email
						</Link>
						.
					</p>
				</div>
			)}
		</>
	);
}

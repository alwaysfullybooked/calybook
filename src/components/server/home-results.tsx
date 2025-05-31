import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { getCountry, locations } from "@/lib/locations";
import { moreVenues } from "@/data/venues";
import { Button } from "../ui/button";

import type { Venue } from "@/types/venue";
import { ExternalLink, MapPin } from "lucide-react";

export default function HomeResults({ country, lang, city, venues }: { country: keyof typeof locations; lang: string; city: string; venues: Venue[] }) {
  const cityLabel = locations[country as keyof typeof locations]?.cities.find((c) => c.slug === city)?.label ?? "";
  const filteredMoreVenues = moreVenues.filter((venue) => venue.city === cityLabel && venue.country === getCountry(country));

  return (
    <>
      {venues.length > 0 ? (
        <div className="my-8">
          <h2 className="text-2xl font-bold tracking-tight mb-6">Featured Venues</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {venues.map((venue) => (
              <Card key={venue.id} className="h-full flex flex-col hover:shadow-lg transition-shadow duration-200">
                {venue.image && <img src={venue.image} alt={venue.name} className="w-full h-48 object-cover rounded-t-xl" />}
                <CardHeader className="flex-1">
                  <CardTitle className="text-xl">{venue.name}</CardTitle>

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
                      <span>•</span>
                      <span>{venue.price ? `${venue.price}/hour` : ""}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>-</span>
                      <span>-</span>
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
                    <Link href={`/${country}/${lang}/${city}/venues/${venue.id}`}>Book Now</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
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
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredMoreVenues.map((moreVenue) => (
                <Card key={moreVenue.altName} className="h-full flex flex-col hover:shadow-lg transition-shadow duration-200">
                  {moreVenue.image && <img src={moreVenue.image} alt={moreVenue.altName} className="w-full h-48 object-cover rounded-t-xl" />}
                  <CardHeader className="flex-1">
                    <CardTitle className="text-xl">{moreVenue.altName}</CardTitle>
                    <CardDescription className="text-sm">{moreVenue.altAddress}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col items-center justify-center gap-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{moreVenue.courts.tennis.count ? `${moreVenue.courts.tennis.count} Courts` : ""}</span>
                      <span>•</span>
                      <span>{moreVenue.courts.tennis.price ? `${moreVenue.courts.tennis.price}/hour` : ""}</span>
                    </div>
                    {moreVenue.amenities && moreVenue.amenities.length > 0 && (
                      <div className="flex flex-wrap gap-2 justify-center">
                        {moreVenue.amenities.map((amenity) => (
                          <span key={amenity} className="text-xs bg-secondary px-2 py-1 rounded-full">
                            {amenity}
                          </span>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
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

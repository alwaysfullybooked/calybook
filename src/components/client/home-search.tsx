"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { locations, getCountryLabel } from "@/lib/locations";
import { moreVenues } from "@/data/venues";
import { Button } from "../ui/button";

import type { MatchVenues, MoreVenues } from "@/lib/alwaysbookbooked";
import { ExternalLink, MapPin } from "lucide-react";

export default function HomeSearch({ country, venues, lang }: { country: keyof typeof locations; venues: MatchVenues[]; lang: string }) {
  const router = useRouter();
  const pathname = usePathname();

  const [city, setCity] = useState<string>(locations[country]?.cities[0]?.value ?? "");
  const citySlug = locations[country]?.cities.find((c) => c.value === city)?.slug ?? "";

  const filteredMoreVenues = moreVenues.filter((venue) => venue.city === city && venue.country === getCountryLabel(country)) as unknown as MoreVenues[];

  useEffect(() => {
    const params = new URLSearchParams();

    city && params.set("city", city);
    // if (category !== "*") params.set("category", category);
    // if (search) params.set("search", search);
    router.push(`${pathname}?${params.toString()}`);
  }, [city, router, pathname]);

  return (
    <>
      <Card className="mx-auto w-full">
        <CardHeader>
          <CardTitle>Find a Venue</CardTitle>
          <CardDescription>Find a venue in {locations[country]?.name}. Filter by locations.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 max-w-sm">
          <Select value={city} onValueChange={(value: string) => setCity(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Location" />
            </SelectTrigger>
            <SelectContent>
              {locations[country]?.cities.map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* <Button variant="default" className="w-full" asChild>
            <Link href={`/${country}/${lang}/chat`}>Or try our Booking AI Assistant</Link>
          </Button> */}

          {/* <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="*">All Categories</SelectItem>
              <SelectItem value="tennis">Tennis</SelectItem>
              <SelectItem value="golf">Golf</SelectItem>
              <SelectItem value="yoga">Yoga</SelectItem>
              <SelectItem value="pilates">Pilates</SelectItem>
            </SelectContent>
          </Select> */}

          <div className="mt-4 flex gap-2">
            {/* <Input placeholder="Search venues..." value={search} onChange={(e) => setSearch(e.target.value)} /> */}
            {/* <Button onClick={handleSearch}>
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button> */}
          </div>
        </CardContent>
      </Card>

      {/* <div className="my-8 p-4 bg-yellow-100 border border-yellow-400 rounded-lg">
        <div className="flex items-center">
          <svg className="w-6 h-6 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <title>Maintenance Mode</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <div>
            <h3 className="font-semibold text-yellow-800">Maintenance Mode</h3>
            <p className="text-yellow-700">Our system is currently undergoing maintenance. Some features may be temporarily unavailable.</p>
          </div>
        </div>
      </div> */}

      {venues.length > 0 ? (
        <div className="my-8">
          <h2 className="text-2xl font-bold tracking-tight mb-6">Featured Venues</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {venues.map((venue) => (
              <Card key={venue.id} className="h-full flex flex-col hover:shadow-lg transition-shadow duration-200 p-0 pb-3">
                {venue.image && <img src={venue.image} alt={venue.name} className="w-full h-48 object-cover rounded-t-xl" />}
                <CardHeader className="flex-1">
                  <CardTitle className="text-lg">{venue.name}</CardTitle>

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
                    <Link href={`/${country}/${lang}/${citySlug}/venues/${venue.id}`}>Book Now</Link>
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
                <Card key={moreVenue.altName} className="h-full flex flex-col hover:shadow-lg transition-shadow duration-200 p-0 pb-3">
                  {moreVenue.image && <img src={moreVenue.image} alt={moreVenue.altName} className="w-full h-48 object-cover rounded-t-xl" />}
                  <CardHeader className="flex-1">
                    <CardTitle className="text-lg">{moreVenue.altName}</CardTitle>
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

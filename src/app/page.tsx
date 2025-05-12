import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { alwaysbookbooked } from "@/lib/alwaysbookbooked";
import HomeSearch from "@/components/client/home-search";
import Link from "next/link";

export default async function Home({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const { country, city } = await searchParams;

  const venues = await alwaysbookbooked.venues.list();

  const filteredVenues = venues
    .filter((f) => {
      return f.country
        ?.toLowerCase()
        .replaceAll(" ", "-")
        .includes(country?.toLowerCase() ?? "");
    })
    .filter((f) => {
      return f.city
        ?.toLowerCase()
        .replaceAll(" ", "-")
        .includes(city?.toLowerCase() ?? "");
    });

  return (
    <main className="flex min-h-screen flex-col items-center">
      <div className="w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Welcome to JustBookIt</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Find and book the perfect venue for your next event</p>
        </div>

        <div className="mb-12">
          <HomeSearch />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredVenues.map((venue) => (
            <Card key={venue.id} className="h-full flex flex-col hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="flex-1">
                <CardTitle className="text-xl">{venue.name}</CardTitle>
                <CardDescription className="text-base">
                  {venue.city}, {venue.country}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col items-center justify-center gap-3">
                <p className="text-sm text-muted-foreground mb-4">Discover this amazing venue in {venue.city}</p>
                <Button className="w-full" asChild disabled={true}>
                  {/* <Link href={`/venues/${venue.id}`}>View Details</Link> */}
                </Button>
                Maintenance mode
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { alwaysbookbooked } from "@/lib/alwaysbookbooked";
import HomeSearch from "@/components/client/home-search";
import Link from "next/link";

export default async function Home({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const { country, city } = await searchParams;

  const venues = await alwaysbookbooked.venues.publicSearch(country ?? "thailand", city ?? "chiang-mai");

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

        {/* <div className="mb-8 p-4 bg-yellow-100 border border-yellow-400 rounded-lg">
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

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {venues.map((venue) => (
            <Card key={venue.id} className="h-full flex flex-col hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="flex-1">
                <CardTitle className="text-xl">{venue.name}</CardTitle>
                <CardDescription className="text-sm">{venue.address}</CardDescription>
                <CardDescription className="text-sm">
                  {venue.city}, {venue.country}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col items-center justify-center gap-3">
                <p className="text-muted-foreground mb-4">
                  <span className="font-bold">Tennis court booking</span>
                </p>
                <Button className="w-full" asChild disabled={true}>
                  <Link href={`/venues/${venue.id}`}>Check availability</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}

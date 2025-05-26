import { alwaysbookbooked } from "@/lib/alwaysbookbooked";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Phone } from "lucide-react";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { matchVenues } from "@/data/venues";
import TennisRankings from "@/components/tennis/rankings";
import TennisChallenge from "@/components/tennis/challenge";
import BookingSchedule from "@/components/client/booking-schedule";

export default async function VenuePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const session = await auth();

  if (!session?.user?.email) {
    redirect(`/login?callbackUrl=/venues/${id}`);
  }

  const email = session.user.email;
  const contactWhatsAppId = session.user.contactWhatsAppId;
  const contactLineId = session.user.contactLineId;

  const venue = await alwaysbookbooked.venues.publicFind(id);
  const availableSchedule = await alwaysbookbooked.venues.publicAvailability(id);

  if (!venue) {
    return <div>Venue not found</div>;
  }

  const info = matchVenues.find((v) => v.id === venue.id);

  const mergedVenue = {
    ...venue,
    image: info?.image ?? null,
    courts: info?.courts ?? null,
    price: info?.price ?? null,
    amenities: info?.amenities ?? null,
  };

  const services = venue?.services;

  return (
    <main className="container mx-auto px-4 py-4 sm:py-6 md:py-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
        <div className="md:col-span-3">
          <Card className="mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row">
              {mergedVenue.image && (
                <div className="w-full md:w-1/3 h-48">
                  <img src={mergedVenue.image} alt={mergedVenue.name} className="w-full h-full object-cover rounded-t-xl md:rounded-l-xl md:rounded-tr-none" />
                </div>
              )}
              <div className="flex-1">
                <CardHeader className="space-y-2">
                  <CardTitle className="text-2xl sm:text-3xl md:text-4xl">{mergedVenue.name}</CardTitle>
                  <CardDescription className="text-base sm:text-lg">
                    {mergedVenue.city}, {mergedVenue.country}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mt-5">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-gray-500" />
                      <span className="text-sm sm:text-base">{mergedVenue.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-5 w-5 text-gray-500" />
                      <a href={`tel:${mergedVenue.phone}`} className="text-sm sm:text-base hover:underline">
                        {mergedVenue.phone}
                      </a>
                    </div>
                    {/* <div className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-gray-500" />
                      <Link href={venue.website} className="text-sm text-blue-500 hover:underline sm:text-base" target="_blank" rel="noopener noreferrer">
                        Website
                      </Link>
                    </div> */}
                  </div>
                </CardContent>
              </div>
            </div>
          </Card>

          {/* <div className="flex flex-col justify-center my-8 text-center max-w-md mx-auto">
            <p className="text-sm sm:text-base mb-4">Ever tried to book? It's a pain, right? Try our Booking AI Assistant to book your court in seconds.</p>
            <Button variant="default" className="my-4" asChild>
              <Link href={`/${country}/${lang}/chat`}>Chat to book now</Link>
            </Button>
          </div> */}

          <Tabs defaultValue="booking" className="w-full">
            <TabsList className="w-full justify-start overflow-x-auto">
              <TabsTrigger value="booking" className="text-sm sm:text-base">
                Booking
              </TabsTrigger>
              {/* <TabsTrigger value="ranking" className="text-sm sm:text-base">
                Ranking (Mockup)
              </TabsTrigger> */}
              <TabsTrigger value="challenger" className="text-sm sm:text-base">
                Challenges (DRAFT)
              </TabsTrigger>
              {/* <TabsTrigger value="services" className="text-sm sm:text-base">
                Services
              </TabsTrigger> */}
            </TabsList>

            <TabsContent value="booking">
              <div className="mt-4">
                <BookingSchedule
                  email={email}
                  contactWhatsAppId={contactWhatsAppId}
                  contactLineId={contactLineId}
                  venueId={venue.id}
                  venueName={venue.name}
                  services={services}
                  availableSchedule={availableSchedule}
                />
              </div>
            </TabsContent>

            <TabsContent value="ranking">
              <TennisRankings />
            </TabsContent>

            <TabsContent value="challenger">
              <TennisChallenge />
            </TabsContent>

            <TabsContent value="services">
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                {services.map((service) => (
                  <Card key={service.id}>
                    <CardHeader>
                      <CardTitle className="text-lg sm:text-xl">{service.name}</CardTitle>
                      <CardDescription className="text-sm sm:text-base">{service.description}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
}

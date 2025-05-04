import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { alwaysbookbooked } from "@/lib/alwaysbookbooked";
import { auth } from "@/server/auth";
import { format } from "date-fns";

import { Calendar, Clock, MapPin, X } from "lucide-react";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const email = session.user.email;

  const { hashWithSignature } = await alwaysbookbooked.integrations.generateHash(email);
  const customerHash = hashWithSignature.split(":")[0];

  if (!customerHash) {
    throw new Error("Failed to generate customer hash");
  }

  const bookings = await alwaysbookbooked.bookings.search({
    customerHash,
  });

  // Fetch service and venue information for each booking
  const bookingsWithVenues = await Promise.all(
    bookings.map(async (booking) => {
      const services = await alwaysbookbooked.services.list();
      const service = services.find((s) => s.id === booking.serviceId);
      const venue = service ? await alwaysbookbooked.venues.search(service.venueId) : null;
      return {
        ...booking,
        venueName: venue?.name ?? "Unknown Venue",
        venueCity: venue?.city ?? "Unknown City",
        venueCountry: venue?.country ?? "Unknown Country",
      };
    })
  );

  const upcomingBookings = bookingsWithVenues.filter((booking) => booking.startDatetime > new Date());
  const pastBookings = bookingsWithVenues.filter((booking) => booking.startDatetime < new Date());

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-3xl font-bold">My Dashboard</h1>

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upcoming">Upcoming Bookings</TabsTrigger>
            <TabsTrigger value="past">Past Bookings</TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming">
            <div className="mt-4 space-y-6">
              {upcomingBookings.length === 0 ? (
                <div className="text-center text-gray-500 py-12">
                  <span>No upcoming bookings. Book your next appointment!</span>
                </div>
              ) : (
                upcomingBookings.map((booking) => (
                  <Card key={booking.id} className="shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
                    <CardHeader className="bg-gray-50 rounded-t-md">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl">{booking.venueName}</CardTitle>
                          <CardDescription className="text-gray-600">{booking.serviceName}</CardDescription>
                          <div className="mt-1 text-sm text-gray-500">
                            {booking.venueCity}, {booking.venueCountry}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-lg font-medium">
                          <Calendar className="h-5 w-5 text-primary" />
                          <span>{format(new Date(booking.startDatetime), "PPP")}</span>
                          <span className="mx-2 text-gray-400">|</span>
                          <Clock className="h-5 w-5 text-primary" />
                          <span>{format(new Date(booking.startDatetime), "HH:mm")}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary" />
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${booking.serviceIndoor ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
                            {booking.serviceIndoor ? "Indoor" : "Outdoor"}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
          <TabsContent value="past">
            <div className="mt-4 space-y-6">
              {pastBookings.length === 0 ? (
                <div className="text-center text-gray-400 py-12">
                  <span>No past bookings found.</span>
                </div>
              ) : (
                pastBookings.map((booking) => (
                  <Card key={booking.id} className="shadow border border-gray-100">
                    <CardHeader className="bg-gray-50 rounded-t-md">
                      <div>
                        <CardTitle className="text-lg">{booking.venueName}</CardTitle>
                        <CardDescription className="text-gray-600">{booking.serviceName}</CardDescription>
                        <div className="mt-1 text-sm text-gray-500">
                          {booking.venueCity}, {booking.venueCountry}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span>{format(new Date(booking.startDatetime), "PPP")}</span>
                          <span className="mx-2 text-gray-300">|</span>
                          <Clock className="h-4 w-4 text-primary" />
                          <span>{booking.startDatetime.toLocaleTimeString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary" />
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${booking.serviceIndoor ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
                            {booking.serviceIndoor ? "Indoor" : "Outdoor"}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}

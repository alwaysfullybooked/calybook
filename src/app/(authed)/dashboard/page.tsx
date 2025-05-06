import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { alwaysbookbooked } from "@/lib/alwaysbookbooked";
import { auth } from "@/server/auth";
import { Calendar, Clock, MapPin, X } from "lucide-react";
import { redirect } from "next/navigation";
import { addMinutes, format, getHours } from "date-fns";
import Link from "next/link";
import { toZonedTime } from "date-fns-tz";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const customerContactId = session.user.id;

  const bookings = await alwaysbookbooked.bookings.list({
    customerContactId,
  });

  // Fetch service and venue information for each booking
  const processedBookings = bookings.map((booking) => {
    const zonedStartDate = toZonedTime(booking.startDatetime, booking.timezone);
    const zonedEndDate = addMinutes(zonedStartDate, 60); // End time is start + 60 minutes

    return {
      ...booking,
      venueName: booking.service.venue.name,
      venueCity: booking.service.venue.city,
      venueCountry: booking.service.venue.country,
      venueId: booking.service.venueId,

      zonedStartDate,
      zonedEndDate,
    };
  });

  const upcomingBookings = processedBookings.filter((booking) => booking.startDatetime > new Date());
  const pastBookings = processedBookings.filter((booking) => booking.startDatetime < new Date());

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
                  <Card
                    key={booking.id}
                    className={`shadow-lg border border-gray-200 hover:shadow-xl transition-shadow ${
                      booking.status === "pending" ? "border-orange-200" : booking.status === "confirmed" ? "border-green-200" : ""
                    }`}
                  >
                    <CardHeader className={`rounded-t-md ${booking.status === "pending" ? "bg-orange-50" : booking.status === "confirmed" ? "bg-green-50" : "bg-gray-50"}`}>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl">
                            <Link href={`/venues/${booking.venueId}`} className="hover:underline">
                              {booking.venueName}
                            </Link>
                          </CardTitle>
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
                          <span>{format(booking.startDatetime, "EEEE, MMMM d")}</span>
                          <span className="mx-2 text-gray-400">|</span>
                          <Clock className="h-5 w-5 text-primary" />
                          <span>
                            {format(booking.zonedStartDate, "HH:mm")} - {format(booking.zonedEndDate, "HH:mm")}
                          </span>
                          {booking.status === "pending" && <span className="px-2 py-1 text-xs font-semibold text-orange-800 bg-orange-100 rounded-full">Pending</span>}
                          {booking.status === "confirmed" && <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">Confirmed</span>}
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
                  <Card key={booking.id} className={`shadow border border-gray-100 ${booking.status === "pending" ? "border-orange-200" : booking.status === "confirmed" ? "border-green-200" : ""}`}>
                    <CardHeader className={`rounded-t-md ${booking.status === "pending" ? "bg-orange-50" : booking.status === "confirmed" ? "bg-green-50" : "bg-gray-50"}`}>
                      <div>
                        <CardTitle className="text-lg">
                          <Link href={`/venues/${booking.venueId}`} className="hover:underline">
                            {booking.venueName}
                          </Link>
                        </CardTitle>
                        <CardDescription className="text-gray-600">{booking.serviceName}</CardDescription>
                        <div className="mt-1 text-sm text-gray-500">
                          {booking.venueCity}, {booking.venueCountry}
                        </div>
                        {booking.status === "pending" && <span className="mt-2 inline-block px-2 py-1 text-xs font-semibold text-orange-800 bg-orange-100 rounded-full">Pending</span>}
                        {booking.status === "confirmed" && <span className="mt-2 inline-block px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">Confirmed</span>}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span>{format(booking.startDatetime, "EEEE, MMMM d")}</span>
                          <span className="mx-2 text-gray-300">|</span>
                          <Clock className="h-4 w-4 text-primary" />
                          <span>{format(booking.startDatetime, "HH:mm")}</span>
                          {booking.status === "pending" && <span className="px-2 py-1 text-xs font-semibold text-orange-800 bg-orange-100 rounded-full">Pending</span>}
                          {booking.status === "confirmed" && <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">Confirmed</span>}
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

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { auth } from "@/server/auth";
import { Calendar, Clock, Pencil } from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";

import { alwaysbookbooked } from "@/lib/alwaysbookbooked";
import { getCountryCode } from "@/lib/locations";

export default async function BookingsPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const customerEmailId = session.user.email;

  const bookings = await alwaysbookbooked.bookings.searchCustomerBookings({
    customerEmailId,
  });

  const formatDate = (inputDate: Date | undefined) => {
    const date = inputDate ? new Date(inputDate) : new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const today = formatDate(new Date());

  const upcomingBookings = today ? bookings.filter((booking) => booking.startDate >= today) : [];
  const pastBookings = today ? bookings.filter((booking) => booking.startDate < today) : [];

  return (
    <div className="px-2 sm:px-4 max-w-full sm:max-w-4xl mx-auto">
      <h1 className="mb-6 sm:mb-8 text-2xl sm:text-3xl font-bold text-center sm:text-left">My Bookings</h1>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="upcoming" className="text-sm sm:text-base">
            Upcoming
          </TabsTrigger>
          <TabsTrigger value="past" className="text-sm sm:text-base">
            Past
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          <div className="mt-3 sm:mt-4 space-y-4 sm:space-y-6">
            {upcomingBookings.length === 0 ? (
              <div className="text-center text-gray-500 py-8 sm:py-12 text-sm sm:text-base">
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
                  <CardHeader className={`rounded-t-md px-3 py-2 sm:px-6 sm:py-4 ${booking.status === "pending" ? "bg-orange-50" : booking.status === "confirmed" ? "bg-green-50" : "bg-gray-50"}`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base sm:text-xl">
                          <Link href={`${getCountryCode(booking.service.venue.country)}/en/venues/${booking.service.venueId}`} className="hover:underline">
                            {booking.service.venue.name}
                          </Link>
                        </CardTitle>
                        <CardDescription className="text-gray-600 text-xs sm:text-base">{booking.serviceName}</CardDescription>
                        <div className="mt-1 text-xs sm:text-sm text-gray-500">
                          {booking.service.venue.city}, {booking.service.venue.country}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="px-3 py-2 sm:px-6 sm:py-4">
                    <div className="space-y-2 sm:space-y-3">
                      {booking.notes && (
                        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                          <Pencil className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                          <span className="text-xs sm:text-base">{booking.notes}</span>
                        </div>
                      )}
                      <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-sm sm:text-lg font-medium">
                        <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                        <span>{booking.startDate}</span>
                        <span className="mx-1 sm:mx-2 text-gray-400">|</span>
                        <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                        <span>
                          {booking.startTime} - {booking.endTime}
                        </span>
                        {booking.status === "pending" && <span className="px-1.5 py-0.5 text-[10px] sm:text-xs font-semibold text-orange-800 bg-orange-100 rounded-full">Pending</span>}
                        {booking.status === "confirmed" && <span className="px-1.5 py-0.5 text-[10px] sm:text-xs font-semibold text-green-800 bg-green-100 rounded-full">Confirmed</span>}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
        <TabsContent value="past">
          <div className="mt-3 sm:mt-4 space-y-4 sm:space-y-6">
            {pastBookings.length === 0 ? (
              <div className="text-center text-gray-400 py-8 sm:py-12 text-sm sm:text-base">
                <span>No past bookings found.</span>
              </div>
            ) : (
              pastBookings.map((booking) => (
                <Card key={booking.id} className={`shadow border border-gray-100 ${booking.status === "pending" ? "border-orange-200" : booking.status === "confirmed" ? "border-green-200" : ""}`}>
                  <CardHeader className={`rounded-t-md px-3 py-2 sm:px-6 sm:py-4 ${booking.status === "pending" ? "bg-orange-50" : booking.status === "confirmed" ? "bg-green-50" : "bg-gray-50"}`}>
                    <div>
                      <CardTitle className="text-base sm:text-lg">
                        <Link href={`/venues/${booking.service.venueId}`} className="hover:underline">
                          {booking.service.venue.name}
                        </Link>
                      </CardTitle>
                      <CardDescription className="text-gray-600 text-xs sm:text-base">{booking.serviceName}</CardDescription>
                      <div className="mt-1 text-xs sm:text-sm text-gray-500">
                        {booking.service.venue.city}, {booking.service.venue.country}
                      </div>
                      {booking.status === "pending" && <span className="mt-2 inline-block px-1.5 py-0.5 text-[10px] sm:text-xs font-semibold text-orange-800 bg-orange-100 rounded-full">Pending</span>}
                      {booking.status === "confirmed" && (
                        <span className="mt-2 inline-block px-1.5 py-0.5 text-[10px] sm:text-xs font-semibold text-green-800 bg-green-100 rounded-full">Confirmed</span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="px-3 py-2 sm:px-6 sm:py-4">
                    <div className="space-y-2 sm:space-y-3">
                      {booking.notes && (
                        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                          <Pencil className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                          <span className="text-xs sm:text-base">{booking.notes}</span>
                        </div>
                      )}
                      <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                        <span className="text-xs sm:text-base">{booking.startDate}</span>
                        <span className="mx-1 sm:mx-2 text-gray-300">|</span>
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                        <span className="text-xs sm:text-base">
                          {booking.startTime} - {booking.endTime}
                        </span>
                        {booking.status === "pending" && <span className="px-1.5 py-0.5 text-[10px] sm:text-xs font-semibold text-orange-800 bg-orange-100 rounded-full">Pending</span>}
                        {booking.status === "confirmed" && <span className="px-1.5 py-0.5 text-[10px] sm:text-xs font-semibold text-green-800 bg-green-100 rounded-full">Confirmed</span>}
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
  );
}

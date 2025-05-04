import { alwaysbookbooked } from "@/lib/alwaysbookbooked";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MapPin, Phone, Globe } from "lucide-react";
import BookingDialog from "@/components/client/booking-dialog";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { formatDateInTimeZone, isSameDayInTimeZone, compareDatesInTimeZone, parseDateInTimeZone } from "@/lib/utils/dateWithTZ";

// Helper function to safely parse dates
const safeParseDate = (date: string | number | Date, tz: string): Date => {
  return parseDateInTimeZone(date, tz);
};

export default async function VenuePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();

  // If not authenticated, redirect to login with callback URL
  if (!session?.user) {
    redirect(`/login?callbackUrl=/venues/${id}`);
  }

  if (!session.user.email) {
    redirect(`/login?callbackUrl=/venues/${id}`);
  }

  const email = session.user.email;

  const venue = await alwaysbookbooked.venues.search(id);

  if (!venue) {
    return <div>Venue not found</div>;
  }

  const payments = await alwaysbookbooked.blobs.search({
    venueId: venue.id,
    prefix: "scan",
  });

  const services = venue?.services ?? [];
  const bookings = services.flatMap((service) => service.bookings);
  const timeslots = services.flatMap((service) => service.timeslots);
  const inventories = services.flatMap((service) => service.inventories).sort((a, b) => compareDatesInTimeZone(a.startDatetime, b.startDatetime, a.timezone ?? "Asia/Bangkok"));

  const servicesMap = services.reduce((acc, service) => {
    acc[service.id] = service.name;
    return acc;
  }, {} as Record<string, string>);

  // Create a map of time to payment image
  const paymentMap = payments.blobs.reduce((acc: Record<string, string>, blob) => {
    const time = blob.pathname.split("/").pop()?.split(".")[0] ?? "";
    acc[time] = blob.url;
    return acc;
  }, {});

  // Create timeslots map with serviceId and startTime
  const timeslotsMap = timeslots.reduce((acc, timeslot) => {
    const startTimeStr = timeslot.startTime.split(":")[0];
    const endTimeStr = timeslot.endTime.split(":")[0];

    if (!startTimeStr || !endTimeStr) return acc;

    const startTime = parseInt(startTimeStr);
    const endTime = parseInt(endTimeStr);

    for (let hour = startTime; hour <= endTime; hour++) {
      const timeKey = `${hour.toString().padStart(2, "0")}:00`;
      acc[`${timeslot.serviceId}|${timeKey}`] = timeslot;
    }
    return acc;
  }, {} as Record<string, (typeof timeslots)[number]>);

  // Process inventories to include payment and pricing info
  const processedInventories = inventories.map((inventory) => {
    const startHour = formatDateInTimeZone(inventory.startDatetime, inventory.timezone ?? "Asia/Bangkok", "HH:mm");
    const timeslotKey = `${inventory.serviceId}|${startHour}`;
    const timeslot = timeslotsMap[timeslotKey];

    const priceKey = timeslot ? `scan-${timeslot.price}-thb` : "";
    const paymentImage = paymentMap[priceKey] ?? "";

    return {
      ...inventory,
      paymentImage,
      price: inventory.price ?? timeslot?.price ?? null,
      currency: inventory.currency ?? timeslot?.currency ?? null,
    };
  });

  return (
    <main className="container mx-auto px-4 py-4 sm:py-6 md:py-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
        <div className="md:col-span-3">
          <Card className="mb-6 md:mb-8">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl sm:text-3xl md:text-4xl">{venue.name}</CardTitle>
              <CardDescription className="text-base sm:text-lg">Description</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <span className="text-sm sm:text-base">{venue.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-gray-500" />
                  <span className="text-sm sm:text-base">Phone</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-gray-500" />
                  <a href="#" className="text-sm text-blue-500 hover:underline sm:text-base" target="_blank" rel="noopener noreferrer">
                    Website
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="availability" className="w-full">
            <TabsList className="w-full justify-start overflow-x-auto">
              <TabsTrigger value="availability" className="text-sm sm:text-base">
                Availability
              </TabsTrigger>
              <TabsTrigger value="services" className="text-sm sm:text-base">
                Services
              </TabsTrigger>
              <TabsTrigger value="reviews" className="text-sm sm:text-base">
                Reviews
              </TabsTrigger>
            </TabsList>
            <TabsContent value="services">
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {services.map((service) => (
                  <Card key={service.id}>
                    <CardHeader>
                      <CardTitle className="text-lg sm:text-xl">{service.name}</CardTitle>
                      <CardDescription className="text-sm sm:text-base">
                        {service.type} - {service.indoor ? "Indoor" : "Outdoor"}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="availability">
              <div className="mt-4">
                <div className="mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <span className="font-medium text-sm sm:text-base">Available Times</span>
                </div>
                <div className="space-y-6">
                  {Array.from(
                    processedInventories.reduce((acc, inventory) => {
                      const day = formatDateInTimeZone(inventory.startDatetime, inventory.timezone ?? "Asia/Bangkok", "yyyy-MM-dd");

                      if (!acc.has(day)) acc.set(day, []);
                      acc.get(day)!.push(inventory);
                      return acc;
                    }, new Map<string, typeof processedInventories>()),
                    ([day, dayInventories], dayIndex) => {
                      const date = safeParseDate(day, dayInventories[0]?.timezone ?? "Asia/Bangkok");
                      const venueTimezone = dayInventories[0]?.timezone ?? "Asia/Bangkok";
                      const dateStr = isNaN(date.getTime()) ? "Invalid date" : formatDateInTimeZone(date, venueTimezone, "EEEE, MMM d");

                      // Get bookings for this day
                      const dayBookings = bookings.filter((booking) => {
                        const bookingDate = safeParseDate(booking.startDatetime, booking.timezone ?? "Asia/Bangkok");
                        return isSameDayInTimeZone(bookingDate, date, venueTimezone);
                      });

                      // Group by hour
                      const hourMap = Array.from({ length: 16 }, (_, hourIndex) => {
                        const hour = hourIndex + 8;
                        const inventoriesAtHour = dayInventories.filter((inventory) => {
                          const startHour = safeParseDate(inventory.startDatetime, inventory.timezone ?? "Asia/Bangkok").getHours();
                          const endHour = safeParseDate(inventory.endDatetime, inventory.timezone ?? "Asia/Bangkok").getHours();
                          return hour >= startHour && hour < endHour;
                        });
                        return { hour, inventoriesAtHour };
                      });

                      return (
                        <div key={dayIndex} className="space-y-2">
                          <div className="font-medium text-sm sm:text-base">{dateStr}</div>
                          <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
                            {hourMap.map(({ hour, inventoriesAtHour }, hourIndex) => (
                              <div className={`p-2 text-xs sm:text-sm ${inventoriesAtHour.length ? "bg-gray-100" : ""}`} key={hourIndex}>
                                {`${hour}:00`}
                                {inventoriesAtHour.map((inventory) => {
                                  const serviceName = servicesMap[inventory.serviceId] ?? "Unknown Service";
                                  const booking = bookings.find(
                                    (b) =>
                                      b.serviceId === inventory.serviceId &&
                                      isSameDayInTimeZone(
                                        safeParseDate(b.startDatetime, b.timezone ?? "Asia/Bangkok"),
                                        safeParseDate(inventory.startDatetime, inventory.timezone ?? "Asia/Bangkok"),
                                        venueTimezone
                                      ) &&
                                      safeParseDate(b.startDatetime, b.timezone ?? "Asia/Bangkok").getHours() === hour
                                  );
                                  return (
                                    <div key={inventory.id} className="flex justify-center my-2">
                                      <BookingDialog
                                        email={email}
                                        venueName={venue.name}
                                        serviceName={serviceName}
                                        serviceId={inventory.serviceId}
                                        serviceType="Hard surface"
                                        serviceIndoor={false}
                                        date={dateStr}
                                        startDatetime={inventory.startDatetime.getTime()}
                                        endDatetime={inventory.endDatetime.getTime()}
                                        paymentImage={inventory.paymentImage}
                                        price={inventory.price}
                                        currency={inventory.currency}
                                        status={booking?.status ?? ""}
                                        timezone={inventory.timezone}
                                      />
                                    </div>
                                  );
                                })}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="reviews">
              <div className="mt-4">
                <p className="text-sm sm:text-base">Reviews coming soon...</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div>{/* Sidebar content can be added here */}</div>
      </div>
    </main>
  );
}

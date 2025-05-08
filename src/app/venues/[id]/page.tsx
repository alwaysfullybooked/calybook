import { alwaysbookbooked } from "@/lib/alwaysbookbooked";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Phone, Globe } from "lucide-react";
import BookingDialog from "@/components/client/booking-dialog";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { format, parseISO, getHours, addMinutes } from "date-fns";
import { toZonedTime } from "date-fns-tz";

type Booking = {
  id: string;
  serviceId: string;
  startDatetime: Date;
  endDatetime: Date;
  durationMinutes: number;
  timezone: string;
  price: string | null;
  currency: string | null;
  status: string;
  createdById: string;
  createdAt: Date;
  paymentImage: string | null;
  date: string; // YYYY-MM-DD
  startHourNumber: string;
  endHourNumber: string;
  serviceName: string;
  serviceType: string | null;
  serviceIndoor: boolean | null;
  customerContactId: string | null;
};

export default async function VenuePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const session = await auth();

  if (!session?.user?.email) {
    redirect(`/login?callbackUrl=/venues/${id}`);
  }

  const email = session.user.email;
  const customerContactId = session.user.id;
  const contactMethod = session.user.contactMethod;
  const contactWhatsAppId = session.user.contactWhatsAppId;
  const contactLineId = session.user.contactLineId;

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

  // Create services map for quick lookup
  const servicesMap = services.reduce(
    (acc, service) => {
      acc[service.id] = service;
      return acc;
    },
    {} as Record<string, (typeof services)[number]>,
  );

  // Create timeslots map
  const timeslotsMap = timeslots.reduce(
    (acc, timeslot) => {
      for (let hour = Number.parseInt(timeslot.startTime); hour <= Number.parseInt(timeslot.endTime); hour++) {
        const timeKey = `${timeslot.serviceId}|${hour.toString().padStart(2, "0")}:00`;
        acc[timeKey] = timeslot;
      }
      return acc;
    },
    {} as Record<string, (typeof timeslots)[number]>,
  );

  // Create payment map
  const paymentMap = payments.blobs.reduce((acc: Record<string, string>, blob) => {
    const key = blob.pathname.split("/").pop()?.split(".")[0] ?? "";
    acc[key] = blob.url;
    return acc;
  }, {});

  // Group by date
  const bookingsByDate = bookings.reduce(
    (acc, booking) => {
      const date = format(toZonedTime(booking.startDatetime, booking.timezone), "yyyyMMdd");

      if (!acc[date]) {
        acc[date] = [];
      }

      const zonedStartDate = toZonedTime(booking.startDatetime, booking.timezone);
      const zonedEndDate = addMinutes(zonedStartDate, 60); // End time is start + 60 minutes
      const startHour = getHours(zonedStartDate);
      const endHour = getHours(zonedEndDate);
      const durationMinutes = (endHour - startHour) * 60;
      const priceKey = `scan-${booking.price}-thb`;
      const paymentImage = paymentMap[priceKey] ?? null;

      const processedBooking = {
        ...booking,
        date,
        startHourNumber: format(zonedStartDate, "HH:mm"),
        endHourNumber: format(zonedEndDate, "HH:mm"),
        durationMinutes,
        paymentImage,
      };

      acc[date].push(processedBooking);
      return acc;
    },
    {} as Record<string, Booking[]>,
  );

  // Get all unique dates from both bookings and inventories
  const allDates = new Set([...bookings.map((b) => format(toZonedTime(b.startDatetime, b.timezone), "yyyyMMdd"))]);

  // Sort dates
  const sortedDates = Array.from(allDates).sort();

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
                {/* <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-gray-500" />
                  <Link href={venue.website} className="text-sm text-blue-500 hover:underline sm:text-base" target="_blank" rel="noopener noreferrer">
                    Website
                  </Link>
                </div> */}
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
            </TabsList>

            <TabsContent value="services">
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
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
                <div className="space-y-4">
                  {sortedDates.map((date) => {
                    const bookings = bookingsByDate[date] ?? [];
                    const dateObj = parseISO(date);
                    const dateStr = format(dateObj, "EEEE, MMMM d, yyyy");

                    // Get bookings for this day
                    const dayBookings = bookings.filter((booking) => {
                      const bookingDate = format(toZonedTime(booking.startDatetime, booking.timezone), "yyyyMMdd");
                      return bookingDate === date;
                    });

                    // Group inventories by service
                    const bookingsByService = bookings.reduce(
                      (acc, booking) => {
                        const service = servicesMap[booking.serviceId];
                        const serviceName = service?.name ?? "Unknown Service";
                        if (!acc[serviceName]) {
                          acc[serviceName] = [];
                        }
                        acc[serviceName].push(booking);
                        return acc;
                      },
                      {} as Record<string, Booking[]>,
                    );

                    return (
                      <Card key={date} className="overflow-hidden border-2 shadow-sm">
                        <CardHeader className="bg-gray-300/50 p-3">
                          <CardTitle className="text-xl font-semibold text-gray-900">{dateStr}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-3 space-y-4">
                          {Object.entries(bookingsByService).map(([serviceName, serviceBookings]) => (
                            <div key={serviceName} className="space-y-2">
                              <h3 className="text-sm font-medium text-gray-700">{serviceName}</h3>
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                {serviceBookings.map((booking) => {
                                  return (
                                    <Card key={booking.id} className="border-1 hover:shadow-md shadow-sm transition-shadow">
                                      <CardContent className="p-3">
                                        <div className="flex items-center justify-between">
                                          <div className="space-y-1">
                                            <div className="text-sm font-medium text-gray-900">{booking.startHourNumber}</div>
                                            <div className="text-xs text-gray-500">{booking.durationMinutes} minutes</div>
                                            {booking.price && (
                                              <div className="text-xs text-gray-500 mt-3">
                                                {booking.price} {booking.currency}
                                              </div>
                                            )}
                                          </div>

                                          {booking?.status === "confirmed" && (
                                            <div className={`font-medium px-3 py-1 rounded-full ${booking.customerContactId === customerContactId ? "text-green-600" : "text-red-600"}`}>
                                              {booking.customerContactId === customerContactId ? "BOOKED 👍" : "TAKEN ⛔️"}
                                            </div>
                                          )}

                                          {booking?.status === "pending" && <div className="text-yellow-600 bg-yellow-50 font-medium px-3 py-1 rounded-full">Pending</div>}

                                          {booking?.status === "available" && (
                                            <BookingDialog
                                              bookingId={booking.id}
                                              email={email}
                                              contactMethod="email"
                                              contactWhatsAppId={contactWhatsAppId}
                                              contactLineId={contactLineId}
                                              venueName={venue.name}
                                              serviceName={booking.serviceName}
                                              serviceId={booking.serviceId}
                                              serviceType={booking.serviceType ?? ""}
                                              serviceIndoor={booking.serviceIndoor ?? false}
                                              date={dateStr}
                                              startDatetime={booking.startDatetime.getTime()}
                                              endDatetime={booking.endDatetime.getTime()}
                                              timezone={booking.timezone}
                                              durationMinutes={booking.durationMinutes}
                                              paymentImage={booking.paymentImage ?? undefined}
                                              price={booking.price}
                                              currency={booking.currency}
                                            />
                                          )}
                                        </div>
                                      </CardContent>
                                    </Card>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
}

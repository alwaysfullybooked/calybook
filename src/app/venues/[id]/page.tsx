import Link from "next/link";
import { alwaysbookbooked } from "@/lib/alwaysbookbooked";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Phone, Globe } from "lucide-react";
import BookingDialog from "@/components/client/booking-dialog";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { format, parseISO, getHours, addMinutes } from "date-fns";
import { toZonedTime } from "date-fns-tz";

type InventoryWithPayment = {
  id: string;
  serviceId: string;
  startDatetime: Date;
  endDatetime: Date;
  durationMinutes: number;
  timezone: string;
  price: string | null;
  currency: string | null;
  createdById: string;
  createdAt: Date;
  paymentImage: string;
  date: string; // YYYY-MM-DD
  startHourNumber: string;
  endHourNumber: string;
};

export default async function VenuePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const session = await auth();

  if (!session?.user?.email) {
    redirect(`/login?callbackUrl=/venues/${id}`);
  }

  const email = session.user.email;
  const customerId = session.user.id;
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
  const inventories = services.flatMap((service) => service.inventories);

  // Create services map for quick lookup
  const servicesMap = services.reduce(
    (acc, service) => {
      acc[service.id] = service;
      return acc;
    },
    {} as Record<string, (typeof services)[number]>,
  );

  // Create payment map
  const paymentMap = payments.blobs.reduce((acc: Record<string, string>, blob) => {
    const key = blob.pathname.split("/").pop()?.split(".")[0] ?? "";
    acc[key] = blob.url;
    return acc;
  }, {});

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

  // Process inventories with timezone info
  const processedInventories = inventories.map((inventory) => {
    const zonedStartDate = toZonedTime(inventory.startDatetime, inventory.timezone);
    const zonedEndDate = addMinutes(zonedStartDate, 60); // End time is start + 60 minutes
    const dateKey = format(zonedStartDate, "yyyyMMdd");
    const startHour = getHours(zonedStartDate);
    const endHour = getHours(zonedEndDate);
    const durationMinutes = (endHour - startHour) * 60;

    // Find corresponding timeslot price
    const startHourStr = String(startHour).padStart(2, "0");
    const endHourStr = String(endHour).padStart(2, "0");
    const timeslotKey = `${inventory.serviceId}|${startHourStr}:00`;
    const timeslot = timeslotsMap[timeslotKey];

    // Get payment image
    const priceKey = timeslot ? `scan-${timeslot.price}-thb` : "";
    const paymentImage = paymentMap[priceKey] ?? "";

    return {
      ...inventory,
      paymentImage,
      date: dateKey,
      startHourNumber: `${startHourStr}:00`,
      endHourNumber: `${endHourStr}:00`,
      durationMinutes,
      priceKey,
    } as InventoryWithPayment;
  });

  // Group by date
  const inventoriesByDate = processedInventories.reduce(
    (acc, inventory) => {
      const date = inventory.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(inventory);
      return acc;
    },
    {} as Record<string, InventoryWithPayment[]>,
  );

  // Get all unique dates from both bookings and inventories
  const allDates = new Set([...bookings.map((b) => format(toZonedTime(b.startDatetime, b.timezone), "yyyyMMdd")), ...Object.keys(inventoriesByDate)]);

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
                <div className="space-y-4">
                  {sortedDates.map((date) => {
                    const inventories = inventoriesByDate[date] ?? [];
                    const dateObj = parseISO(date);
                    const dateStr = format(dateObj, "EEEE, MMMM d");

                    // Get bookings for this day
                    const dayBookings = bookings.filter((booking) => {
                      const bookingDate = format(toZonedTime(booking.startDatetime, booking.timezone), "yyyyMMdd");
                      return bookingDate === date;
                    });

                    // Group inventories by service
                    const inventoriesByService = inventories.reduce(
                      (acc, inventory) => {
                        const service = servicesMap[inventory.serviceId];
                        const serviceName = service?.name ?? "Unknown Service";
                        if (!acc[serviceName]) {
                          acc[serviceName] = [];
                        }
                        acc[serviceName].push(inventory);
                        return acc;
                      },
                      {} as Record<string, InventoryWithPayment[]>,
                    );

                    return (
                      <Card key={date} className="overflow-hidden border-2 shadow-sm">
                        <CardHeader className="bg-gray-300/50 p-3">
                          <CardTitle className="text-xl font-semibold text-gray-900">{dateStr}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-3 space-y-4">
                          {Object.entries(inventoriesByService).map(([serviceName, serviceInventories]) => (
                            <div key={serviceName} className="space-y-2">
                              <h3 className="text-sm font-medium text-gray-700">{serviceName}</h3>
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                {serviceInventories.map((inventory) => {
                                  const service = servicesMap[inventory.serviceId];
                                  const booking = dayBookings.find((b) => {
                                    const bookingStart = toZonedTime(b.startDatetime, b.timezone);
                                    const bookingEnd = toZonedTime(b.endDatetime, b.timezone);
                                    const inventoryStart = toZonedTime(inventory.startDatetime, inventory.timezone);
                                    const inventoryEnd = toZonedTime(inventory.endDatetime, inventory.timezone);

                                    return b.serviceId === inventory.serviceId && bookingStart.getTime() === inventoryStart.getTime() && bookingEnd.getTime() === inventoryEnd.getTime();
                                  });

                                  return (
                                    <Card key={inventory.id} className="border-1 hover:shadow-md shadow-sm transition-shadow">
                                      <CardContent className="p-3">
                                        <div className="flex items-center justify-between">
                                          <div className="space-y-1">
                                            <div className="text-sm font-medium text-gray-900">{inventory.startHourNumber}</div>
                                            <div className="text-xs text-gray-500">{inventory.durationMinutes} minutes</div>
                                            {inventory.price && (
                                              <div className="text-xs text-gray-500 mt-3">
                                                {inventory.price} {inventory.currency}
                                              </div>
                                            )}
                                          </div>

                                          {booking?.status === "confirmed" && (
                                            <div className={`font-medium px-3 py-1 rounded-full ${booking.customerId === customerId ? "text-green-600" : "text-red-600"}`}>
                                              {booking.customerId === customerId ? "BOOKED 👍" : "TAKEN ⛔️"}
                                            </div>
                                          )}

                                          {booking?.status === "pending" && <div className="text-yellow-600 bg-yellow-50 font-medium px-3 py-1 rounded-full">Pending</div>}

                                          {booking?.status !== "pending" && booking?.status !== "confirmed" && (
                                            <BookingDialog
                                              customerId={customerId}
                                              customerContactMethod="email"
                                              customerContactId={email}
                                              venueName={venue.name}
                                              serviceName={service?.name ?? "Unknown Service"}
                                              serviceId={inventory.serviceId}
                                              serviceType={service?.type ?? ""}
                                              serviceIndoor={service?.indoor ?? false}
                                              date={dateStr}
                                              startDatetime={inventory.startDatetime.getTime()}
                                              endDatetime={inventory.endDatetime.getTime()}
                                              timezone={inventory.timezone}
                                              paymentImage={inventory.paymentImage}
                                              price={inventory.price}
                                              currency={inventory.currency}
                                              status={booking?.status ?? ""}
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

            <TabsContent value="reviews">
              <div className="mt-4">
                <p className="text-sm sm:text-base">Reviews coming soon...</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
}

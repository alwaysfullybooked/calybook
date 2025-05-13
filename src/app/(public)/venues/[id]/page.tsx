import { alwaysbookbooked } from "@/lib/alwaysbookbooked";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Phone, Globe } from "lucide-react";
import BookingDialog from "@/components/client/booking-dialog";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { format, getHours, addMinutes, parseISO } from "date-fns";
import { formatInTimeZone, fromZonedTime, toZonedTime } from "date-fns-tz";

type Schedule = {
  isAvailable: boolean;

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
  const contactWhatsAppId = session.user.contactWhatsAppId;
  const contactLineId = session.user.contactLineId;

  const venue = await alwaysbookbooked.venues.find(id);
  const schedule = await alwaysbookbooked.venues.publicAvailability(id);

  if (!venue) {
    return <div>Venue not found</div>;
  }

  const payments = await alwaysbookbooked.blobs.search({
    venueId: venue.id,
    prefix: "scan",
  });

  const services = venue?.services;

  // const pricelists = services.flatMap((service) => service.pricelists);

  // Create services map for quick lookup
  const servicesMap = services.reduce(
    (acc, service) => {
      acc[service.id] = service;
      return acc;
    },
    {} as Record<string, (typeof services)[number]>,
  );

  // Create pricelists map
  // const pricelistsMap = pricelists.reduce(
  //   (acc, pricelist) => {
  //     for (let hour = Number.parseInt(pricelist.startTime); hour <= Number.parseInt(pricelist.endTime); hour++) {
  //       const timeKey = `${pricelist.serviceId}|${hour.toString().padStart(2, "0")}:00`;
  //       acc[timeKey] = pricelist;
  //     }
  //     return acc;
  //   },
  //   {} as Record<string, (typeof pricelists)[number]>,
  // );

  // Create payment map
  const paymentMap = payments.blobs.reduce((acc: Record<string, string>, blob) => {
    const key = blob.pathname.split("/").pop()?.split(".")[0] ?? "";
    acc[key] = blob.url;
    return acc;
  }, {});

  // Group by date
  const scheduleByDate = schedule.reduce(
    (acc, slots) => {
      const date = format(slots.startDatetime, "yyyyMMdd");

      if (!acc[date]) {
        acc[date] = [];
      }

      const zonedStartDate = toZonedTime(slots.startDatetime, slots.timezone);
      const zonedEndDate = addMinutes(zonedStartDate, 60); // End time is start + 60 minutes
      const startHour = getHours(zonedStartDate);
      const endHour = getHours(zonedEndDate);
      const priceKey = `scan-${slots.price}-thb`;
      const paymentImage = paymentMap[priceKey] ?? null;

      const processedSchedule = {
        ...slots,
        date,
        startHour,
        endHour,
        durationMinutes: slots.durationMinutes,
        paymentImage,
      };

      acc[date].push(processedSchedule as unknown as Schedule);
      return acc;
    },
    {} as Record<string, Schedule[]>,
  );

  // Get all unique dates from both bookings and inventories
  const allDates = new Set([...schedule.map((b) => format(b.startDatetime, "yyyyMMdd"))]);

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
          <Tabs defaultValue="schedule" className="w-full">
            <TabsList className="w-full justify-start overflow-x-auto">
              <TabsTrigger value="schedule" className="text-sm sm:text-base">
                Schedule
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

            <TabsContent value="schedule">
              <div className="mt-4">
                <div className="space-y-4">
                  {sortedDates.map((date) => {
                    const schedule = scheduleByDate[date] ?? [];
                    const dateStr = format(parseISO(date), "EEEE, MMMM d, yyyy");

                    // Group inventories by service
                    const scheduleByService = schedule.reduce(
                      (acc, booking) => {
                        const service = servicesMap[booking.serviceId];
                        const serviceName = service?.name ?? "Unknown Service";
                        if (!acc[serviceName]) {
                          acc[serviceName] = [];
                        }
                        acc[serviceName].push(booking);
                        return acc;
                      },
                      {} as Record<string, Schedule[]>,
                    );

                    return (
                      <Card key={dateStr} className="overflow-hidden border-2 shadow-sm">
                        <CardHeader className="bg-gray-300/50 p-3">
                          <CardTitle className="text-xl font-semibold text-gray-900">{dateStr}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-3 space-y-4">
                          {Object.entries(scheduleByService).map(([serviceName, serviceSchedule]) => (
                            <div key={serviceName} className="space-y-2">
                              <h3 className="text-sm font-medium text-gray-700">{serviceName}</h3>
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                {serviceSchedule.map((schedule) => {
                                  return (
                                    <Card key={schedule.id} className="border-1 hover:shadow-md shadow-sm transition-shadow">
                                      <CardContent className="p-3">
                                        <div className="flex items-center justify-between">
                                          <div className="space-y-1">
                                            <div className="text-sm font-medium text-gray-900">{format(schedule.startDatetime, "HH:mm")}</div>
                                            <div className="text-xs text-gray-500">{schedule.durationMinutes} minutes</div>
                                            {schedule.price && (
                                              <div className="text-xs text-gray-500 mt-3">
                                                {schedule.price} {schedule.currency}
                                              </div>
                                            )}
                                          </div>

                                          {schedule?.isAvailable && (
                                            <BookingDialog
                                              email={email}
                                              contactMethod="email"
                                              contactWhatsAppId={contactWhatsAppId}
                                              contactLineId={contactLineId}
                                              venueId={venue.id}
                                              venueName={venue.name}
                                              serviceName={serviceName}
                                              serviceId={schedule.serviceId}
                                              date={date}
                                              startDatetime={schedule.startDatetime}
                                              endDatetime={schedule.endDatetime}
                                              timezone={schedule.timezone}
                                              durationMinutes={schedule.durationMinutes}
                                              paymentImage={schedule.paymentImage ?? undefined}
                                              price={schedule.price}
                                              currency={schedule.currency}
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

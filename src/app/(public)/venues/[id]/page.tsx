import { alwaysbookbooked } from "@/lib/alwaysbookbooked";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Phone } from "lucide-react";
import BookingDialog from "@/components/client/booking-dialog";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

type Schedule = {
  isAvailable: boolean;
  id: string;
  serviceId: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  timezone: string;
  price: string | null;
  currency: string | null;
  status: string;
  createdById: string;
  createdAt: Date;
  paymentImage: string | null;
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

  const venue = await alwaysbookbooked.venues.publicFind(id);
  const availableSchedule = await alwaysbookbooked.venues.publicAvailability(id);

  if (!venue) {
    return <div>Venue not found</div>;
  }

  const services = venue?.services;

  const servicesMap = services?.reduce(
    (acc, service) => {
      acc[service.id] = service;
      return acc;
    },
    {} as Record<string, (typeof services)[number]>,
  );

  // Group by date
  const scheduleByDate = availableSchedule.reduce(
    (acc, slots) => {
      // Format the date in the venue's timezone
      const sortDate = slots.startDate;

      if (!acc[sortDate]) {
        acc[sortDate] = [];
      }

      const processedSchedule = {
        ...slots,
        startHourNumber: slots.startTime,
        endHourNumber: slots.endTime,
      };

      acc[sortDate].push(processedSchedule as unknown as Schedule);
      return acc;
    },
    {} as Record<string, Schedule[]>,
  );

  // Get all unique dates from both bookings and inventories
  const allDates = new Set([...availableSchedule.map((b) => b.startDate)]);

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
                  <span className="text-sm sm:text-base">{venue.phone}</span>
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
                      <CardDescription className="text-sm sm:text-base">{service.description}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="schedule">
              <div className="mt-4">
                <div className="space-y-4">
                  {sortedDates.map((date) => {
                    const scheduleDate = scheduleByDate[date] ?? [];
                    // Group by service in a single pass
                    const scheduleByService = scheduleDate.reduce(
                      (acc, booking) => {
                        const serviceName = servicesMap[booking.serviceId]?.name ?? "Unknown Service";
                        if (!acc[serviceName]) {
                          acc[serviceName] = [];
                        }
                        acc[serviceName].push(booking);
                        return acc;
                      },
                      {} as Record<string, Schedule[]>,
                    );

                    return (
                      <Card key={date} className="overflow-hidden border-2 shadow-sm">
                        <CardHeader className="bg-gray-300/50 p-3">
                          <CardTitle className="text-xl font-semibold text-gray-900">{date}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-3 space-y-4">
                          {Object.entries(scheduleByService).map(([serviceName, serviceSchedule]) => (
                            <div key={serviceName} className="space-y-2">
                              <h3 className="text-sm font-medium text-gray-700">{serviceName}</h3>
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                {serviceSchedule.map((schedule) => (
                                  <Card key={schedule.id} className="border-1 hover:shadow-md shadow-sm transition-shadow">
                                    <CardContent className="p-3">
                                      <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                          <div className="text-sm font-medium text-gray-900">{schedule.startHourNumber}</div>
                                          <div className="text-xs text-gray-500">{schedule.durationMinutes} minutes</div>
                                          {schedule.price && (
                                            <div className="text-xs text-gray-500 mt-3">
                                              {schedule.price} {schedule.currency}
                                            </div>
                                          )}
                                        </div>

                                        <BookingDialog
                                          email={email}
                                          contactMethod="email"
                                          contactWhatsAppId={contactWhatsAppId}
                                          contactLineId={contactLineId}
                                          venueId={venue.id}
                                          venueName={venue.name}
                                          serviceId={schedule.serviceId}
                                          serviceName={serviceName}
                                          serviceDescription={servicesMap[schedule.serviceId]?.description ?? ""}
                                          startDate={schedule.startDate}
                                          endDate={schedule.endDate}
                                          startTime={schedule.startTime}
                                          endTime={schedule.endTime}
                                          durationMinutes={schedule.durationMinutes}
                                          paymentImage={schedule.paymentImage ?? undefined}
                                          price={schedule.price}
                                          currency={schedule.currency}
                                        />
                                      </div>
                                    </CardContent>
                                  </Card>
                                ))}
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

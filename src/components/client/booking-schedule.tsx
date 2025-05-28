"use client";

import { useState } from "react";
import { format, addMinutes, isEqual, parse, isAfter, isBefore } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import BookingDialog from "@/components/client/booking-dialog";

type Schedule = {
  isAvailable: boolean;
  bookingType: "single" | "group";
  id: string;
  serviceId: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  price: string;
  currency: string;
  paymentImage: string;
  paymentType: string;
  inventoryType: "spot" | "recurring";
};

type Service = {
  id: string;
  name: string;
  description: string | null;
};

type VenueBookingEnhancedProps = {
  email: string;
  contactWhatsAppId: string | null;
  contactLineId: string | null;
  venueId: string;
  venueName: string;
  services: Service[];
  availableSchedule: Schedule[];
};

// Add this new component before the main BookingSchedule component
function MobileScheduleView({
  services,
  scheduleByService,
  allTimeSlots,
  getSlotStatus,
  email,
  contactWhatsAppId,
  contactLineId,
  venueId,
  venueName,
}: {
  services: Service[];
  scheduleByService: Record<string, Schedule[]>;
  allTimeSlots: { startTime: string; endTime: string; duration: number }[];
  getSlotStatus: (slot: { startTime: string; endTime: string }, serviceSchedule: Schedule[]) => { status: "your" | "available" | "unavailable"; schedule?: Schedule; isPartOfLongerSlot?: boolean };
  email: string;
  contactWhatsAppId: string | null;
  contactLineId: string | null;
  venueId: string;
  venueName: string;
}) {
  return (
    <div className="space-y-6">
      {services.map((service) => {
        const serviceSchedule = scheduleByService[service.id] || [];
        const availableSlots = allTimeSlots.filter((slot) => {
          const { status } = getSlotStatus(slot, serviceSchedule);
          return status === "available";
        });

        if (availableSlots.length === 0) {
          return (
            <div key={service.id} className="space-y-2">
              <h3 className="font-medium text-gray-700">{service.name}</h3>
              <div className="text-center py-4 text-gray-500">Not available</div>
            </div>
          );
        }

        return (
          <div key={service.id} className="space-y-2">
            <h3 className="font-medium text-gray-700">{service.name}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {availableSlots.map((slot) => {
                const { schedule } = getSlotStatus(slot, serviceSchedule);
                return (
                  <div key={`${service.id}-${slot.startTime}-${slot.endTime}`} className="border rounded-lg p-2 bg-green-100 text-green-800 border-green-300 hover:bg-green-200">
                    <div className="text-center">
                      <div className="text-sm font-medium">{slot.startTime}</div>
                      {schedule && (
                        <BookingDialog
                          bookingType={schedule.bookingType}
                          email={email}
                          contactMethod="email"
                          contactWhatsAppId={contactWhatsAppId ?? ""}
                          contactLineId={contactLineId ?? ""}
                          venueId={venueId}
                          venueName={venueName}
                          serviceId={schedule.serviceId}
                          serviceName={service.name}
                          serviceDescription={service.description ?? ""}
                          startDate={schedule.startDate}
                          endDate={schedule.endDate}
                          startTime={schedule.startTime}
                          endTime={schedule.endTime}
                          durationMinutes={schedule.durationMinutes}
                          price={schedule.price}
                          currency={schedule.currency}
                          paymentType={schedule.paymentType as "manual_prepaid" | "reservation_only" | "stripe_prepaid"}
                          paymentImage={schedule.paymentImage ?? undefined}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function BookingSchedule({ email, contactWhatsAppId, contactLineId, venueId, venueName, services, availableSchedule }: VenueBookingEnhancedProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));

  // Group by date
  const scheduleByDate = availableSchedule.reduce(
    (acc, slots) => {
      const sortDate = slots.startDate;
      if (!acc[sortDate]) {
        acc[sortDate] = [];
      }
      acc[sortDate].push(slots);
      return acc;
    },
    {} as Record<string, Schedule[]>,
  );

  // Get all unique dates
  const allDates = Array.from(new Set(availableSchedule.map((b) => b.startDate))).sort();

  // Filter services by category
  const filteredServices = selectedCategory === "all" ? services : services.filter((service) => service.name.toLowerCase().includes(selectedCategory.toLowerCase()));

  // Get schedule for selected date
  const selectedDateSchedule = scheduleByDate[selectedDate] || [];

  // Group schedule by service
  const scheduleByService = selectedDateSchedule.reduce(
    (acc, booking) => {
      const serviceName = services.find((s) => s.id === booking.serviceId)?.id ?? "Unknown Service";
      if (!acc[serviceName]) {
        acc[serviceName] = [];
      }
      acc[serviceName].push(booking);
      return acc;
    },
    {} as Record<string, Schedule[]>,
  );

  // Helper to generate all time slots for a service on a given day
  function generateTimeSlots(serviceSchedule: Schedule[]): { startTime: string; endTime: string; duration: number }[] {
    // If no schedule, return empty array
    if (serviceSchedule.length === 0) {
      return [];
    }

    // Sort schedule by start time to ensure consistent order
    const sortedSchedule = [...serviceSchedule].sort((a, b) => a.startTime.localeCompare(b.startTime));

    // Generate 1-hour slots for display
    const displaySlots: { startTime: string; endTime: string; duration: number }[] = [];
    const processedSlots = new Set<string>();

    for (const slot of sortedSchedule) {
      const start = parse(slot.startTime, "HH:mm", new Date());
      const end = parse(slot.endTime, "HH:mm", new Date());
      let current = start;

      while (isBefore(current, end) || isEqual(current, end)) {
        const slotStart = format(current, "HH:mm");
        const slotEnd = format(addMinutes(current, 60), "HH:mm");

        // Skip if we've already processed this time slot
        const slotKey = `${slotStart}-${slotEnd}`;
        if (processedSlots.has(slotKey)) {
          current = addMinutes(current, 60);
          continue;
        }

        // Only add the slot if it doesn't exceed the original slot's end time
        if (!isAfter(parse(slotEnd, "HH:mm", new Date()), end)) {
          displaySlots.push({
            startTime: slotStart,
            endTime: slotEnd,
            duration: 60, // Display slots are always 1 hour
          });
          processedSlots.add(slotKey);
        }

        current = addMinutes(current, 60);
      }
    }

    return displaySlots;
  }

  // Helper to determine slot status
  function getSlotStatus(
    slot: { startTime: string; endTime: string },
    serviceSchedule: Schedule[],
  ): { status: "your" | "available" | "unavailable"; schedule?: Schedule; isPartOfLongerSlot?: boolean } {
    // Find a slot that contains this time slot
    const found = serviceSchedule.find((s) => {
      const slotStart = parse(slot.startTime, "HH:mm", new Date());
      const slotEnd = parse(slot.endTime, "HH:mm", new Date());
      const scheduleStart = parse(s.startTime, "HH:mm", new Date());
      const scheduleEnd = parse(s.endTime, "HH:mm", new Date());

      // Check if this slot falls within the schedule slot
      return (isEqual(slotStart, scheduleStart) || isAfter(slotStart, scheduleStart)) && (isEqual(slotEnd, scheduleEnd) || isBefore(slotEnd, scheduleEnd));
    });

    if (found) {
      // Only mark as available if this is the first hour of the slot
      const isFirstHour = isEqual(parse(slot.startTime, "HH:mm", new Date()), parse(found.startTime, "HH:mm", new Date()));
      if (found.isAvailable) {
        if (isFirstHour) {
          return { status: "available", schedule: found };
        }
        return { status: "unavailable", schedule: found, isPartOfLongerSlot: true };
      }
      return { status: "unavailable", schedule: found };
    }
    return { status: "unavailable" };
  }

  // Generate all time slots for the selected date
  const allTimeSlots = generateTimeSlots(selectedDateSchedule);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Services</SelectItem>
            <SelectItem value="tennis">Tennis</SelectItem>
            <SelectItem value="pickleball">Pickleball</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedDate} onValueChange={setSelectedDate}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue>{selectedDate === format(new Date(), "yyyy-MM-dd") ? "Today" : format(new Date(selectedDate), "MMM dd, yyyy")}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={format(new Date(), "yyyy-MM-dd")}>Today</SelectItem>
            {allDates
              .filter((date) => date !== format(new Date(), "yyyy-MM-dd"))
              .map((date) => (
                <SelectItem key={date} value={date}>
                  {format(new Date(date), "MMM dd, yyyy")}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      {selectedDateSchedule.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-lg text-gray-600">No available slots for {selectedDate === format(new Date(), "yyyy-MM-dd") ? "today" : format(new Date(selectedDate), "MMMM dd, yyyy")}</p>
          <p className="text-sm text-gray-500 mt-2">Please try another date or check back later.</p>
        </div>
      ) : (
        <>
          {/* Desktop View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border-collapse table-fixed">
              <thead>
                <tr>
                  <th className="w-[200px] p-2 text-left font-semibold text-gray-700 border-b">Service</th>
                  {allTimeSlots.map((slot) => (
                    <th key={`${slot.startTime}-${slot.endTime}`} className="w-[80px] p-2 text-center font-medium text-sm border-b">
                      {slot.startTime}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredServices.map((service) => {
                  const serviceSchedule = scheduleByService[service.id] || [];
                  const availableSlots = allTimeSlots.filter((slot) => {
                    const { status } = getSlotStatus(slot, serviceSchedule);
                    return status === "available";
                  });

                  if (availableSlots.length === 0) {
                    return (
                      <tr key={service.id}>
                        <td className="w-[50px] p-2 font-medium text-gray-700 border-b">{service.name}</td>
                        <td colSpan={allTimeSlots.length} className="p-2 text-center text-gray-500 border-b">
                          Not available
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr key={service.id}>
                      <td className="w-[50px] p-2 font-medium text-gray-700 border-b">{service.name}</td>
                      {allTimeSlots.map((slot) => {
                        const { status, schedule } = getSlotStatus(slot, serviceSchedule);
                        let color = "";
                        if (status === "available") {
                          color = "bg-green-100 text-green-800 border-green-300 hover:bg-green-200";
                        } else {
                          color = "bg-gray-100 text-gray-400 border-gray-200";
                        }
                        return (
                          <td key={`${service.id}-${slot.startTime}-${slot.endTime}`} className="w-[80px] border-b">
                            <div className={`border flex flex-col items-center justify-center ${color} h-[80px]`}>
                              {status === "available" && schedule && (
                                <BookingDialog
                                  bookingType={schedule.bookingType}
                                  email={email}
                                  contactMethod="email"
                                  contactWhatsAppId={contactWhatsAppId ?? ""}
                                  contactLineId={contactLineId ?? ""}
                                  venueId={venueId}
                                  venueName={venueName}
                                  serviceId={schedule.serviceId}
                                  serviceName={service.name}
                                  serviceDescription={service.description ?? ""}
                                  startDate={schedule.startDate}
                                  endDate={schedule.endDate}
                                  startTime={schedule.startTime}
                                  endTime={schedule.endTime}
                                  durationMinutes={schedule.durationMinutes}
                                  price={schedule.price}
                                  currency={schedule.currency}
                                  paymentType={schedule.paymentType as "manual_prepaid" | "reservation_only" | "stripe_prepaid"}
                                  paymentImage={schedule.paymentImage ?? undefined}
                                />
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile View */}
          <div className="md:hidden">
            <MobileScheduleView
              services={filteredServices}
              scheduleByService={scheduleByService}
              allTimeSlots={allTimeSlots}
              getSlotStatus={getSlotStatus}
              email={email}
              contactWhatsAppId={contactWhatsAppId}
              contactLineId={contactLineId}
              venueId={venueId}
              venueName={venueName}
            />
          </div>
        </>
      )}
    </div>
  );
}

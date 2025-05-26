"use server";

import { auth } from "@/server/auth";
import { alwaysbookbooked } from "@/lib/alwaysbookbooked";
import { revalidatePath } from "next/cache";

export async function createBooking({
  bookingType,
  venueId,
  serviceId,
  serviceName,
  serviceDescription,
  startDate,
  endDate,
  startTime,
  endTime,
  price,
  currency,
  paymentType,
  paymentImage,
  customerContactMethod,
  customerContactId,
  notes,
}: {
  bookingType: "single" | "group";
  venueId: string;
  serviceId: string;
  serviceName: string;
  serviceDescription: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  price: string;
  currency: string;
  paymentType: "manual_prepaid" | "reservation_only" | "stripe_prepaid";
  paymentImage: string | null;
  customerContactMethod: string;
  customerContactId: string;
  notes: string | null;
}) {
  const session = await auth();

  if (!session?.user?.id || !session.user?.email) {
    throw new Error("Unauthorized");
  }

  let booking: { id: string } | undefined;

  if (bookingType === "single") {
    booking = await alwaysbookbooked.bookings.create({
      serviceId,
      serviceName,
      serviceDescription,
      startDate,
      endDate,
      startTime,
      endTime,
      price,
      currency,
      paymentType,
      paymentImage,
      notes,
      customerContactMethod,
      customerContactId,
    });
  }

  if (bookingType === "group") {
    booking = await alwaysbookbooked.bookingGroups.create({
      serviceId,
      serviceName,
      serviceDescription,
      startDate,
      endDate,
      startTime,
      endTime,
      price,
      currency,
      paymentType,
      paymentImage,
      notes,
      customerContactMethod,
      customerContactId,
    });
  }

  revalidatePath(`/venues/${venueId}`);

  return booking;
}

// export async function updateBooking(bookingId: string, serviceId: string, customerContactMethod: string, customerContactId: string, notes: string | null) {
//   const session = await auth();

//   if (!session?.user?.id || !session.user?.email) {
//     throw new Error("Unauthorized");
//   }

//   await alwaysbookbooked.bookings.update({
//     id: bookingId,
//     customerContactMethod,
//     customerContactId,
//     status: "pending",
//     notes: notes ?? null,
//   });

//   revalidatePath(`/venues/${serviceId}`);
// }

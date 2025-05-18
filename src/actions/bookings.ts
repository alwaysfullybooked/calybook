"use server";

import { auth } from "@/server/auth";
import { alwaysbookbooked } from "@/lib/alwaysbookbooked";
import { revalidatePath } from "next/cache";

export async function createBooking({
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
  customerContactMethod,
  customerContactId,
  notes,
}: {
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
  customerContactMethod: string;
  customerContactId: string;
  notes: string | null;
}) {
  const session = await auth();

  if (!session?.user?.id || !session.user?.email) {
    throw new Error("Unauthorized");
  }

  await alwaysbookbooked.bookings.create({
    serviceId,
    serviceName,
    serviceDescription,
    startDate,
    endDate,
    startTime,
    endTime,
    price,
    currency,
    notes,
    customerContactMethod,
    customerContactId,
  });

  revalidatePath(`/venues/${venueId}`);
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

"use server";

import { auth } from "@/server/auth";
import { alwaysbookbooked } from "@/lib/alwaysbookbooked";
import { revalidatePath } from "next/cache";

export async function createBooking({
  venueId,
  serviceId,
  serviceName,
  startDatetime,
  endDatetime,
  timezone,
  price,
  currency,
  customerContactMethod,
  customerContactId,
  notes,
}: {
  venueId: string;
  serviceId: string;
  serviceName: string;

  startDatetime: Date;
  endDatetime: Date;
  timezone: string;
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
    startDatetime: startDatetime.toISOString(),
    endDatetime: endDatetime.toISOString(),
    timezone,
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

"use server";

import { auth } from "@/server/auth";
import { alwaysbookbooked } from "@/lib/alwaysbookbooked";
import { revalidatePath } from "next/cache";

export async function updateBooking(bookingId: string, serviceId: string, customerContactMethod: string, customerContactId: string, notes: string | null) {
  const session = await auth();

  if (!session?.user?.id || !session.user?.email) {
    throw new Error("Unauthorized");
  }

  console.log("updateBooking", {
    id: bookingId,
    serviceId,
    customerContactMethod,
    customerContactId,
    status: "pending",
    notes: notes ?? null,
  });

  await alwaysbookbooked.bookings.update({
    id: bookingId,
    customerContactMethod,
    customerContactId,
    status: "pending",
    notes: notes ?? null,
  });

  revalidatePath(`/venues/${serviceId}`);
}

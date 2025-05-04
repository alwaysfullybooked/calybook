"use server";

import { alwaysbookbooked } from "@/lib/alwaysbookbooked";
import { revalidatePath } from "next/cache";

export async function createBooking(
  email: string,
  serviceId: string,
  serviceName: string,
  serviceType: string,
  serviceIndoor: boolean,
  price: string,
  currency: string,
  startDatetime: Date,
  endDatetime: Date,
  timezone: string,
  notes: string | null
) {
  const { hashWithSignature } = await alwaysbookbooked.integrations.generateHash(email);
  const customerHash = hashWithSignature.split(":")[0];

  if (!customerHash) {
    throw new Error("Failed to generate customer hash");
  }

  await alwaysbookbooked.bookings.create({
    serviceId,
    serviceName,
    serviceType,
    serviceIndoor,
    customerHash,
    startDatetime,
    endDatetime,
    timezone,
    price,
    currency,
    status: "pending",
    notes: notes ?? null,
  });

  revalidatePath(`/venues/${serviceId}`);
}

"use server";

import { alwaysbookbooked } from "@/lib/alwaysbookbooked";
import { revalidatePath } from "next/cache";

export async function createBooking(
  customerId: string,
  customerContactMethod: string,
  customerContactId: string,
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
  await alwaysbookbooked.bookings.create({
    customerId,
    customerContactMethod,
    customerContactId,
    serviceId,
    serviceName,
    serviceType,
    serviceIndoor,
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

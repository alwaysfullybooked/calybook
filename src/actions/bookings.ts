"use server";

import { auth } from "@/server/auth";
import { alwaysbookbooked } from "@/lib/alwaysbookbooked";
import { revalidatePath } from "next/cache";

export async function createBooking({
  type,
  venueId,
  serviceId,
  startDate,
  endDate,
  startTime,
  endTime,
  quantity,
  price,
  currency,
  paymentType,
  paymentImage,
  customerName,
  customerContactMethod,
  customerContactId,
  customerEmailId,
  notes,
}: {
  type: "single" | "group";
  venueId: string;
  serviceId: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  quantity: number;
  price: string;
  currency: string;
  paymentType: "manual_prepaid" | "reservation_only" | "stripe_prepaid";
  paymentImage: string | null;
  customerName: string;
  customerContactMethod: string;
  customerContactId: string;
  customerEmailId: string;
  notes: string | null;
}) {
  const session = await auth();

  if (!session?.user?.id || !session.user?.email) {
    throw new Error("Unauthorized");
  }
  const result = await alwaysbookbooked.bookings.create({
    type,
    serviceId,
    startDate,
    endDate,
    startTime,
    endTime,
    quantity,
    price,
    currency,
    paymentType,
    paymentImage,
    notes,
    customerName,
    customerContactMethod,
    customerContactId,
    customerEmailId,
  });

  revalidatePath(`/venues/${venueId}`);

  return result;
}

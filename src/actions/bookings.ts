"use server";

import { auth } from "@/server/auth";
import { alwaysfullybooked } from "@/lib/alwaysfullybooked";
import { revalidatePath } from "next/cache";

export async function createBooking({
  country,
  lang,
  city,

  bookingType,
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
  country: string;
  lang: string;
  city: string;

  bookingType: "single" | "group";
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
  const result = await alwaysfullybooked.bookings.create({
    bookingType,
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

  revalidatePath(`/${country}/${lang}/${city}/venues/${venueId}`);

  return result;
}

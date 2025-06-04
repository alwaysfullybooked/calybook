import { AlwaysFullyBooked } from "@alwaysfullybooked/sdk-node";
import { env } from "@/env";

const apiKey = env.AFB_API_KEY;
const baseUrl = env.AFB_API_URL;

if (!apiKey) {
  throw new Error("AFB_API_KEY is not set");
}

if (!baseUrl) {
  throw new Error("AFB_API_URL is not set");
}

export const alwaysbookbooked = new AlwaysFullyBooked({
  apiKey,
  baseUrl,
});

export type Booking = Awaited<ReturnType<typeof alwaysbookbooked.bookings.searchCustomerBookings>>[number];

export type Venue = Awaited<ReturnType<typeof alwaysbookbooked.venues.search>>[number] & { courts: number | null; price: string | null; amenities: string[] | null };

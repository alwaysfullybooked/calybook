import { env } from "@/env";
import { AlwaysFullyBooked } from "@alwaysfullybooked/alwaysfullybooked-sdk-node";

const apiKey = env.ALWAYSFULLYBOOKED_API_KEY;
const baseUrl = env.ALWAYSFULLYBOOKED_API_URL;

if (!apiKey) {
  throw new Error("ALWAYSFULLYBOOKED_API_KEY is not set");
}

if (!baseUrl) {
  throw new Error("ALWAYSFULLYBOOKED_API_URL is not set");
}

export const alwaysfullybooked = new AlwaysFullyBooked({
  apiKey,
  baseUrl,
});

export type Booking = Awaited<ReturnType<typeof alwaysfullybooked.bookings.searchCustomerBookings>>[number];

export type Service = Awaited<ReturnType<typeof alwaysfullybooked.services.search>>[number];

export type Venue = Awaited<ReturnType<typeof alwaysfullybooked.venues.publicSearch>>[number];

export type MatchVenues = Venue & {
  courts: number;
  price: string;
  amenities: string[];
};

export type MoreVenues = {
  altName: string;
  altAddress: string;
  courts: { tennis: { count: number; price: number } };
  amenities: string[];
  image: string;
  city: string;
  country: string;
};

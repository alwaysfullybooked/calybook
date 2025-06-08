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

export type Service = Awaited<ReturnType<typeof alwaysbookbooked.services.search>>[number];

export type Venue = Awaited<ReturnType<typeof alwaysbookbooked.venues.publicSearch>>[number];

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

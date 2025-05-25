import { AlwaysFullyBooked } from "@alwaysfullybooked/sdk";
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

import { env } from "@/env";
import { getCountrySlug, locations } from "@/lib/locations";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { type Message, streamText, tool } from "ai";
import { z } from "zod";
import { alwaysfullybooked } from "./alwaysfullybooked";

const openrouter = createOpenRouter({
  apiKey: env.OPENROUTER_API_KEY,
});

// const model = openrouter.chat("meta-llama/llama-4-scout");
const model = openrouter.chat("google/gemini-2.5-flash-lite-preview-06-17");

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

export async function streamChat({ messages, country, name, email }: { messages: Message[]; country: string; name: string; email: string }) {
  const tools = {
    cities_search: tool({
      description: `Search for cities in ${country}`,
      parameters: z.object({}),
      execute: async () => {
        const countryCode = getCountrySlug(country);
        return locations[countryCode as keyof typeof locations]?.cities.map((city) => city.label) ?? [];
      },
    }),
    venues_search: tool({
      description: `Search for venues in ${country}`,
      parameters: z.object({
        city: z.string().describe("The city to search for venues in"),
      }),
      execute: async ({ city }) => {
        const result = await alwaysfullybooked.venues.publicSearch({ country, city });

        return result;
      },
    }),
    venues_find: tool({
      description: "Find a venue",
      parameters: z.object({
        venueId: z.string().describe("The ID of the venue to find"),
      }),
      execute: async ({ venueId }: { venueId: string }) => {
        const result = await alwaysfullybooked.venues.publicFind({ venueId });
        return result;
      },
    }),
    venues_availability: tool({
      description: "Get availability for a venue",
      parameters: z.object({
        venueId: z.string().describe("The ID of the venue to get availability for"),
        localDateString: z.string().describe("The local date string to get availability for"),
      }),
      execute: async ({ venueId, localDateString }) => {
        const result = await alwaysfullybooked.venues.publicAvailability({ venueId, localDateString });
        return result;
      },
    }),
    services_availability: tool({
      description: "Get availability for a service",
      parameters: z.object({
        serviceId: z.string().describe("The ID of the service to get availability for"),
        localDateString: z.string().describe("The local date string to get availability for"),
      }),
      execute: async (params: { serviceId: string; localDateString: string }) => {
        const result = await alwaysfullybooked.services.publicAvailability(params);
        return result;
      },
    }),
    bookings_create: tool({
      description:
        "Finalizes and submit a booking request for a specific time slot. You MUST get the required parameters from the user and from the specific slot selected from the output of the 'services_availability' tool. Do not guess any parameters.",
      parameters: z.object({
        bookingType: z.enum(["single", "group"]).describe("The type of the booking"),
        serviceId: z.string().describe("The ID of the service to book"),
        startDate: z.string().regex(dateRegex, "Date must be in YYYY-MM-DD format").describe("The start date of the booking"),
        endDate: z.string().regex(dateRegex, "Date must be in YYYY-MM-DD format").describe("The end date of the booking"),
        startTime: z.string().regex(timeRegex, "Time must be in HH:mm format").describe("The start time of the booking"),
        endTime: z.string().regex(timeRegex, "Time must be in HH:mm format").describe("The end time of the booking"),
        quantity: z.number().min(1).describe("The quantity of slots to book"),
        price: z.string().describe("The price of the booking"),
        currency: z.string().length(3).describe("The currency of the booking (3-letter code)"),
        paymentType: z.enum(["manual_prepaid", "stripe_prepaid", "reservation_only"]).describe("The payment type of the booking"),
        paymentImage: z.string().nullable().optional().describe("The payment image of the booking"),
        notes: z.string().nullable().optional().describe("The notes of the booking"),
      }),
      execute: async (params) => {
        const result = await alwaysfullybooked.bookings.create({
          ...params,
          customerName: name,
          customerEmailId: email,
          customerContactMethod: "email",
          customerContactId: email,
        });

        return result;
      },
    }),
  };

  const result = streamText({
    model,
    messages,
    tools,
    toolChoice: "auto",
    maxSteps: 100,

    onError({ error }) {
      console.error(error);
    },
  });

  return result.toDataStreamResponse();
}

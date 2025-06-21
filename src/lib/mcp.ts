import { env } from "@/env";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { tool, streamText, type Message, StreamData } from "ai";
import { z } from "zod";
import { alwaysfullybooked } from "./alwaysfullybooked";
import { getCountrySlug, locations } from "@/lib/locations";

const openrouter = createOpenRouter({
  apiKey: env.OPENROUTER_API_KEY,
});

// const model = openrouter.chat("meta-llama/llama-3.3-70b-instruct:free");
const model = openrouter.chat("meta-llama/llama-3.3-8b-instruct:free");

// Date format validation
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

const bookingCreateSchema = z.object({
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
  customerName: z.string().min(1).describe("The full name of the customer"),
  customerContactMethod: z.enum(["email"]).describe("The method of contact for the customer"),
  customerContactId: z.string().email().describe("The contact email of the customer"),
  customerEmailId: z.string().email().describe("The email of the customer"),
});

export async function streamWithTools({
  messages,
}: {
  messages: Message[];
}) {
  const tools = {
    "cities.search": tool({
      description: "Search for cities for a country",
      parameters: z.object({
        country: z.string().describe("The country to search for cities in"),
      }),
      execute: async ({ country }) => {
        const countryCode = getCountrySlug(country);
        return locations[countryCode as keyof typeof locations]?.cities.map((city) => city.label) ?? [];
      },
    }),

    "venues.search": tool({
      description: "Search for venues",
      parameters: z.object({
        country: z.string().describe("The country to search for venues in"),
        city: z.string().describe("The city to search for venues in"),
      }),
      execute: async ({ country, city }) => {
        return await alwaysfullybooked.venues.publicSearch({ country, city });
      },
    }),
    "venues.find": tool({
      description: "Find a venue",
      parameters: z.object({
        venueId: z.string().describe("The ID of the venue to find"),
      }),
      execute: async ({ venueId }: { venueId: string }) => {
        return await alwaysfullybooked.venues.publicFind({ venueId });
      },
    }),
    "venues.availability": tool({
      description: "Get availability for a venue",
      parameters: z.object({
        venueId: z.string().describe("The ID of the venue to get availability for"),
        localDateString: z.string().describe("The local date string to get availability for"),
      }),
      execute: async ({ venueId, localDateString }) => {
        return await alwaysfullybooked.venues.publicAvailability({ venueId, localDateString });
      },
    }),
    "services.availability": tool({
      description: "Get availability for a service",
      parameters: z.object({
        serviceId: z.string().describe("The ID of the service to get availability for"),
        localDateString: z.string().describe("The local date string to get availability for"),
      }),
      execute: async ({ serviceId, localDateString }) => {
        return await alwaysfullybooked.services.publicAvailability({ serviceId, localDateString });
      },
    }),
    "bookings.create": tool({
      description: "Create a booking",
      parameters: bookingCreateSchema,
      execute: async (params: z.infer<typeof bookingCreateSchema>) => {
        return await alwaysfullybooked.bookings.create(params);
      },
    }),
  };

  const result = streamText({
    model,
    messages,
    tools,
    toolChoice: "required",
    toolCallStreaming: true,
    maxSteps: 10,
  });

  return result.toDataStreamResponse();
}

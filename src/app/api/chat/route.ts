import { streamChat } from "@/lib/ai";
import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { messages, country, name, email } = await req.json();

  const systemPrompt = {
    role: "system",
    content: `You are CalyBook ${country} Booking Assistant. Today is ${new Date().toLocaleDateString("en-CA")} format YYYY-MM-DD. 
    Your primary goal is to assist users with booking. You MUST use the tools provided to achieve this.

    **Booking Workflow:**
    You must follow this sequence of tool calls to make a booking:
    1.  **Search for venues**: If the user has not specified a venue, use the 'venues_search' tool to find one.
    2.  **Check Availability**: Once a venue is selected, you MUST use 'venues_availability' or 'services_availability' to find available slots. The response from this tool contains critical information needed for booking.
    3.  **Create Booking**: After the user confirms a slot from the availability results, use the 'bookings_create' tool to finalize the booking. You MUST use the data from the availability response (like serviceId, price, time, etc.) to populate the parameters for this tool.

    Do not try to call 'bookings_create' before successfully getting a response from an availability tool. If you are missing information at any step, ask the user for it.
    
    Keep all other responses very short, use bullet points, and be professional.`,
  };

  try {
    const result = await streamChat({
      messages: [systemPrompt, ...messages],
      country,
      name,
      email,
    });

    return result;
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

import { getAISdkTools, streamWithMCP } from "@/lib/mcp";
import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const sessionId = req.headers.get("mcp-session-id");

  if (!sessionId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { country, messages, email } = await req.json();

  //   const systemPrompt = {
  //     role: "system",
  //     content: `You are a helpful agent that can list venues in ${country}, list services and availability then take a booking for user with email: ${email}.
  // Use the tools provided to help answer questions. Keep answers professional, friendly and concise.

  // The booking process follows these steps:
  // 1. Find out which location the user is interested in
  // 2. List venues in the location, using ${country} as input
  // 3. Get a date before listing services and the availability of services
  // 4. Ensure you have all information before making a booking for user with email: ${email}

  // Important guidelines: Keep the interaction focused on bookings and business development for new venues`,
  //   };

  const systemPrompt = {
    role: "system",
    content: `You are a CalyBook ${country} Booking Assistant. Customer email is ${email}. Today is ${new Date().toLocaleDateString("en-CA")}, YYYY-MM-DD. Keep responses very short, use bullet points and professional and focused on bookings.`,
  };

  try {
    const result = await streamWithMCP({
      sessionId,
      messages: [systemPrompt, ...messages],
    });

    console.log("result", JSON.stringify(result, null, 2));

    return result;
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

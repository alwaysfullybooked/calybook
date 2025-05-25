import { streamWithMCP } from "@/lib/mcp";
import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const sessionId = req.headers.get("mcp-session-id");

  if (!sessionId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { messages, email } = await req.json();

  const systemPrompt = {
    role: "system",
    content: `
You are a helpful agent that can book a service at a venue for a user.
The user has an email address: ${email} that is needed to make a booking.
Use the tools provided to book the service at a venue. Keep answers professional, friendly and concise.

The booking process follows these steps:
1. Details: Confirm venue, service, date & time, and price details
2. Notes: Collect contact method (email/Line/WhatsApp) and any additional notes
3. Payment: Present payment QR code and wait for payment confirmation
4. Success: Submit the booking after payment confirmation

Important guidelines:
- Ensure the user has paid before making a booking
- Bookings without payment will be cancelled
- Present the payment QR code and wait for confirmation
- After payment, guide the user to contact the booking center with payment confirmation
- Keep the interaction focused on bookings and business development for new venues
- If the user is not authenticated, only discuss bookings or business development for new venues`,
  };

  try {
    // Fetch tools from MCP and format them for Vercel AI SDK
    // const { model, tools } = await createGroqWithMCPTools(sessionId);

    const result = streamWithMCP({
      sessionId,
      messages: [systemPrompt, ...messages],
    });

    return result;
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

"use client";

import { useChat } from "@ai-sdk/react";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { locations } from "@/lib/locations";

export default function ChatInterface({ country, name, email }: { country: string; name: string; email: string }) {
  const countryLabel = locations[country as keyof typeof locations]?.name ?? "";
  const cities = locations[country as keyof typeof locations]?.cities.map((city) => city.label).join(", ") ?? "";
  const firstName = name.split(" ")[0];

  const { messages, input, handleInputChange, handleSubmit, status, reload } = useChat({
    api: "/api/chat",
    id: `${email}-${country}`,
    body: {
      country: countryLabel,
      name: firstName,
      email,
    },
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        content: `Hello ${firstName}! I'm Caly your Booking Assistant for ${countryLabel}. I can help you search for venues, see availability and make bookings in these locations: ${cities}. How can I assist you today?`,
      },
    ],
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="flex flex-col max-w-3xl w-full border rounded-lg shadow bg-background">
        <div className="border-b p-4 bg-card flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">CalyBook Assistant</h1>
            <p className="text-sm text-muted-foreground">This is an AI assistant that can help you search for venues, services and make a booking.</p>
          </div>
          <Button variant="outline" size="icon" onClick={() => reload()}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>

        <ScrollArea className="flex-1 h-full space-y-4 overflow-y-auto p-4">
          {messages.map((message, index) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <Card className={`max-w-md mt-3 p-3 rounded-lg ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                <div className="mb-1 text-xs font-semibold opacity-70">{message.role === "user" ? "You" : "CalyBook Assistant"}</div>
                <div className="whitespace-pre-wrap">{message.content.startsWith("[") && message.content.endsWith("]") ? "" : message.content}</div>

                {message.role === "assistant" && status === "streaming" && index === messages.length - 1 && <Loader2 className="w-4 h-4 animate-spin mt-2" />}
              </Card>
            </div>
          ))}
        </ScrollArea>

        <form onSubmit={handleSubmit} className="flex gap-2 border-t bg-card p-4">
          <Input value={input} placeholder="Type your message..." onChange={handleInputChange} disabled={status !== "ready"} className="flex-1" />
          <Button type="submit" disabled={status !== "ready"} className="min-w-[80px]">
            {status === "streaming" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send"}
          </Button>
        </form>
      </div>
    </div>
  );
}

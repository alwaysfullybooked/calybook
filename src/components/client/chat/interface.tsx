"use client";

import { useChat } from "@ai-sdk/react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { locations } from "@/data/locations";

export default function ChatInterface({ sessionId, country }: { sessionId: string; country: string }) {
  const countryLabel = locations[country as keyof typeof locations]?.name ?? "";

  const { messages, input, handleInputChange, handleSubmit, status } = useChat({
    api: "/api/chat",
    headers: {
      "mcp-session-id": sessionId,
    },
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        content: `"Hello! I'm your CalyBook ${countryLabel} Assistant. I can help you search for venues, services, and make bookings. How can I assist you today?`,
      },
    ],
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="flex flex-col max-w-3xl w-full border rounded-lg shadow bg-background">
        <div className="border-b p-4 bg-card">
          <h1 className="text-xl font-bold">CalyBook Assistant</h1>
          <p className="text-sm text-muted-foreground">This is an AI assistant that can help you search for venues, services and make a booking.</p>
        </div>

        <ScrollArea className="flex-1 space-y-4 overflow-y-auto p-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <Card className={`max-w-md mt-3 p-3 rounded-lg ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                <div className="mb-1 text-xs font-semibold opacity-70">{message.role === "user" ? "You" : "CalyBook Assistant"}</div>
                {message.parts
                  ? message.parts.map((part, index) => {
                      switch (part.type) {
                        case "text":
                          return <span key={`${message.id}-${part.type}-${index}`}>{part.text}</span>;
                        // Add more cases for images, tool calls, etc. as needed
                        default:
                          return null;
                      }
                    })
                  : message.content}
              </Card>
            </div>
          ))}
        </ScrollArea>
        <form onSubmit={handleSubmit} className="flex gap-2 border-t bg-card p-4">
          <Input value={input} placeholder="Type your message..." onChange={handleInputChange} disabled={status !== "ready"} className="flex-1" />
          <Button type="submit" disabled={status !== "ready"}>
            Send
          </Button>
        </form>
      </div>
    </div>
  );
}

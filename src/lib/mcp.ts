import { env } from "@/env";
import { groq } from "@ai-sdk/groq";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { tool, type Tool, jsonSchema, streamText, type Message } from "ai";
// import { randomUUID } from "node:crypto";

// Helper to create a new MCP client and connect
async function createMCPClient(sessionId: string) {
  const client = new Client({
    name: "alwaysfullybooked-mcp-client",
    version: "0.1.0",
    sessionId,
  });
  const transport = new StreamableHTTPClientTransport(new URL(env.AFB_MCP_URL));
  await client.connect(transport);
  return client;
}

export async function getTools(sessionId: string) {
  const client = await createMCPClient(sessionId);
  const tools = await client.listTools();
  await client.close();
  return tools;
}

// Usage with Groq
export async function createGroqWithMCPTools(sessionId: string) {
  const model = groq("llama-3.3-70b-versatile");
  const tools = await getAISdkTools(sessionId);
  return { model, tools };
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getAISdkTools(sessionId: string) {
  const client = await createMCPClient(sessionId);
  const toolsResponse = await client.listTools();

  const aiSdkTools: Record<string, Tool> = {};

  for (const mcpTool of toolsResponse.tools) {
    aiSdkTools[mcpTool.name] = tool({
      description: mcpTool.description,
      parameters: jsonSchema(mcpTool.inputSchema),
      execute: async (params) => {
        let retries = 0;
        const MAX_RETRIES = 3;
        const RETRY_DELAY = 1000;
        while (retries < MAX_RETRIES) {
          try {
            const result = await client.callTool({
              name: mcpTool.name,
              arguments: params as { [x: string]: unknown },
            });
            if (result.content) {
              if (Array.isArray(result.content)) {
                return result.content.map((item: unknown) => (typeof item === "object" && item !== null && "text" in item ? (item as { text: string }).text : JSON.stringify(item))).join("\n");
              }
              if (typeof result.content === "object" && result.content !== null && "text" in result.content) {
                return (result.content as { text: string }).text;
              }
              return JSON.stringify(result.content);
            }
            return JSON.stringify(result);
          } catch (error) {
            retries++;
            if (retries === MAX_RETRIES) {
              console.error(`Error calling MCP tool ${mcpTool.name} after ${MAX_RETRIES} attempts:`, error);
              throw error;
            }
            console.warn(`Tool execution attempt ${retries} failed, retrying in ${RETRY_DELAY}ms...`);
            await sleep(RETRY_DELAY);
          }
        }
      },
    });
  }
  return aiSdkTools;
}

// New function to handle streaming with MCP
export async function streamWithMCP({
  sessionId,
  messages,
}: {
  sessionId: string;
  messages: Message[];
}) {
  const model = groq("llama-3.3-70b-versatile");
  const tools = await getAISdkTools(sessionId);

  const result = streamText({
    headers: {
      "mcp-session-id": sessionId,
    },
    model,
    messages,
    tools,
    toolChoice: "auto",
    toolCallStreaming: true,
    maxSteps: 3,
  });

  return result.toDataStreamResponse();
}

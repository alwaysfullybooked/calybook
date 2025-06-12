import { env } from "@/env";
import { groq } from "@ai-sdk/groq";
// import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { tool, type Tool, jsonSchema, streamText, type Message } from "ai";

const model = groq("llama3-8b-8192");
// const model = groq("llama-3.3-70b-versatile");

// const openrouter = createOpenRouter({
//   apiKey: env.OPENAI_API_KEY,
// });

// const model = openrouter.chat("meta-llama/llama-3.3-70b-instruct:free");
// const model = openrouter.chat("meta-llama/llama-3.3-8b-instruct:free");

// Client and tools caching
const clientCache = new Map<string, Client>();
const toolsCache = new Map<string, Record<string, Tool>>();
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

// Helper to create a new MCP client and connect
async function createMCPClient(sessionId: string) {
  // Check if client exists in cache
  const cachedClient = clientCache.get(sessionId);
  if (cachedClient) {
    return cachedClient;
  }

  // Create new client if not in cache
  const client = new Client({
    name: "alwaysfullybooked-mcp-client",
    version: "0.1.0",
    sessionId,
  });
  const transport = new StreamableHTTPClientTransport(new URL(env.AFB_MCP_URL));
  await client.connect(transport);

  // Store in cache with expiration
  clientCache.set(sessionId, client);
  setTimeout(() => {
    clientCache.delete(sessionId);
    toolsCache.delete(sessionId);
  }, CACHE_TTL);

  return client;
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getAISdkTools(sessionId: string) {
  // Check if tools exist in cache
  const cachedTools = toolsCache.get(sessionId);
  if (cachedTools) {
    return cachedTools;
  }

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
            await sleep(RETRY_DELAY);
          }
        }
      },
    });
  }

  // Store tools in cache
  toolsCache.set(sessionId, aiSdkTools);
  return aiSdkTools;
}

// Cleanup function to remove clients from cache
export function cleanupClient(sessionId: string) {
  clientCache.delete(sessionId);
  toolsCache.delete(sessionId);
}

// New function to handle streaming with MCP
export async function streamWithMCP({
  sessionId,
  messages,
}: {
  sessionId: string;
  messages: Message[];
}) {
  const tools = await getAISdkTools(sessionId);

  return streamText({
    headers: {
      "mcp-session-id": sessionId,
    },
    model,
    messages,
    tools,
    toolChoice: "auto",
    toolCallStreaming: true,
    maxSteps: 3,
  }).toDataStreamResponse();
}

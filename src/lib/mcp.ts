import { env } from "@/env";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { tool, type Tool, jsonSchema, streamText, type Message } from "ai";

const openrouter = createOpenRouter({
  apiKey: env.OPENROUTER_API_KEY,
});

const model = openrouter.chat("meta-llama/llama-3.3-70b-instruct:free");

// Singleton client instance
let globalClient: Client | null = null;
let globalTools: Record<string, Tool> | null = null;

async function getClient(sessionId: string) {
  if (globalClient) {
    return globalClient;
  }

  const client = new Client({
    name: "alwaysfullybooked-mcp-client",
    version: "0.1.0",
    sessionId,
  });

  const transport = new StreamableHTTPClientTransport(new URL(env.AFB_MCP_URL));
  await client.connect(transport);

  globalClient = client;
  return client;
}

async function getTools(sessionId: string) {
  if (globalTools) {
    return globalTools;
  }
  const tools = await getAISdkTools(sessionId);
  globalTools = tools;
  return tools;
}

async function executeTool(globalClient: Client, toolName: string, params: Record<string, unknown>, inputSchema: Record<string, unknown>): Promise<string> {
  // Validate required parameters
  const requiredParams = (inputSchema.required as string[]) || [];
  const missingParams = requiredParams.filter((param) => !(param in params));

  if (missingParams.length > 0) {
    throw new Error(`Missing required parameters: ${missingParams.join(", ")}`);
  }

  const result = await globalClient.callTool({
    name: toolName,
    arguments: params,
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
}

export async function getAISdkTools(sessionId: string) {
  const client = await getClient(sessionId);
  const toolsResponse = await client.listTools();

  const tools: Record<string, Tool> = {};
  for (const mcpTool of toolsResponse.tools) {
    console.log("mcpTool", mcpTool.name, mcpTool.description);

    tools[mcpTool.name] = tool({
      description: mcpTool.description,
      parameters: jsonSchema(mcpTool.inputSchema),
      execute: async (args: unknown) => {
        const params = args as Record<string, unknown>;
        return executeTool(client, mcpTool.name, params, mcpTool.inputSchema);
      },
    });
  }

  return tools;
}

// New function to handle streaming with MCP
export async function streamWithMCP({
  sessionId,
  messages,
}: {
  sessionId: string;
  messages: Message[];
}) {
  const tools = await getTools(sessionId);

  const result = streamText({
    headers: {
      "mcp-session-id": sessionId,
    },
    model,
    messages,
    tools,
    // toolChoice: "auto",
    // toolCallStreaming: true,
    toolChoice: "required",
    maxSteps: 10,
  });

  return result.toDataStreamResponse();
}

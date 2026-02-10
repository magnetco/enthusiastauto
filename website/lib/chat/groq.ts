import Groq from "groq-sdk";

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Model configuration
export const GROQ_MODELS = {
  primary: "llama-3.3-70b-versatile",
  fallback: "llama-3.1-8b-instant",
} as const;

// System prompt for the chatbot
export const SYSTEM_PROMPT = `You are an AI assistant for Enthusiast Auto Group, the leading BMW preservation facility. You help users:

1. **Search Inventory**: Find current and sold BMW vehicles from our curated collection
2. **BMW Knowledge**: Answer questions about BMW models, specs, history, and features
3. **Parts Lookup**: Search for parts with fitment recommendations for specific BMW models

**Brand Voice:**
- Knowledgeable and enthusiast-first
- Use proper BMW terminology (chassis codes, option packages)
- Be specific and detailed, not vague
- Confident but approachable

**Available Tools:**
- search_vehicles(query, status): Search vehicles (status: "current" | "sold" | "all")
- search_parts(query, chassis?, year?): Search parts with optional fitment filters
- get_vehicle_details(slug): Get full vehicle details
- get_compatible_parts(vehicleSlug): Get parts compatible with a vehicle

**Guidelines:**
- Always use tools to fetch real-time data
- Provide direct links to vehicles and products
- For parts searches, ask for chassis code or year if not provided
- Cite specific specs and features from vehicle data
- If unsure, ask clarifying questions
- Keep responses concise but informative
- Format prices clearly with currency symbols
- Use markdown for formatting when helpful`;

// Tool definitions for function calling
export const CHAT_TOOLS: any[] = [
  {
    type: "function",
    function: {
      name: "search_vehicles",
      description:
        "Search for BMW vehicles in current inventory or sold vehicles. Returns up to 5 matching vehicles with details.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description:
              "Search query (model name, chassis code, year, or keywords like 'M3', 'E46', '2013')",
          },
          status: {
            type: "string",
            enum: ["current", "sold", "all"],
            description:
              "Filter by vehicle status: 'current' for available inventory, 'sold' for past sales, 'all' for both",
            default: "current",
          },
          limit: {
            type: "number",
            description: "Maximum number of results to return (default: 5)",
            default: 5,
          },
        },
        required: ["query"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "search_parts",
      description:
        "Search for BMW parts and accessories with optional fitment filtering by chassis code or year",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description:
              "Part name, type, or category (e.g., 'brake pads', 'oil filter', 'suspension')",
          },
          chassis: {
            type: "string",
            description:
              "BMW chassis code for fitment filtering (e.g., 'E46', 'E92', 'F80')",
          },
          year: {
            type: "number",
            description: "Vehicle year for fitment filtering (e.g., 2011)",
          },
          limit: {
            type: "number",
            description: "Maximum number of results to return (default: 8)",
            default: 8,
          },
        },
        required: ["query"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_vehicle_details",
      description:
        "Get detailed information about a specific vehicle by its slug, including full specs, features, service history, and images",
      parameters: {
        type: "object",
        properties: {
          slug: {
            type: "string",
            description:
              "Vehicle slug (URL-friendly identifier, e.g., '2013-bmw-e92-m3-zcp')",
          },
        },
        required: ["slug"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_compatible_parts",
      description:
        "Get parts that are compatible with a specific vehicle based on its chassis code, model, and year",
      parameters: {
        type: "object",
        properties: {
          vehicleSlug: {
            type: "string",
            description:
              "Vehicle slug to find compatible parts for (e.g., '2013-bmw-e92-m3-zcp')",
          },
          limit: {
            type: "number",
            description: "Maximum number of parts to return (default: 6)",
            default: 6,
          },
        },
        required: ["vehicleSlug"],
      },
    },
  },
];

// Message types
export type ChatRole = "system" | "user" | "assistant" | "tool";

export interface ChatMessage {
  role: ChatRole;
  content: string;
  tool_calls?: any[];
  tool_call_id?: string;
  name?: string;
}

// Streaming chat completion
export async function streamChatCompletion(
  messages: ChatMessage[],
  onChunk: (chunk: string) => void,
  onToolCall?: (toolCall: any) => Promise<string>,
  disableTools: boolean = false,
): Promise<{
  content: string;
  toolCalls: any[];
  usage?: Groq.CompletionUsage;
}> {
  try {
    const stream = await groq.chat.completions.create({
      model: GROQ_MODELS.primary,
      messages: messages as any[],
      tools: disableTools ? undefined : CHAT_TOOLS,
      tool_choice: disableTools ? undefined : "auto",
      temperature: 0.5, // Lower temp for better tool calling
      max_tokens: 1024,
      stream: true,
    });

    let fullContent = "";
    let toolCalls: any[] = [];
    let currentToolCall: any | null = null;

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta;
      const finishReason = chunk.choices[0]?.finish_reason;

      // Handle content streaming
      if (delta?.content) {
        fullContent += delta.content;
        onChunk(delta.content);
      }
      
      // Log finish reason for debugging
      if (finishReason) {
        console.log("Stream finished with reason:", finishReason);
      }

      // Handle tool calls
      if (delta?.tool_calls) {
        for (const toolCallDelta of delta.tool_calls) {
          if (toolCallDelta.index !== undefined) {
            if (!currentToolCall || toolCallDelta.index !== toolCalls.length) {
              // Start new tool call
              currentToolCall = {
                id: toolCallDelta.id || "",
                type: "function",
                function: {
                  name: toolCallDelta.function?.name || "",
                  arguments: toolCallDelta.function?.arguments || "",
                },
              };
              if (currentToolCall.id) {
                toolCalls.push(currentToolCall);
              }
            } else {
              // Continue existing tool call
              if (toolCallDelta.function?.arguments && currentToolCall.function) {
                currentToolCall.function.arguments +=
                  toolCallDelta.function.arguments;
              }
            }
          }
        }
      }
    }

    return {
      content: fullContent,
      toolCalls,
    };
  } catch (error) {
    console.error("Error in Groq streaming:", error);
    throw error;
  }
}

// Non-streaming chat completion (for tool execution)
export async function chatCompletion(
  messages: ChatMessage[],
): Promise<any> {
  try {
    const completion = await groq.chat.completions.create({
      model: GROQ_MODELS.primary,
      messages: messages as any[],
      tools: CHAT_TOOLS,
      tool_choice: "auto",
      temperature: 0.7,
      max_tokens: 1024,
    });

    return completion;
  } catch (error) {
    console.error("Error in Groq completion:", error);
    throw error;
  }
}

export default groq;

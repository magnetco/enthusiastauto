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
export const SYSTEM_PROMPT = `You are an AI assistant for Enthusiast Auto Group (EAG), the leading BMW preservation facility. You help users find vehicles, parts, and get BMW expertise.

**Your Capabilities:**
1. **Vehicle Search**: Find current inventory and sold vehicles
2. **Parts Search**: Find parts with fitment matching for specific BMW models
3. **Add to Cart**: Add parts directly to the user's shopping cart
4. **Vehicle-Parts Matching**: Find parts compatible with specific vehicles or chassis codes
5. **BMW Knowledge**: Answer questions about BMW models, specs, history, and features

**Brand Voice:**
- Knowledgeable and enthusiast-first
- Use proper BMW terminology (chassis codes like E46, E92, F80, G80; option packages like ZCP, Competition)
- Be specific and detailed, not vague
- Confident but approachable

**CRITICAL: Always Include Links**
When showing search results, ALWAYS format them as clickable markdown links:
- Vehicles: [Vehicle Title](https://enthusiastauto.com/vehicles/slug)
- Parts: [Part Title](https://enthusiastauto.com/product/handle)
- Browse pages: [View All Vehicles](https://enthusiastauto.com/vehicles) or [View All Parts](https://enthusiastauto.com/parts)

**Available Tools:**
- search_vehicles(query, status, limit): Search vehicles by model, chassis, year, or keywords
- list_vehicles(status, chassis, limit): List all vehicles, optionally filtered by chassis
- search_parts(query, chassis, year, limit): Search parts with optional fitment filters
- list_parts(category, limit): List all parts, optionally filtered by category
- get_vehicle_details(slug): Get full vehicle specifications and details
- get_compatible_parts(vehicleSlug, limit): Get parts compatible with a specific vehicle
- get_parts_for_chassis(chassis, limit): Find parts for a specific chassis code (E46, E92, etc.)
- get_vehicles_for_part(productHandle): Find vehicles in inventory that a part fits
- add_to_cart(productHandle, quantity): Add a part to the shopping cart

**Guidelines:**
1. ALWAYS use tools to fetch real-time data - never make up inventory or prices
2. ALWAYS include clickable links in your responses using markdown format
3. When user asks to "search all" or "show all", use list_vehicles or list_parts with higher limits
4. For parts searches, proactively ask for chassis code if not provided to ensure fitment
5. When showing parts, mention if they can be added to cart
6. If a user wants to buy a part, use add_to_cart to add it directly
7. Use get_parts_for_chassis when user mentions a chassis code (E46, E92, F80, etc.)
8. Keep responses concise but informative
9. Format prices clearly with $ symbol
10. Use bullet points and markdown formatting for readability

**Example Response Format:**
"I found 3 E46 M3s in our current inventory:

• [2005 BMW E46 M3 Competition](https://enthusiastauto.com/vehicles/2005-bmw-e46-m3-competition) - $45,000 - 65,000 miles
• [2003 BMW E46 M3](https://enthusiastauto.com/vehicles/2003-bmw-e46-m3) - $38,500 - 82,000 miles

Would you like more details on any of these, or shall I find compatible parts?"

**Chassis Code Reference:**
- E46: 1999-2006 3 Series (M3: 2001-2006)
- E90/E92/E93: 2006-2013 3 Series (M3: 2008-2013)
- F80/F82/F83: 2014-2020 M3/M4
- G80/G82/G83: 2021+ M3/M4
- E39: 1996-2003 5 Series (M5: 1998-2003)
- E60: 2004-2010 5 Series (M5: 2005-2010)
- F90: 2018+ M5`;

// Tool definitions for function calling
export const CHAT_TOOLS: any[] = [
  {
    type: "function",
    function: {
      name: "search_vehicles",
      description:
        "Search for BMW vehicles by model name, chassis code, year, or keywords. Use this when user asks to find specific vehicles.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description:
              "Search query (model name, chassis code, year, or keywords like 'M3', 'E46', '2013', 'competition')",
          },
          status: {
            type: "string",
            enum: ["current", "sold", "all"],
            description:
              "Filter by vehicle status: 'current' for available inventory, 'sold' for past sales, 'all' for both",
          },
          limit: {
            type: ["number", "string"],
            description: "Maximum number of results to return (default: 5, max: 20)",
          },
        },
        required: ["query"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "list_vehicles",
      description:
        "List all vehicles in inventory. Use this when user wants to see all vehicles or browse by chassis code.",
      parameters: {
        type: "object",
        properties: {
          status: {
            type: "string",
            enum: ["current", "sold", "all"],
            description: "Filter by vehicle status (default: current)",
          },
          chassis: {
            type: "string",
            description: "Filter by chassis code (e.g., 'E46', 'E92', 'F80')",
          },
          limit: {
            type: ["number", "string"],
            description: "Maximum number of results to return (default: 10, max: 50)",
          },
        },
        required: [],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "search_parts",
      description:
        "Search for BMW parts and accessories by name or type. Optionally filter by chassis code or year for fitment.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description:
              "Part name, type, or category (e.g., 'brake pads', 'oil filter', 'suspension', 'exhaust')",
          },
          chassis: {
            type: "string",
            description:
              "BMW chassis code for fitment filtering (e.g., 'E46', 'E92', 'F80')",
          },
          year: {
            type: ["number", "string"],
            description: "Vehicle year for fitment filtering (e.g., 2011)",
          },
          limit: {
            type: ["number", "string"],
            description: "Maximum number of results to return (default: 8, max: 20)",
          },
        },
        required: ["query"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "list_parts",
      description:
        "List all available parts. Use this when user wants to browse all parts or see what's available.",
      parameters: {
        type: "object",
        properties: {
          category: {
            type: "string",
            description: "Filter by product category/type",
          },
          limit: {
            type: ["number", "string"],
            description: "Maximum number of results to return (default: 10, max: 50)",
          },
        },
        required: [],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_vehicle_details",
      description:
        "Get detailed information about a specific vehicle including full specs, features, and history",
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
        "Get parts compatible with a specific vehicle. Use when user has identified a vehicle and wants matching parts.",
      parameters: {
        type: "object",
        properties: {
          vehicleSlug: {
            type: "string",
            description:
              "Vehicle slug to find compatible parts for (e.g., '2013-bmw-e92-m3-zcp')",
          },
          limit: {
            type: ["number", "string"],
            description: "Maximum number of parts to return (default: 6)",
          },
        },
        required: ["vehicleSlug"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_parts_for_chassis",
      description:
        "Find parts compatible with a specific BMW chassis code. Use when user mentions E46, E92, F80, etc.",
      parameters: {
        type: "object",
        properties: {
          chassis: {
            type: "string",
            description: "BMW chassis code (e.g., 'E46', 'E92', 'F80', 'G80')",
          },
          limit: {
            type: ["number", "string"],
            description: "Maximum number of parts to return (default: 8)",
          },
        },
        required: ["chassis"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_vehicles_for_part",
      description:
        "Find vehicles in inventory that a specific part fits. Use to show vehicle-part compatibility.",
      parameters: {
        type: "object",
        properties: {
          productHandle: {
            type: "string",
            description: "Product handle/slug from the parts search results",
          },
        },
        required: ["productHandle"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "add_to_cart",
      description:
        "Add a part to the user's shopping cart. Use when user wants to buy or add a part to cart.",
      parameters: {
        type: "object",
        properties: {
          productHandle: {
            type: "string",
            description: "Product handle/slug of the part to add (from search results)",
          },
          quantity: {
            type: ["number", "string"],
            description: "Quantity to add (default: 1)",
          },
        },
        required: ["productHandle"],
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

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import prisma from "@/lib/db/prisma";
import { streamChatCompletion, SYSTEM_PROMPT, type ChatMessage } from "@/lib/chat/groq";
import { executeTool } from "@/lib/chat/tools";
import { formatBMWContext } from "@/lib/chat/context";
import { checkRateLimit, getIdentifier } from "@/lib/chat/rate-limit";
import { z } from "zod";

// Request validation schema
const chatRequestSchema = z.object({
  message: z.string().min(1).max(500),
  conversationId: z.string().nullable().optional(),
  sessionId: z.string().nullable().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const { message, conversationId, sessionId } = chatRequestSchema.parse(body);

    // Get user session
    const session = await getServerSession();
    const userId = session?.user?.id;

    // Check rate limits for guest users
    if (!userId) {
      const identifier = sessionId || getIdentifier(request);
      const rateLimit = await checkRateLimit(identifier);

      if (!rateLimit.allowed) {
        return NextResponse.json(
          {
            error: "Rate limit exceeded",
            message: `You've reached the maximum of 10 messages per hour. Please sign in for unlimited access or try again at ${rateLimit.resetAt.toLocaleTimeString()}.`,
            resetAt: rateLimit.resetAt.toISOString(),
          },
          { status: 429 }
        );
      }
    }

    // Get or create conversation
    let conversation;
    if (conversationId) {
      // Load existing conversation
      conversation = await prisma.chatConversation.findUnique({
        where: { id: conversationId },
        include: {
          messages: {
            orderBy: { createdAt: "asc" },
            take: 20, // Limit context to last 20 messages
          },
        },
      });

      if (!conversation) {
        return NextResponse.json(
          { error: "Conversation not found" },
          { status: 404 }
        );
      }

      // Verify ownership for authenticated users
      if (userId && conversation.userId !== userId) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 403 }
        );
      }
    } else {
      // Create new conversation
      conversation = await prisma.chatConversation.create({
        data: {
          userId: userId || null,
          sessionId: userId ? null : (sessionId || getIdentifier(request)),
          title: message.slice(0, 50), // Use first message as title
          messages: {
            create: {
              role: "user",
              content: message,
            },
          },
        },
        include: {
          messages: {
            orderBy: { createdAt: "asc" },
          },
        },
      });
    }

    // If conversation exists, add user message
    if (conversationId) {
      await prisma.chatMessage.create({
        data: {
          conversationId: conversation.id,
          role: "user",
          content: message,
        },
      });
    }

    // Build message history for context
    const messageHistory: ChatMessage[] = [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
    ];

    // Add BMW context if relevant
    const bmwContext = formatBMWContext(message);
    if (bmwContext) {
      messageHistory.push({
        role: "system",
        content: `Relevant BMW Information:${bmwContext}`,
      });
    }

    // Add conversation history
    if (conversationId && conversation.messages) {
      conversation.messages.forEach((msg: any) => {
        messageHistory.push({
          role: msg.role as "user" | "assistant" | "system",
          content: msg.content,
        });
      });
    }

    // Add current message if new conversation
    if (!conversationId) {
      messageHistory.push({
        role: "user",
        content: message,
      });
    }

    // Create streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        let fullResponse = "";
        const toolCalls: any[] = [];

        try {
          // First call to LLM (may include tool calls)
          const result = await streamChatCompletion(
            messageHistory,
            (chunk) => {
              // Only send chunks if there's actual content
              if (chunk) {
                fullResponse += chunk;
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ type: "chunk", content: chunk })}\n\n`)
                );
              }
            }
          );

          // Handle tool calls if any
          if (result.toolCalls && result.toolCalls.length > 0) {
            console.log("Tool calls detected:", result.toolCalls.length);
            
            // Add assistant message with tool calls to history
            messageHistory.push({
              role: "assistant",
              content: result.content || "",
              tool_calls: result.toolCalls,
            });

            // Execute each tool
            for (const toolCall of result.toolCalls) {
              try {
                console.log("Executing tool:", toolCall.function.name, toolCall.function.arguments);
                
                // Parse tool arguments
                const args = JSON.parse(toolCall.function.arguments);
                
                // Send tool call notification
                controller.enqueue(
                  encoder.encode(
                    `data: ${JSON.stringify({
                      type: "tool_call",
                      tool: toolCall.function.name,
                      args,
                    })}\n\n`
                  )
                );

                // Execute tool
                const toolResult = await executeTool(toolCall.function.name, args);
                console.log("Tool result:", toolResult);
                
                // Send tool result
                controller.enqueue(
                  encoder.encode(
                    `data: ${JSON.stringify({
                      type: "tool_result",
                      tool: toolCall.function.name,
                      result: toolResult,
                    })}\n\n`
                  )
                );

                // Add tool result to message history
                messageHistory.push({
                  role: "tool",
                  content: toolResult,
                  tool_call_id: toolCall.id,
                  name: toolCall.function.name,
                });

                toolCalls.push({
                  name: toolCall.function.name,
                  arguments: args,
                  result: toolResult,
                });
              } catch (error) {
                console.error("Error executing tool:", error);
                controller.enqueue(
                  encoder.encode(
                    `data: ${JSON.stringify({
                      type: "error",
                      message: `Error executing tool: ${error instanceof Error ? error.message : "Unknown error"}`,
                    })}\n\n`
                  )
                );
              }
            }

            // Get final response after tool execution
            console.log("Getting final response with tool results...");
            fullResponse = ""; // Reset for final response
            const finalResult = await streamChatCompletion(
              messageHistory,
              (chunk) => {
                if (chunk) {
                  fullResponse += chunk;
                  controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify({ type: "chunk", content: chunk })}\n\n`)
                  );
                }
              },
              undefined,
              true // Disable tools on second call to force text response
            );
            
            console.log("Final response complete:", fullResponse);
          } else {
            // No tool calls, use the content from first call
            fullResponse = result.content;
          }

          // Save assistant message to database
          await prisma.chatMessage.create({
            data: {
              conversationId: conversation.id,
              role: "assistant",
              content: fullResponse,
              toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
              metadata: {
                model: "llama-3.3-70b-versatile",
                timestamp: new Date().toISOString(),
              },
            },
          });

          // Send completion signal
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: "done",
                conversationId: conversation.id,
              })}\n\n`
            )
          );
        } catch (error) {
          console.error("Error in chat stream:", error);
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: "error",
                message: error instanceof Error ? error.message : "An error occurred",
              })}\n\n`
            )
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Error in chat API:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

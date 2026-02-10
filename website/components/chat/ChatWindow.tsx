"use client";

import { useState, useRef, useEffect } from "react";
import { X, Minus } from "lucide-react";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";

interface ChatWindowProps {
  isAuthenticated: boolean;
  onClose: () => void;
}

export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  toolCalls?: any[];
}

export function ChatWindow({ isAuthenticated, onClose }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [sessionId] = useState(() => {
    // Generate a session ID for guest users
    if (typeof window !== "undefined") {
      let sid = localStorage.getItem("chat_session_id");
      if (!sid) {
        sid = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem("chat_session_id", sid);
      }
      return sid;
    }
    return null;
  });

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) {
      console.log("Message blocked:", { content, isLoading });
      return;
    }

    console.log("Sending message:", content);

    // Add user message
    const userMessage: Message = {
      id: `user_${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Send message to API
      const payload: any = { message: content };
      if (conversationId) payload.conversationId = conversationId;
      if (sessionId) payload.sessionId = sessionId;
      
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to send message");
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No response body");
      }

      const assistantMessageId = `assistant_${Date.now()}`;
      let assistantContent = "";

      // Add empty assistant message
      setMessages((prev) => [...prev, {
        id: assistantMessageId,
        role: "assistant",
        content: "",
        timestamp: new Date(),
      }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          console.log("Stream complete, final content:", assistantContent);
          break;
        }

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              console.log("Received SSE data:", data);

              if (data.type === "chunk") {
                // Update assistant message content
                assistantContent += data.content;
                setMessages((prev) => {
                  const newMessages = [...prev];
                  const lastIndex = newMessages.length - 1;
                  newMessages[lastIndex] = {
                    ...newMessages[lastIndex],
                    content: assistantContent,
                  };
                  return newMessages;
                });
              } else if (data.type === "tool_call") {
                // Show tool execution
                console.log("Tool call:", data.tool, data.args);
              } else if (data.type === "done") {
                // Set conversation ID for future messages
                if (data.conversationId) {
                  setConversationId(data.conversationId);
                }
              } else if (data.type === "error") {
                throw new Error(data.message);
              }
            } catch (e) {
              console.error("Error parsing SSE data:", e, line);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      
      // Add error message
      const errorMessage: Message = {
        id: `error_${Date.now()}`,
        role: "assistant",
        content: error instanceof Error ? error.message : "Sorry, something went wrong. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      console.log("Message complete, setting loading to false");
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-white animate-in slide-in-from-bottom-8 fade-in-0 duration-300 md:bottom-6 md:right-6 md:top-auto md:left-auto md:h-[600px] md:w-[400px] md:rounded-xl md:border md:border-gray-200 md:shadow-high">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500"></div>
          <h3 className="text-sm font-medium text-gray-900">Chat Assistant</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300"
            aria-label="Close chat"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-hidden">
        <ChatMessages 
          messages={messages} 
          isLoading={isLoading}
          onSuggestionClick={handleSendMessage}
        />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 bg-gray-50 p-4">
        <ChatInput
          onSend={handleSendMessage}
          disabled={isLoading}
          isAuthenticated={isAuthenticated}
        />
      </div>
    </div>
  );
}

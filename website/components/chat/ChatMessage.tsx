"use client";

import { User, Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";
import type { Message } from "./ChatWindow";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex gap-3 animate-in slide-in-from-right-4 fade-in-0 duration-200 ${
        isUser ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {/* Avatar */}
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
          isUser ? "bg-[#005A90]" : "bg-[#F90020]"
        }`}
      >
        {isUser ? (
          <User className="h-4 w-4 text-white" />
        ) : (
          <Bot className="h-4 w-4 text-white" />
        )}
      </div>

      {/* Message Content */}
      <div
        className={`flex max-w-[80%] flex-col gap-1 ${
          isUser ? "items-end" : "items-start"
        }`}
      >
      <div
        className={`rounded-lg px-4 py-2 ${
          isUser
            ? "bg-[#005A90] text-white"
            : "bg-gray-100 text-gray-900"
        }`}
      >
        {isUser ? (
          <p className="text-sm">{message.content}</p>
        ) : (
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown
              components={{
                a: ({ node, ...props }) => (
                  <a
                    {...props}
                    className="text-[#005A90] hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                ),
                p: ({ node, ...props }) => (
                  <p {...props} className="mb-2 last:mb-0" />
                ),
                ul: ({ node, ...props }) => (
                  <ul {...props} className="mb-2 ml-4 list-disc" />
                ),
                ol: ({ node, ...props }) => (
                  <ol {...props} className="mb-2 ml-4 list-decimal" />
                ),
                li: ({ node, ...props }) => (
                  <li {...props} className="mb-1" />
                ),
                code: ({ node, inline, ...props }: any) =>
                  inline ? (
                    <code
                      {...props}
                      className="rounded bg-gray-200 px-1 py-0.5 text-xs text-gray-800"
                    />
                  ) : (
                    <code
                      {...props}
                      className="block rounded bg-gray-200 p-2 text-xs text-gray-800"
                    />
                  ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}
      </div>
      <span className="text-xs text-gray-500">
        {message.timestamp.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </span>
      </div>
    </div>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
  isAuthenticated: boolean;
}

export function ChatInput({ onSend, disabled, isAuthenticated }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 96)}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const charCount = message.length;
  const maxChars = 500;
  const isOverLimit = charCount > maxChars;

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about vehicles, parts, or BMW models..."
          disabled={disabled}
          rows={1}
          className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 pr-12 text-sm text-gray-900 placeholder-gray-500 focus:border-[#005A90] focus:outline-none focus:ring-1 focus:ring-[#005A90] disabled:cursor-not-allowed disabled:opacity-50"
          style={{ maxHeight: "96px" }}
        />
        <button
          type="submit"
          disabled={disabled || !message.trim() || isOverLimit}
          className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-lg bg-[#F90020] text-white transition-colors hover:bg-[#d9001c] focus:outline-none focus:ring-2 focus:ring-[#F90020] focus:ring-offset-2 focus:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Send message"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>

      {/* Character count and rate limit info */}
      <div className="flex items-center justify-between text-xs">
        <span className={isOverLimit ? "text-red-600" : "text-gray-500"}>
          {charCount}/{maxChars}
        </span>
        {!isAuthenticated && (
          <span className="text-gray-500">
            Guest: 10 messages/hour
          </span>
        )}
      </div>
    </form>
  );
}

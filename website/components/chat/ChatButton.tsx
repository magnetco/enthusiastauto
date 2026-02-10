"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { ChatWindow } from "./ChatWindow";

interface ChatButtonProps {
  isAuthenticated: boolean;
}

export function ChatButton({ isAuthenticated }: ChatButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <ChatWindow
          isAuthenticated={isAuthenticated}
          onClose={() => setIsOpen(false)}
        />
      )}

      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex h-14 w-14 items-center justify-center rounded-full bg-[#F90020] text-white shadow-high transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#F90020] focus:ring-offset-2 focus:ring-offset-[#0a0c10]"
          aria-label="Open chat"
        >
          <MessageCircle className="h-6 w-6" />
          
          {/* Tooltip */}
          <span className="absolute bottom-full right-0 mb-2 hidden whitespace-nowrap rounded-lg bg-[#141721] px-3 py-2 text-sm text-white shadow-medium group-hover:block">
            Chat with us
          </span>
        </button>
      )}
    </>
  );
}

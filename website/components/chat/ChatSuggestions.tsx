"use client";

interface ChatSuggestionsProps {
  onSelect?: (suggestion: string) => void;
}

const SUGGESTIONS = [
  "Show me E46 M3 vehicles in stock",
  "What's the difference between ZCP and CSL?",
  "Find brake pads for my 2011 E92 M3",
  "Tell me about the E39 M5",
];

export function ChatSuggestions({ onSelect }: ChatSuggestionsProps) {
  return (
    <div className="grid w-full max-w-sm grid-cols-1 gap-2">
      {SUGGESTIONS.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => onSelect?.(suggestion)}
          className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-left text-sm text-gray-700 transition-colors hover:border-[#005A90] hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#005A90]"
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
}

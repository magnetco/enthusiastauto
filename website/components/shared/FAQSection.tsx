"use client";

import { useState } from "react";
import { MessageCircle, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { TitleBlock } from "@/components/shared/TitleBlock";

export interface FAQItem {
  question: string;
  chatPrompt: string;
  category?: string;
}

interface FAQSectionProps {
  title?: string;
  description?: string;
  faqs: FAQItem[];
  columns?: 1 | 2;
  onQuestionClick: (prompt: string) => void;
}

/**
 * FAQ Section Component
 * Displays FAQ questions that open the chatbot with contextual prompts
 * instead of showing static answers
 */
export function FAQSection({
  title = "Frequently Asked Questions",
  description,
  faqs,
  columns = 2,
  onQuestionClick,
}: FAQSectionProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="w-full">
      {/* Header */}
      {(title || description) && (
        <TitleBlock
          title={title}
          description={description}
          className="mb-12"
        />
      )}

      {/* FAQ Grid */}
      <div
        className={cn(
          "grid gap-4",
          columns === 2 ? "md:grid-cols-2" : "grid-cols-1"
        )}
      >
        {faqs.map((faq, index) => (
          <button
            key={index}
            onClick={() => onQuestionClick(faq.chatPrompt)}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            className={cn(
              "group relative flex items-start gap-4 rounded-xl border-2 bg-white p-6 text-left transition-all duration-200",
              hoveredIndex === index
                ? "border-[#2E90FA] shadow-lg"
                : "border-gray-200 hover:border-gray-300"
            )}
          >
            {/* Icon */}
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-200",
                hoveredIndex === index
                  ? "bg-[#2E90FA] text-white"
                  : "bg-[#f4f4f4] text-[#6f6e77]"
              )}
            >
              <MessageCircle className="h-5 w-5" />
            </div>

            {/* Content */}
            <div className="flex-1">
              <h3
                className={cn(
                  "mb-2 text-base font-semibold transition-colors",
                  hoveredIndex === index ? "text-brand-deep-blue" : "text-[#282a30]"
                )}
              >
                {faq.question}
              </h3>
              <p className="text-sm text-[#6f6e77]">
                Click to chat with our team about this
              </p>
            </div>

            {/* Arrow */}
            <ChevronRight
              className={cn(
                "h-5 w-5 shrink-0 transition-all duration-200",
                hoveredIndex === index
                  ? "translate-x-1 text-[#2E90FA]"
                  : "text-gray-400"
              )}
            />
          </button>
        ))}
      </div>

      {/* Help Text */}
      <div className="mt-8 text-center">
        <p className="text-sm text-[#6f6e77]">
          Have a different question?{" "}
          <button
            onClick={() => onQuestionClick("I have a question about selling my BMW")}
            className="font-medium text-brand-deep-blue hover:underline"
          >
            Start a conversation
          </button>
        </p>
      </div>
    </div>
  );
}

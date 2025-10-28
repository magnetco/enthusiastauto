'use client';

export interface HighlightProps {
  text: string;
  className?: string;
}

/**
 * Safely renders text with <mark> tags from highlight utility
 * Only allows <mark> tags - all other HTML is stripped by the highlight utility
 */
export function Highlight({ text, className = '' }: HighlightProps) {
  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: text }}
      suppressHydrationWarning
    />
  );
}

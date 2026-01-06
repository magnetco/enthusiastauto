/**
 * Parse query string into individual search terms
 */
export function parseQueryTerms(query: string): string[] {
  return query
    .trim()
    .split(/\s+/)
    .filter((term) => term.length > 0);
}

/**
 * Escape special regex characters in a string
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Create case-insensitive regex pattern for a search term
 */
function createHighlightPattern(term: string): RegExp {
  const escaped = escapeRegex(term);
  return new RegExp(`(${escaped})`, 'gi');
}

/**
 * Highlight query terms in text by wrapping matches with <mark> tags
 * Sanitizes input to prevent XSS attacks
 */
export function highlightQueryTerms(text: string, query: string): string {
  if (!text || !query) return text;

  // Sanitize input - remove any existing HTML tags
  const sanitized = text.replace(/<[^>]*>/g, '');

  // Parse query into terms
  const terms = parseQueryTerms(query);
  if (terms.length === 0) return sanitized;

  // Apply highlighting for each term
  let highlighted = sanitized;
  terms.forEach((term) => {
    const pattern = createHighlightPattern(term);
    highlighted = highlighted.replace(pattern, '<mark>$1</mark>');
  });

  return highlighted;
}

/**
 * Extract a snippet from text around the first match of any query term
 * Returns up to maxLength characters centered on the first match
 */
export function extractSnippet(
  text: string,
  query: string,
  maxLength: number = 150
): string {
  if (!text || !query) return text.slice(0, maxLength);

  const sanitized = text.replace(/<[^>]*>/g, '');
  const terms = parseQueryTerms(query);

  if (terms.length === 0) return sanitized.slice(0, maxLength);

  // Find first match position
  let firstMatchIndex = -1;
  let matchLength = 0;

  for (const term of terms) {
    const pattern = new RegExp(escapeRegex(term), 'i');
    const match = sanitized.match(pattern);
    if (match && match.index !== undefined) {
      if (firstMatchIndex === -1 || match.index < firstMatchIndex) {
        firstMatchIndex = match.index;
        matchLength = match[0].length;
      }
    }
  }

  if (firstMatchIndex === -1) {
    // No match found, return beginning
    return sanitized.slice(0, maxLength);
  }

  // Calculate snippet bounds to center the match
  const beforeLength = Math.floor((maxLength - matchLength) / 2);
  const start = Math.max(0, firstMatchIndex - beforeLength);
  const end = Math.min(sanitized.length, start + maxLength);

  let snippet = sanitized.slice(start, end);

  // Add ellipsis if truncated
  if (start > 0) snippet = '...' + snippet;
  if (end < sanitized.length) snippet = snippet + '...';

  return snippet;
}

import DOMPurify from "isomorphic-dompurify";

/**
 * Sanitizes HTML content to prevent XSS attacks
 * Uses DOMPurify to remove potentially dangerous elements and attributes
 * 
 * @param html - Raw HTML string to sanitize
 * @returns Sanitized HTML string safe for rendering with dangerouslySetInnerHTML
 */
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      // Text formatting
      "p", "br", "strong", "em", "u", "s", "mark",
      // Headings
      "h1", "h2", "h3", "h4", "h5", "h6",
      // Lists
      "ul", "ol", "li",
      // Links and images
      "a", "img",
      // Semantic elements
      "div", "span", "figure", "figcaption",
      // Tables
      "table", "thead", "tbody", "tr", "th", "td",
      // Other
      "blockquote", "code", "pre",
    ],
    ALLOWED_ATTR: [
      "href", "target", "rel", "class", "id",
      "src", "alt", "width", "height", "loading",
      "data-rt-type", "data-rt-align", // Rich text attributes
    ],
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  });
}

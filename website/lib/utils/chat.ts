/**
 * Opens the chat widget with a pre-filled message
 * This dispatches a custom event that the ChatButton component listens for
 */
export function openChatWithMessage(message: string) {
  if (typeof window !== "undefined") {
    const event = new CustomEvent("openChatWithMessage", {
      detail: { message },
    });
    window.dispatchEvent(event);
  }
}

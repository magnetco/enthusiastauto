import { getServerSession } from "@/lib/auth/session";
import { ChatButton } from "./ChatButton";

/**
 * ChatWidget - Server Component wrapper for the chat interface
 * Positioned in bottom-right corner of the page
 */
export async function ChatWidget() {
  const session = await getServerSession();
  const isAuthenticated = !!session?.user?.id;

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <ChatButton isAuthenticated={isAuthenticated} />
    </div>
  );
}

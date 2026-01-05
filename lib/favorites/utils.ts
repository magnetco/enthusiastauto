import { getServerSession } from "@/lib/auth/session";
import prisma from "@/lib/db/prisma";

/**
 * Check if an item is favorited by the current user
 * Returns false if user is not authenticated
 */
export async function isItemFavorited(
  itemId: string,
  itemType: "vehicle" | "product"
): Promise<boolean> {
  const session = await getServerSession();

  if (!session?.user?.id) {
    return false;
  }

  const favorite = await prisma.userFavorite.findFirst({
    where: {
      userId: session.user.id,
      itemType,
      itemId,
    },
  });

  return !!favorite;
}

/**
 * Get the count of favorites for the current user
 * Returns 0 if user is not authenticated
 */
export async function getUserFavoriteCount(): Promise<number> {
  const session = await getServerSession();

  if (!session?.user?.id) {
    return 0;
  }

  const count = await prisma.userFavorite.count({
    where: { userId: session.user.id },
  });

  return count;
}

/**
 * Check if user has reached the garage limit
 */
export async function isGarageFull(): Promise<boolean> {
  const count = await getUserFavoriteCount();
  const limit = parseInt(process.env.GARAGE_ITEM_LIMIT || "50", 10);
  return count >= limit;
}

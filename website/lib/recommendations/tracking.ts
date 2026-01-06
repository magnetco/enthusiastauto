import { cookies } from 'next/headers';
import { UserActivity, UserActivitySchema } from '@/types/recommendations';

/**
 * Cookie name for storing user activity
 */
const ACTIVITY_COOKIE_NAME = 'user_activity';

/**
 * Cookie expiration (30 days in seconds)
 */
const COOKIE_MAX_AGE = 30 * 24 * 60 * 60; // 30 days

/**
 * Maximum items to track per category
 */
const MAX_ITEMS_PER_CATEGORY = 20;

/**
 * Get current user activity from cookies
 * @param userId - Optional user ID (for future DB-based tracking)
 * @returns UserActivity object with viewed items and searches
 */
export async function getUserActivity(userId?: string): Promise<UserActivity> {
  try {
    const cookieStore = await cookies();
    const activityCookie = cookieStore.get(ACTIVITY_COOKIE_NAME);

    if (!activityCookie?.value) {
      return {
        vehicles: [],
        products: [],
        searches: [],
        timestamp: new Date(),
      };
    }

    // Parse and validate cookie data
    const parsed = JSON.parse(activityCookie.value);
    const validated = UserActivitySchema.parse(parsed);

    return validated;
  } catch (error) {
    console.error('[getUserActivity] Error reading activity cookie:', error);
    return {
      vehicles: [],
      products: [],
      searches: [],
      timestamp: new Date(),
    };
  }
}

/**
 * Save user activity to cookies
 * @param activity - UserActivity object to save
 */
async function saveUserActivity(activity: UserActivity): Promise<void> {
  try {
    const cookieStore = await cookies();

    cookieStore.set(ACTIVITY_COOKIE_NAME, JSON.stringify(activity), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: COOKIE_MAX_AGE,
      path: '/',
    });
  } catch (error) {
    console.error('[saveUserActivity] Error saving activity cookie:', error);
  }
}

/**
 * Track a vehicle view
 * @param vehicleId - Vehicle slug
 * @param userId - Optional user ID (for future DB-based tracking)
 */
export async function trackVehicleView(
  vehicleId: string,
  userId?: string
): Promise<void> {
  try {
    const activity = await getUserActivity(userId);

    // Add vehicle to the beginning of the list (most recent first)
    const updatedVehicles = [
      vehicleId,
      ...activity.vehicles.filter((v) => v !== vehicleId),
    ].slice(0, MAX_ITEMS_PER_CATEGORY);

    await saveUserActivity({
      ...activity,
      vehicles: updatedVehicles,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('[trackVehicleView] Error tracking vehicle view:', error);
  }
}

/**
 * Track a product view
 * @param productHandle - Product handle
 * @param userId - Optional user ID (for future DB-based tracking)
 */
export async function trackProductView(
  productHandle: string,
  userId?: string
): Promise<void> {
  try {
    const activity = await getUserActivity(userId);

    // Add product to the beginning of the list (most recent first)
    const updatedProducts = [
      productHandle,
      ...activity.products.filter((p) => p !== productHandle),
    ].slice(0, MAX_ITEMS_PER_CATEGORY);

    await saveUserActivity({
      ...activity,
      products: updatedProducts,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('[trackProductView] Error tracking product view:', error);
  }
}

/**
 * Track a search query
 * @param query - Search query string
 * @param userId - Optional user ID (for future DB-based tracking)
 */
export async function trackSearch(
  query: string,
  userId?: string
): Promise<void> {
  try {
    if (!query || query.trim().length === 0) return;

    const activity = await getUserActivity(userId);

    // Add search to the beginning of the list (most recent first)
    const updatedSearches = [
      query.trim(),
      ...activity.searches.filter((s) => s !== query.trim()),
    ].slice(0, MAX_ITEMS_PER_CATEGORY);

    await saveUserActivity({
      ...activity,
      searches: updatedSearches,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('[trackSearch] Error tracking search:', error);
  }
}

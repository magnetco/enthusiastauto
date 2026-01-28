/**
 * Next.js instrumentation file - runs on server startup
 * 
 * This fixes a bug where Cursor IDE injects a broken localStorage global
 * into Node.js via --localstorage-file flag without a valid path.
 * The broken localStorage object has methods that are not functions,
 * causing "localStorage.getItem is not a function" errors during SSR.
 */
export async function register() {
  // Only run on server (Node.js environment)
  if (typeof window === "undefined") {
    // Check if localStorage exists in global scope and is broken
    const globalObj = globalThis as Record<string, unknown>;
    
    if ("localStorage" in globalObj) {
      const storage = globalObj.localStorage as Record<string, unknown> | undefined;
      
      // Check if localStorage is broken (methods are not functions)
      if (
        storage &&
        (typeof storage.getItem !== "function" ||
          typeof storage.setItem !== "function" ||
          typeof storage.removeItem !== "function")
      ) {
        // Remove the broken localStorage from global scope
        delete globalObj.localStorage;
        console.log("[instrumentation] Removed broken localStorage global injected by Cursor IDE");
      }
    }
  }
}

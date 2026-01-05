import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth/config";
import { NextRequest } from "next/server";
import { writeFileSync } from "fs";

// #region agent log
const logToFile = (data: any) => {
  try {
    const logEntry = JSON.stringify(data) + '\n';
    writeFileSync('/Users/heggiedesign/Development/enthusiastauto/.cursor/debug.log', logEntry, { flag: 'a' });
  } catch {}
};
logToFile({location:'app/api/auth/[...nextauth]/route.ts:4',message:'Module loading - Initializing NextAuth handlers',data:{hasAuthConfig:!!authConfig},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'});
// #endregion

let handlers;
try {
  const nextAuthResult = NextAuth(authConfig);
  handlers = nextAuthResult.handlers;
  // #region agent log
  logToFile({location:'app/api/auth/[...nextauth]/route.ts:10',message:'NextAuth handlers initialized successfully',data:{hasHandlers:!!handlers,hasGET:!!handlers?.GET,hasPOST:!!handlers?.POST},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'});
  // #endregion
} catch (error) {
  // #region agent log
  logToFile({location:'app/api/auth/[...nextauth]/route.ts:13',message:'NextAuth initialization error',data:{error:error instanceof Error ? error.message : String(error),stack:error instanceof Error ? error.stack : undefined},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'});
  // #endregion
  throw error;
}

export const GET = async (request: NextRequest) => {
  // #region agent log
  logToFile({location:'app/api/auth/[...nextauth]/route.ts:20',message:'GET handler called',data:{url:request.url,method:request.method,requestType:request.constructor.name,hasCookies:!!request.cookies,hasNextUrl:!!request.nextUrl},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'});
  // #endregion
  try {
    // #region agent log
    logToFile({location:'app/api/auth/[...nextauth]/route.ts:33',message:'Before calling handlers.GET',data:{requestType:request.constructor.name,handlersGETType:typeof handlers.GET},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'});
    // #endregion
    const response = await handlers.GET(request);
    // #region agent log
    const responseText = await response.clone().text().catch(() => '');
    logToFile({location:'app/api/auth/[...nextauth]/route.ts:24',message:'GET handler response',data:{status:response.status,contentType:response.headers.get('content-type'),isHTML:responseText.startsWith('<!DOCTYPE'),responsePreview:responseText.substring(0,100)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'});
    // #endregion
    return response;
  } catch (error) {
    // #region agent log
    logToFile({location:'app/api/auth/[...nextauth]/route.ts:28',message:'GET handler error',data:{error:error instanceof Error ? error.message : String(error)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'});
    // #endregion
    throw error;
  }
};

export const POST = async (request: NextRequest) => {
  // #region agent log
  logToFile({location:'app/api/auth/[...nextauth]/route.ts:36',message:'POST handler called',data:{url:request.url,method:request.method,requestType:request.constructor.name,hasCookies:!!request.cookies,hasNextUrl:!!request.nextUrl},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'});
  // #endregion
  try {
    // #region agent log
    logToFile({location:'app/api/auth/[...nextauth]/route.ts:52',message:'Before calling handlers.POST',data:{requestType:request.constructor.name,handlersPOSTType:typeof handlers.POST},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'});
    // #endregion
    const response = await handlers.POST(request);
    // #region agent log
    const responseText = await response.clone().text().catch(() => '');
    logToFile({location:'app/api/auth/[...nextauth]/route.ts:40',message:'POST handler response',data:{status:response.status,contentType:response.headers.get('content-type'),isHTML:responseText.startsWith('<!DOCTYPE'),responsePreview:responseText.substring(0,100)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'});
    // #endregion
    return response;
  } catch (error) {
    // #region agent log
    logToFile({location:'app/api/auth/[...nextauth]/route.ts:44',message:'POST handler error',data:{error:error instanceof Error ? error.message : String(error)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'});
    // #endregion
    throw error;
  }
};

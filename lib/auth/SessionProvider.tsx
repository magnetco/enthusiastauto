"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import { ReactNode } from "react";

interface SessionProviderProps {
  children: ReactNode;
}

export function SessionProvider({ children }: SessionProviderProps) {
  // #region agent log
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
  const nextAuthUrl = process.env.NEXTAUTH_URL || baseUrl;
  fetch('http://127.0.0.1:7242/ingest/8e57bd47-1002-4b54-b949-1c0c7f037699',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/auth/SessionProvider.tsx:13',message:'SessionProvider initializing',data:{baseUrl,nextAuthUrl,hasWindow:typeof window !== 'undefined'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
  // #endregion

  return (
    <NextAuthSessionProvider>
      {children}
    </NextAuthSessionProvider>
  );
}

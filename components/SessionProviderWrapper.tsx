"use client";

import { createBrowserClient } from "@supabase/ssr";
import { SessionContextProvider } from "@supabase/auth-helpers-react";

interface SessionProviderWrapperProps {
  children: React.ReactNode;
  initialSession: any;
}

export default function SessionProviderWrapper({
  children,
  initialSession,
}: SessionProviderWrapperProps) {
  // Create the client on the client-side
  const supabaseClient = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={initialSession}
    >
      {children}
    </SessionContextProvider>
  );
}

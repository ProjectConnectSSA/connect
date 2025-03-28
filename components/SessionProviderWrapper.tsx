// components/SessionProviderWrapper.tsx

import { SessionContextProvider } from "@supabase/auth-helpers-react";

interface SessionProviderWrapperProps {
  children: React.ReactNode;
  initialSession: any;
  supabaseClient: any;
}

export default function SessionProviderWrapper({ children, initialSession, supabaseClient }: SessionProviderWrapperProps) {
  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={initialSession}>
      {children}
    </SessionContextProvider>
  );
}

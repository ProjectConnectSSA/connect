// app/layout.tsx
import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import SessionProviderWrapper from '@/components/SessionProviderWrapper';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Use the latest helper for server components.
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  return (
    <html>
      <head />
      <body>
        <SessionProviderWrapper supabaseClient={supabase} initialSession={session}>
          {children}
        </SessionProviderWrapper>
      </body>
    </html>
  );
}

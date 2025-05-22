// app/layout.tsx
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get the session data but don't pass the client
  const cookieStore = cookies();
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <html>
      <head />
      <body>
        <SessionProviderWrapper initialSession={session}>
          {children}
        </SessionProviderWrapper>
      </body>
    </html>
  );
}

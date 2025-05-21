// lib/supabase/client.ts
import { createBrowserClient } from "@supabase/ssr";

// Define a function that creates a Supabase client for the browser
export function createSupabaseBrowserClient() {
  // Ensure your NEXT_PUBLIC_ environment variables are set in .env.local
  // These are exposed to the browser.
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_URL");
  }
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

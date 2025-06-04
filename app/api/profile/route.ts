// app/api/profile/route.ts
import { createClient } from "@/lib/supabase/server"; // Ensure this is your server-side Supabase client
import { NextResponse } from "next/server";

// This interface should match the one in your ProfilePage.tsx
export interface ProfileApiResponse {
  id: string;
  email: string | undefined;
  fullName: string | null;
  avatarUrl: string | null;
  company: string | null; // Assumed to be from user_metadata
  planId: string | null;
  subscriptionStatus: string | null;
  currentPeriodEnd: string | null;
  usage: {
    links: { current: number | null; limit: number | null };
    forms: { current: number | null; limit: number | null };
    emails: { current: number | null; limit: number | null };
    landingPages: { current: number | null; limit: number | null };
  };
}

export async function GET(request: Request) {
  const supabase = createClient(); // Initialize client inside the handler

  try {
    // 1. Get the currently authenticated user
    const {
      data: { user },
      error: authError,
    } = await (await supabase).auth.getUser();

    if (authError) {
      console.error("API Profile - Auth Error:", authError.message);
      return NextResponse.json({ error: "Authentication failed: " + authError.message }, { status: 401 });
    }
    if (!user) {
      return NextResponse.json({ error: "No authenticated user found." }, { status: 401 });
    }

    // 2. Fetch data from the 'profiles' table
    const { data: profileDataFromTable, error: profileTableError } = await (
      await supabase
    )
      .from("profiles")
      .select(
        `
        full_name,
        avatar_url,
        plan_id,
        subscription_status,
        current_period_end,
        links_usage, 
        forms_usage,
        emails_usage,
        landing_pages_usage,
        current_links,
        current_forms,
        current_emails,
        current_landing_pages
      `
      )
      .eq("id", user.id)
      .single(); // Expecting one row for the user

    if (profileTableError && profileTableError.code !== "PGRST116") {
      // PGRST116: single row not found (no profile yet)

      // For other errors, throw to be caught by the general catch block
      return NextResponse.json({ error: "Failed to fetch profile details", details: profileTableError.message }, { status: 500 });
    }

    // 3. Construct the response payload according to ProfileApiResponse
    const responsePayload: ProfileApiResponse = {
      id: user.id,
      email: user.email,
      // Prioritize profiles table, then user_metadata for these fields
      fullName: profileDataFromTable?.full_name || user.user_metadata?.full_name || null,
      avatarUrl: profileDataFromTable?.avatar_url || user.user_metadata?.avatar_url || null,
      company: user.user_metadata?.company || null, // Assuming company comes from user_metadata

      // Fields directly from the 'profiles' table
      planId: profileDataFromTable?.plan_id || null,
      subscriptionStatus: profileDataFromTable?.subscription_status || null,
      currentPeriodEnd: profileDataFromTable?.current_period_end || null,

      // Construct the 'usage' object
      // Using nullish coalescing (?? null) to ensure type compatibility if DB fields are undefined/null
      usage: {
        links: {
          current: profileDataFromTable?.current_links ?? null,
          limit: profileDataFromTable?.links_usage ?? null,
        },
        forms: {
          current: profileDataFromTable?.current_forms ?? null,
          limit: profileDataFromTable?.forms_usage ?? null,
        },
        emails: {
          current: profileDataFromTable?.current_emails ?? null,
          limit: profileDataFromTable?.emails_usage ?? null,
        },
        landingPages: {
          current: profileDataFromTable?.current_landing_pages ?? null,
          limit: profileDataFromTable?.landing_pages_usage ?? null,
        },
      },
    };

    return NextResponse.json(responsePayload);
  } catch (error: any) {
    console.error("API Profile - General Error:", error.message, error.stack);
    return NextResponse.json({ error: "An unexpected error occurred while fetching profile data.", details: error.message }, { status: 500 });
  }
}

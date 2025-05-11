// app/api/profile/usage/route.ts
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// Define the structure the frontend expects
interface UsageStat {
  current: number;
  limit: number;
}
interface ProfileUsageResponse {
  links: UsageStat | null;
  forms: UsageStat | null;
  emails: UsageStat | null;
  landingPages: UsageStat | null;
}

export async function GET(request: Request) {
  const cookieStore = cookies();
  const supabase = createClient();

  try {
    // 1. Get the current user session
    const {
      data: { user },
      error: sessionError,
    } = await (await supabase).auth.getUser();

    if (sessionError || !user) {
      console.error("Usage API Error: User not authenticated.", sessionError);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = user.id;

    // 2. Fetch the specific usage and limit columns from the user's profile
    const { data: profile, error: fetchError } = await (
      await supabase
    )
      .from("profiles")
      .select(
        `
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
      .eq("id", userId)
      .single(); // Expect only one profile row per user

    if (fetchError) {
      // Handle case where profile might not exist yet, though the trigger should prevent this
      if (fetchError.code === "PGRST116") {
        console.warn(`Usage API Warning: Profile not found for user ${userId}. Returning defaults.`);
        // Return default structure with 0 current and potentially default limits (or 0)
        const defaultResponse: ProfileUsageResponse = {
          links: { current: 0, limit: 0 }, // Or fetch default limits from config
          forms: { current: 0, limit: 0 },
          emails: { current: 0, limit: 0 },
          landingPages: { current: 0, limit: 0 },
        };
        return NextResponse.json(defaultResponse, { status: 200 });
      }
      // Handle other database errors
      console.error("Usage API Fetch Error:", fetchError.message);
      return NextResponse.json({ error: "Failed to fetch usage data", details: fetchError.message }, { status: 500 });
    }

    if (!profile) {
      // Should ideally be caught by fetchError PGRST116, but as a fallback
      console.warn(`Usage API Warning: Profile is null for user ${userId}. Returning defaults.`);
      const defaultResponse: ProfileUsageResponse = {
        links: null,
        forms: null,
        emails: null,
        landingPages: null,
      };
      return NextResponse.json(defaultResponse, { status: 200 });
    }

    // 3. Structure the response data as expected by the frontend
    const responseData: ProfileUsageResponse = {
      links: {
        current: profile.current_links ?? 0, // Use nullish coalescing for safety
        limit: profile.links_usage ?? 0,
      },
      forms: {
        current: profile.current_forms ?? 0,
        limit: profile.forms_usage ?? 0,
      },
      emails: {
        current: profile.current_emails ?? 0,
        limit: profile.emails_usage ?? 0,
      },
      landingPages: {
        current: profile.current_landing_pages ?? 0,
        limit: profile.landing_pages_usage ?? 0,
      },
    };

    // 4. Return the structured data
    return NextResponse.json(responseData, { status: 200 });
  } catch (error: any) {
    console.error("Usage API Route Error:", error.message);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}

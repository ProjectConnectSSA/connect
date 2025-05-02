// app/api/notifications/route.ts
import { createClient } from "@/utils/supabase/server"; // Use SERVER client for API routes
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const cookieStore = cookies();
  const supabase = createClient(); // Create server client with cookies

  try {
    // 1. Get the current user session
    const {
      data: { session },
      error: sessionError,
    } = await (await supabase).auth.getSession();

    if (sessionError) {
      console.error("Session Error:", sessionError.message);
      return NextResponse.json({ error: "Failed to get session" }, { status: 500 });
    }

    if (!session?.user) {
      // Not logged in
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // 2. Fetch notifications for the logged-in user
    const { data: notifications, error: fetchError } = await (
      await supabase
    )
      .from("notifications")
      .select("*") // Select all columns
      .eq("user_id", userId) // Filter by the authenticated user's ID
      .order("created_at", { ascending: false }) // Order by newest first
      .limit(20); // Limit the number of notifications fetched initially

    if (fetchError) {
      console.error("Fetch Error:", fetchError.message);
      return NextResponse.json({ error: "Failed to fetch notifications", details: fetchError.message }, { status: 500 });
    }

    // 3. Return the notifications
    return NextResponse.json(notifications || [], { status: 200 });
  } catch (error: any) {
    console.error("API Route Error:", error.message);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}

// Add PATCH or POST handlers later for marking notifications as read
export async function PATCH(request: Request) {
  // Example: Mark specific notifications as read
  // - Get user ID
  // - Parse request body for notification IDs to mark read
  // - Update 'read_at' for those IDs where user_id matches
  // - RLS policy enforces ownership
  return NextResponse.json({ message: "PATCH endpoint not fully implemented yet" }, { status: 501 });
}

export async function POST(request: Request) {
  // Example: Mark ALL notifications as read
  // - Get user ID
  // - Update 'read_at = now()' for all notifications where user_id matches and read_at IS NULL
  // - RLS policy enforces ownership
  return NextResponse.json({ message: "POST endpoint not fully implemented yet" }, { status: 501 });
}
